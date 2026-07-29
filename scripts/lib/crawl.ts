/**
 * On-page / technical SEO crawl of the live site.
 *
 * This is the part no Google API gives you: titles, meta descriptions, heading
 * structure, word counts, image alt/dimension coverage, structured data,
 * internal link graph, orphan pages and broken links — read from the actual
 * production HTML.
 */

import {
  bullet,
  num,
  pathOf,
  table,
  trunc,
  type Action,
  type SectionResult,
} from "./fmt";
import { errMsg, fetchWithTimeout, mapLimit, normalizeUrl, safeJsonParse } from "./util";
import { IS_LOCAL_TARGET, PUBLIC_URL, USER_AGENT, type SitemapEntry } from "./site";

interface LinkRef {
  href: string;
  text: string;
  rel?: string;
  target?: string;
}

export interface PageCrawl {
  url: string;
  error?: string;
  status: number;
  finalUrl: string;
  redirected: boolean;
  ms: number;
  bytes: number;
  contentType?: string;
  cacheControl?: string;
  xRobotsTag?: string;
  title?: string;
  metaDescription?: string;
  metaRobots?: string;
  canonical?: string;
  lang?: string;
  hasViewport: boolean;
  hasCharset: boolean;
  h1: string[];
  h2: string[];
  h3: string[];
  wordCount: number;
  og: Record<string, string>;
  twitter: Record<string, string>;
  jsonLdTypes: string[];
  jsonLdErrors: number;
  images: { total: number; missingAlt: number; missingDims: number; nextImage: number; srcs: string[] };
  internalLinks: LinkRef[];
  externalLinks: LinkRef[];
}

function attr(tagAttrs: string, name: string): string | undefined {
  const m = tagAttrs.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s">]+))`, "i"));
  if (!m) return undefined;
  return (m[2] ?? m[3] ?? m[4] ?? "").trim();
}

/** Entities have to be decoded before measuring title/description length — `&amp;` is one character to Google, five to `String.length`. */
function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&amp;/g, "&");
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** Cloudflare's email-obfuscation endpoint and other /cdn-cgi/ paths aren't real pages. */
function isInfrastructurePath(url: string): boolean {
  return /\/cdn-cgi\//.test(url);
}

function headings(html: string, level: number): string[] {
  const out: string[] = [];
  const re = new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)</h${level}>`, "gi");
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) out.push(trunc(stripTags(m[1]), 90));
  return out;
}

function collectJsonLdTypes(value: unknown, out: Set<string>) {
  if (Array.isArray(value)) {
    for (const v of value) collectJsonLdTypes(v, out);
    return;
  }
  if (!value || typeof value !== "object") return;
  const obj = value as Record<string, unknown>;
  const t = obj["@type"];
  if (typeof t === "string") out.add(t);
  if (Array.isArray(t)) for (const x of t) if (typeof x === "string") out.add(x);
  for (const key of ["@graph", "mainEntity", "itemListElement", "hasPart", "author", "publisher"]) {
    if (key in obj) collectJsonLdTypes(obj[key], out);
  }
}

async function crawlPage(url: string): Promise<PageCrawl> {
  const started = Date.now();
  const base: PageCrawl = {
    url,
    status: 0,
    finalUrl: url,
    redirected: false,
    ms: 0,
    bytes: 0,
    hasViewport: false,
    hasCharset: false,
    h1: [],
    h2: [],
    h3: [],
    wordCount: 0,
    og: {},
    twitter: {},
    jsonLdTypes: [],
    jsonLdErrors: 0,
    images: { total: 0, missingAlt: 0, missingDims: 0, nextImage: 0, srcs: [] },
    internalLinks: [],
    externalLinks: [],
  };

  let html: string;
  let res: Response;
  try {
    res = await fetchWithTimeout(url, {
      headers: { "user-agent": USER_AGENT, accept: "text/html" },
      timeoutMs: 25_000,
    });
    html = await res.text();
  } catch (e) {
    return { ...base, error: errMsg(e), ms: Date.now() - started };
  }

  base.ms = Date.now() - started;
  base.status = res.status;
  base.finalUrl = res.url;
  base.redirected = res.redirected;
  base.bytes = new TextEncoder().encode(html).length;
  base.contentType = res.headers.get("content-type") ?? undefined;
  base.cacheControl = res.headers.get("cache-control") ?? undefined;
  base.xRobotsTag = res.headers.get("x-robots-tag") ?? undefined;

  const head = html.slice(0, html.search(/<\/head>/i) + 7 || html.length);

  base.title = decodeEntities((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim()) || undefined;
  base.lang = attr(html.match(/<html\b([^>]*)>/i)?.[1] ?? "", "lang");

  for (const tag of head.match(/<meta\b[^>]*>/gi) ?? []) {
    const attrs = tag.slice(5, -1);
    const name = (attr(attrs, "name") ?? "").toLowerCase();
    const property = (attr(attrs, "property") ?? "").toLowerCase();
    const content = decodeEntities(attr(attrs, "content") ?? "");
    if (name === "description") base.metaDescription = content;
    if (name === "robots") base.metaRobots = content;
    if (name === "viewport") base.hasViewport = true;
    if (attr(attrs, "charset")) base.hasCharset = true;
    if (property.startsWith("og:")) base.og[property] = content;
    if (name.startsWith("twitter:")) base.twitter[name] = content;
  }

  for (const tag of head.match(/<link\b[^>]*>/gi) ?? []) {
    const attrs = tag.slice(5, -1);
    if ((attr(attrs, "rel") ?? "").toLowerCase() === "canonical") base.canonical = attr(attrs, "href");
  }

  base.h1 = headings(html, 1);
  base.h2 = headings(html, 2);
  base.h3 = headings(html, 3);

  const bodyOnly = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<head[\s\S]*?<\/head>/gi, " ");
  base.wordCount = stripTags(bodyOnly).split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length;

  const ldTypes = new Set<string>();
  const ldRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let ld: RegExpExecArray | null;
  while ((ld = ldRe.exec(html))) {
    const parsed = safeJsonParse(ld[1].trim());
    if (parsed === null) base.jsonLdErrors++;
    else collectJsonLdTypes(parsed, ldTypes);
  }
  base.jsonLdTypes = [...ldTypes].sort();

  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    const attrs = tag.slice(4, -1);
    base.images.total++;
    const alt = attr(attrs, "alt");
    if (alt === undefined) base.images.missingAlt++;
    const hasDims = (attr(attrs, "width") && attr(attrs, "height")) || /aspect-ratio|position:\s*absolute/i.test(attr(attrs, "style") ?? "");
    if (!hasDims) base.images.missingDims++;
    const src = attr(attrs, "src") ?? "";
    if (src.includes("/_next/image") || (attr(attrs, "srcset") ?? "").includes("/_next/image")) {
      base.images.nextImage++;
    }
    if (src) base.images.srcs.push(src);
  }

  const aRe = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let a: RegExpExecArray | null;
  while ((a = aRe.exec(html))) {
    const href = attr(a[1], "href");
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript):/i.test(href)) continue;
    if (isInfrastructurePath(href)) continue;
    let abs: URL;
    try {
      abs = new URL(href, url);
    } catch {
      continue;
    }
    const ref: LinkRef = {
      href: normalizeUrl(abs.toString()),
      text: trunc(stripTags(a[2]), 50) || "(no text)",
      rel: attr(a[1], "rel"),
      target: attr(a[1], "target"),
    };
    if (abs.host === new URL(PUBLIC_URL).host) base.internalLinks.push(ref);
    else base.externalLinks.push(ref);
  }

  return base;
}

export async function crawlSection(
  sitemap: SitemapEntry[],
  log: (msg: string) => void
): Promise<SectionResult & { pages: PageCrawl[] }> {
  const urls = sitemap.map((e) => normalizeUrl(e.url));
  log(`Crawling ${urls.length} pages from the live site…`);

  const pages = await mapLimit(urls, 4, async (url) => {
    const p = await crawlPage(url);
    log(
      `  ${String(p.status).padEnd(4)} ${pathOf(p.url, PUBLIC_URL).padEnd(38)} ${p.ms}ms  ${num(p.wordCount)} words${
        p.error ? `  ERROR ${p.error}` : ""
      }`
    );
    return p;
  });

  const actions: Action[] = [];
  const ok = pages.filter((p) => !p.error && p.status === 200);

  // ---------- internal link graph ----------
  const crawledSet = new Set(urls);
  const inbound = new Map<string, { from: string; text: string }[]>();
  for (const u of urls) inbound.set(u, []);
  for (const p of ok) {
    const seenFromThisPage = new Set<string>();
    for (const l of p.internalLinks) {
      if (seenFromThisPage.has(l.href)) continue;
      seenFromThisPage.add(l.href);
      if (!inbound.has(l.href)) inbound.set(l.href, []);
      inbound.get(l.href)!.push({ from: p.url, text: l.text });
    }
  }

  // Internal targets that aren't in the sitemap — check they at least resolve.
  const offSitemapTargets = [...inbound.keys()].filter((u) => !crawledSet.has(u)).slice(0, 40);
  const linkStatuses = await mapLimit(offSitemapTargets, 5, async (u) => {
    try {
      let res = await fetchWithTimeout(u, {
        method: "HEAD",
        headers: { "user-agent": USER_AGENT },
        timeoutMs: 15_000,
      });
      if (res.status === 405 || res.status === 501) {
        res = await fetchWithTimeout(u, { headers: { "user-agent": USER_AGENT }, timeoutMs: 15_000 });
      }
      return { url: u, status: res.status };
    } catch (e) {
      return { url: u, status: 0, error: errMsg(e) };
    }
  });

  const broken = [
    ...pages.filter((p) => p.error || (p.status !== 200 && !p.redirected)),
    ...linkStatuses.filter((l) => l.status !== 200).map((l) => ({ url: l.url, status: l.status, error: undefined })),
  ];

  const orphans = ok.filter((p) => (inbound.get(p.url) ?? []).length === 0 && p.url !== normalizeUrl(PUBLIC_URL));

  // ---------- duplicates ----------
  const titleMap = new Map<string, string[]>();
  const descMap = new Map<string, string[]>();
  for (const p of ok) {
    if (p.title) {
      if (!titleMap.has(p.title)) titleMap.set(p.title, []);
      titleMap.get(p.title)!.push(p.url);
    }
    if (p.metaDescription) {
      if (!descMap.has(p.metaDescription)) descMap.set(p.metaDescription, []);
      descMap.get(p.metaDescription)!.push(p.url);
    }
  }
  const dupTitles = [...titleMap.entries()].filter(([, v]) => v.length > 1);
  const dupDescs = [...descMap.entries()].filter(([, v]) => v.length > 1);

  // ---------- per-page actions ----------
  for (const p of ok) {
    const path = pathOf(p.url, PUBLIC_URL);

    if (!p.title) {
      actions.push({ severity: "critical", area: "On-page", title: `${path} has no <title>`, detail: "The title is the single strongest on-page ranking and click signal." });
    } else if (p.title.length > 60) {
      actions.push({
        severity: "medium",
        area: "On-page",
        title: `${path} title is ${p.title.length} chars — Google will truncate it`,
        detail: `Aim for 50–60 chars with the target phrase first. Current: "${p.title}"`,
      });
    } else if (p.title.length < 30) {
      actions.push({
        severity: "low",
        area: "On-page",
        title: `${path} title is only ${p.title.length} chars — wasted space`,
        detail: `Add the service or qualifier you want to rank for. Current: "${p.title}"`,
      });
    }

    if (!p.metaDescription) {
      actions.push({
        severity: "high",
        area: "On-page",
        title: `${path} has no meta description`,
        detail: "Google will invent a snippet from page text. Write 140–160 chars stating the outcome for the reader — this drives CTR, which is your weakest metric.",
      });
    } else if (p.metaDescription.length > 165 || p.metaDescription.length < 70) {
      actions.push({
        severity: "low",
        area: "On-page",
        title: `${path} meta description is ${p.metaDescription.length} chars (want 140–160)`,
        detail: `Current: "${trunc(p.metaDescription, 180)}"`,
      });
    }

    if (p.h1.length === 0) {
      actions.push({ severity: "high", area: "On-page", title: `${path} has no <h1>`, detail: "Every page needs exactly one H1 that names the topic in the words a searcher would use." });
    } else if (p.h1.length > 1) {
      actions.push({
        severity: "medium",
        area: "On-page",
        title: `${path} has ${p.h1.length} <h1> tags`,
        detail: `Keep one: ${p.h1.map((h) => `"${h}"`).join(", ")}`,
      });
    }

    if (p.wordCount < 300) {
      actions.push({
        severity: "high",
        area: "Content",
        title: `${path} has only ${num(p.wordCount)} words of text`,
        detail: "Thin pages rarely rank for competitive phrases. Target 600+ words of genuinely useful copy: the problem, your approach, what you built, the result, and who it's for.",
      });
    }

    if (/noindex/i.test(p.metaRobots ?? "") || /noindex/i.test(p.xRobotsTag ?? "")) {
      actions.push({
        severity: "critical",
        area: "Indexing",
        title: `${path} is marked noindex`,
        detail: `robots meta: "${p.metaRobots ?? ""}" / X-Robots-Tag: "${p.xRobotsTag ?? ""}" — this page cannot appear in search.`,
      });
    }

    if (!p.canonical) {
      actions.push({ severity: "medium", area: "Indexing", title: `${path} has no canonical tag`, detail: "Add a self-referencing canonical so query-string variants don't split ranking signals." });
    } else if (
      // A local build correctly declares its production canonical, so comparing
      // it against the localhost URL flags every page. Compare paths instead.
      IS_LOCAL_TARGET
        ? new URL(p.canonical).pathname.replace(/\/+$/, "") !==
          new URL(p.url).pathname.replace(/\/+$/, "")
        : normalizeUrl(p.canonical) !== normalizeUrl(p.url)
    ) {
      actions.push({
        severity: "high",
        area: "Indexing",
        title: `${path} canonical points elsewhere: ${p.canonical}`,
        detail: "Unless this is a deliberate duplicate, a non-self canonical tells Google to ignore this page.",
      });
    }

    if (p.images.missingAlt > 0) {
      actions.push({
        severity: "medium",
        area: "Accessibility",
        title: `${path}: ${p.images.missingAlt} of ${p.images.total} images have no alt attribute`,
        detail: "Alt text is both an accessibility requirement and how images earn Google Images traffic. Describe the image; don't keyword-stuff.",
      });
    }
    if (p.images.missingDims > 0) {
      actions.push({
        severity: "medium",
        area: "Core Web Vitals",
        title: `${path}: ${p.images.missingDims} image(s) without explicit width/height`,
        detail: "Unsized images are the most common cause of layout shift — this is likely feeding your CLS failure. next/image with width+height (or fill + a sized parent) reserves the space.",
      });
    }

    if (!p.jsonLdTypes.length) {
      actions.push({
        severity: "medium",
        area: "Structured data",
        title: `${path} has no JSON-LD structured data`,
        detail: "Add schema.org markup so Google can render rich results: Person/Organization sitewide, BreadcrumbList on nested pages, Service on /ai-services, and SoftwareApplication or CreativeWork on project pages.",
      });
    }
    if (p.jsonLdErrors > 0) {
      actions.push({
        severity: "high",
        area: "Structured data",
        title: `${path} has ${p.jsonLdErrors} unparseable JSON-LD block(s)`,
        detail: "Invalid JSON-LD is silently ignored by Google. Validate at search.google.com/test/rich-results.",
      });
    }

    if (!p.og["og:image"]) {
      actions.push({
        severity: "low",
        area: "Social",
        title: `${path} has no og:image`,
        detail: "Links shared to LinkedIn/Slack/iMessage will render as bare text. Add a 1200×630 OG image.",
      });
    }
    if (!p.og["og:title"] || !p.og["og:description"]) {
      actions.push({
        severity: "low",
        area: "Social",
        title: `${path} is missing og:title or og:description`,
        detail: "Next.js metadata `openGraph` fills these in; set them per page.",
      });
    }
  }

  if (dupTitles.length) {
    actions.push({
      severity: "high",
      area: "On-page",
      title: `${dupTitles.length} duplicate <title> across pages`,
      detail: dupTitles.map(([t, urls]) => `"${trunc(t, 60)}" → ${urls.map((u) => pathOf(u, PUBLIC_URL)).join(", ")}`).join("; "),
    });
  }
  if (dupDescs.length) {
    actions.push({
      severity: "medium",
      area: "On-page",
      title: `${dupDescs.length} duplicate meta description(s)`,
      detail: dupDescs.map(([, urls]) => urls.map((u) => pathOf(u, PUBLIC_URL)).join(", ")).join("; "),
    });
  }
  for (const o of orphans) {
    actions.push({
      severity: "high",
      area: "Internal links",
      title: `${pathOf(o.url, PUBLIC_URL)} is orphaned — no other page links to it`,
      detail: "Google discovers and weights pages through internal links; a sitemap entry alone is a weak signal. Link to it from the homepage or a relevant project page with descriptive anchor text.",
    });
  }
  for (const b of broken) {
    actions.push({
      severity: "critical",
      area: "Links",
      title: `Broken URL: ${pathOf(b.url, PUBLIC_URL)} returned ${b.status || "network error"}`,
      detail: b.error ?? "Fix or remove the link — broken links waste crawl budget and frustrate visitors.",
    });
  }

  // ---------- tables ----------
  const overviewRows = pages.map((p) => [
    pathOf(p.url, PUBLIC_URL),
    p.error ? "ERR" : String(p.status),
    `${p.ms}ms`,
    `${(p.bytes / 1024).toFixed(0)}k`,
    p.title ? String(p.title.length) : "—",
    p.metaDescription ? String(p.metaDescription.length) : "—",
    String(p.h1.length),
    String(p.h2.length),
    num(p.wordCount),
    `${p.images.total}`,
    `${p.images.missingAlt}`,
    `${p.images.missingDims}`,
    String(p.internalLinks.length),
    String((inbound.get(p.url) ?? []).length),
    p.jsonLdTypes.length ? String(p.jsonLdTypes.length) : "0",
  ]);

  const metaRows = ok.map((p) => [
    pathOf(p.url, PUBLIC_URL),
    trunc(p.title ?? "(missing)", 62),
    trunc(p.metaDescription ?? "(missing)", 90),
  ]);

  const techRows = ok.map((p) => [
    pathOf(p.url, PUBLIC_URL),
    p.lang ?? "—",
    p.hasViewport ? "✓" : "✗",
    p.canonical ? (normalizeUrl(p.canonical) === normalizeUrl(p.url) ? "self ✓" : `→ ${trunc(p.canonical, 30)}`) : "✗",
    p.metaRobots ?? "—",
    p.xRobotsTag ?? "—",
    trunc(p.cacheControl ?? "—", 34),
    p.og["og:image"] ? "✓" : "✗",
    p.twitter["twitter:card"] ?? "—",
    p.jsonLdTypes.join(", ") || "(none)",
  ]);

  const headingRows: (string | number)[][] = [];
  for (const p of ok) {
    headingRows.push([pathOf(p.url, PUBLIC_URL), "H1", p.h1.join(" | ") || "(none)"]);
    if (p.h2.length) headingRows.push(["", "H2", trunc(p.h2.join(" | "), 150)]);
    if (p.h3.length) headingRows.push(["", "H3", trunc(p.h3.join(" | "), 150)]);
  }

  const inboundRows = [...inbound.entries()]
    .filter(([u]) => crawledSet.has(u))
    .sort((a, b) => b[1].length - a[1].length)
    .map(([u, refs]) => [
      pathOf(u, PUBLIC_URL),
      String(refs.length),
      trunc([...new Set(refs.map((r) => r.text))].join(" / "), 70),
      trunc([...new Set(refs.map((r) => pathOf(r.from, PUBLIC_URL)))].join(", "), 50),
    ]);

  const externalDomains = new Map<string, number>();
  for (const p of ok) {
    for (const l of p.externalLinks) {
      try {
        const host = new URL(l.href).host;
        externalDomains.set(host, (externalDomains.get(host) ?? 0) + 1);
      } catch {
        /* ignore */
      }
    }
  }

  const sitemapMap = new Map(sitemap.map((e) => [normalizeUrl(e.url), e]));
  const sitemapRows = [...sitemapMap.values()].map((e) => [
    pathOf(normalizeUrl(e.url), PUBLIC_URL),
    e.lastModified?.slice(0, 10) ?? "—",
    e.changeFrequency ?? "—",
    e.priority ?? "—",
    crawledSet.has(normalizeUrl(e.url)) ? "crawled" : "—",
  ]);

  const staleSitemap = sitemap.filter((e) => {
    if (!e.lastModified) return false;
    const d = new Date(e.lastModified);
    return Date.now() - d.getTime() > 90 * 864e5;
  });
  if (staleSitemap.length) {
    actions.push({
      severity: "low",
      area: "Indexing",
      title: `${staleSitemap.length} sitemap entr${staleSitemap.length === 1 ? "y has" : "ies have"} a lastmod older than 90 days`,
      detail:
        "Your sitemap's lastModified is hardcoded in app/sitemap.ts. Either keep it current when you change a page, or derive it per-page — a stale lastmod tells Google not to bother re-crawling.",
    });
  }

  const totalMissingAlt = ok.reduce((a, p) => a + p.images.missingAlt, 0);
  const totalMissingDims = ok.reduce((a, p) => a + p.images.missingDims, 0);
  const avgWords = ok.length ? ok.reduce((a, p) => a + p.wordCount, 0) / ok.length : 0;

  const summary = [
    `**Pages crawled:** ${ok.length}/${pages.length} returned 200`,
    `**Avg word count:** ${num(avgWords)} (thin: ${ok.filter((p) => p.wordCount < 300).length} page(s) under 300)`,
    `**Images missing alt:** ${totalMissingAlt} · **missing dimensions:** ${totalMissingDims}`,
    `**Orphan pages:** ${orphans.length} · **broken URLs:** ${broken.length}`,
    `**Pages without structured data:** ${ok.filter((p) => !p.jsonLdTypes.length).length}`,
  ];

  const body = [
    `### Page inventory`,
    table(
      ["page", "status", "ttfb", "size", "title", "desc", "h1", "h2", "words", "img", "no-alt", "no-dims", "out-links", "in-links", "ld+json"],
      overviewRows,
      ["l", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r", "r"]
    ),
    `_title/desc columns are character counts (want 50–60 and 140–160). "in-links" counts other pages linking here — 0 means orphaned._`,
    ``,
    `### Titles and meta descriptions as Google sees them`,
    table(["page", "title", "meta description"], metaRows),
    ``,
    `### Technical head tags`,
    table(
      ["page", "lang", "viewport", "canonical", "robots", "x-robots", "cache-control", "og:image", "twitter", "structured data"],
      techRows
    ),
    ``,
    `### Heading structure`,
    table(["page", "level", "headings"], headingRows),
    ``,
    `### Internal link graph (inbound links per page)`,
    table(["page", "inbound", "anchor text used", "linked from"], inboundRows, ["l", "r", "l", "l"]),
    ``,
    `### External links by domain`,
    table(
      ["domain", "links"],
      [...externalDomains.entries()].sort((a, b) => b[1] - a[1]).map(([d, c]) => [d, String(c)]),
      ["l", "r"]
    ),
    ``,
    `### Internal link targets outside the sitemap`,
    table(
      ["url", "status"],
      linkStatuses.map((l) => [pathOf(l.url, PUBLIC_URL), String(l.status || "network error")]),
      ["l", "r"]
    ),
    ``,
    `### Sitemap entries`,
    table(["page", "lastmod", "changefreq", "priority", "crawl"], sitemapRows),
    ``,
    `### Duplicate content signals`,
    bullet([
      ...dupTitles.map(([t, urls]) => `Duplicate title "${trunc(t, 60)}" on ${urls.map((u) => pathOf(u, PUBLIC_URL)).join(", ")}`),
      ...dupDescs.map(([d, urls]) => `Duplicate description "${trunc(d, 50)}" on ${urls.map((u) => pathOf(u, PUBLIC_URL)).join(", ")}`),
    ]),
    ``,
    `### Crawl errors`,
    bullet(pages.filter((p) => p.error).map((p) => `${pathOf(p.url, PUBLIC_URL)}: ${p.error}`)),
  ].join("\n");

  return {
    heading: "On-page crawl (live HTML)",
    body,
    summary,
    actions,
    pages,
    snapshot: {
      pagesCrawled: pages.length,
      pagesOk: ok.length,
      avgWordCount: Math.round(avgWords),
      thinPages: ok.filter((p) => p.wordCount < 300).length,
      missingAlt: totalMissingAlt,
      missingDims: totalMissingDims,
      orphanPages: orphans.length,
      brokenUrls: broken.length,
      pagesWithoutStructuredData: ok.filter((p) => !p.jsonLdTypes.length).length,
      duplicateTitles: dupTitles.length,
    },
  };
}
