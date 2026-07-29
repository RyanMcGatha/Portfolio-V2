/**
 * Resolves which URLs the report should analyze. The live sitemap is the source
 * of truth (that's what Google reads), with a static fallback if it can't be
 * fetched so the report still runs offline-ish.
 */

import { fetchWithTimeout, errMsg } from "./util";

/**
 * The site being crawled. Override with SEO_BASE_URL to audit a local build
 * before deploying, e.g.:
 *   npm run build && npm start
 *   SEO_BASE_URL=http://localhost:3000 npm run seo:report -- --no-psi
 * GSC/GA4 always report on the real property regardless of this value.
 */
export const PUBLIC_URL = (process.env.SEO_BASE_URL ?? "https://ryanm.info").replace(/\/+$/, "");
export const IS_LOCAL_TARGET = !PUBLIC_URL.includes("ryanm.info");
export const SITEMAP_URL = `${PUBLIC_URL}/sitemap.xml`;
export const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) seo-report/1.0 Chrome/124.0 Safari/537.36";

const FALLBACK_PATHS = [
  "/",
  "/web-development",
  "/ai-services",
  "/projects",
  "/contact",
  "/projects/cca-email-suite",
  "/projects/push-it-messaging",
  "/projects/sullys-franchise-management",
  "/projects/fastapi-tutorial",
];

export interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?: string;
  priority?: string;
}

export interface SitemapResult {
  entries: SitemapEntry[];
  source: "sitemap" | "fallback";
  error?: string;
  rawSize?: number;
}

function tagValue(block: string, tag: string): string | undefined {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].trim() : undefined;
}

export async function fetchSitemap(): Promise<SitemapResult> {
  try {
    const res = await fetchWithTimeout(SITEMAP_URL, {
      headers: { "user-agent": USER_AGENT },
      timeoutMs: 15_000,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const entries: SitemapEntry[] = [];
    for (const block of xml.match(/<url>[\s\S]*?<\/url>/gi) ?? []) {
      const loc = tagValue(block, "loc");
      if (!loc) continue;
      entries.push({
        // A local build still emits production URLs in its sitemap, so point
        // them back at the origin actually being crawled.
        url: IS_LOCAL_TARGET ? loc.replace(/^https?:\/\/[^/]+/, PUBLIC_URL) : loc,
        lastModified: tagValue(block, "lastmod"),
        changeFrequency: tagValue(block, "changefreq"),
        priority: tagValue(block, "priority"),
      });
    }
    if (!entries.length) throw new Error("no <loc> entries parsed");
    return { entries, source: "sitemap", rawSize: xml.length };
  } catch (e) {
    return {
      entries: FALLBACK_PATHS.map((p) => ({ url: `${PUBLIC_URL}${p === "/" ? "/" : p}` })),
      source: "fallback",
      error: errMsg(e),
    };
  }
}

export interface TechCheck {
  name: string;
  ok: boolean | null;
  detail: string;
}

interface RobotsGroup {
  agents: string[];
  allow: string[];
  disallow: string[];
}

/**
 * robots.txt is a set of user-agent groups, not a flat list of rules — a
 * `Disallow: /` under `User-agent: GPTBot` says nothing about Googlebot.
 * Cloudflare injects exactly that kind of managed block, so the parse has to be
 * group-aware or every Cloudflare site looks blocked.
 */
export function parseRobots(txt: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];
  let current: RobotsGroup | null = null;
  let lastLineWasAgent = false;

  for (const raw of txt.split("\n")) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();

    if (key === "user-agent") {
      // Consecutive User-agent lines share one rule block.
      if (!current || !lastLineWasAgent) {
        current = { agents: [], allow: [], disallow: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastLineWasAgent = true;
      continue;
    }
    lastLineWasAgent = false;
    if (!current) continue;
    if (key === "allow") current.allow.push(value);
    if (key === "disallow") current.disallow.push(value);
  }
  return groups;
}

const SEARCH_AGENTS = ["*", "googlebot", "googlebot-image", "bingbot"];

/**
 * Cheap protocol-level checks that don't need any Google API: robots.txt,
 * http→https, www→apex, and whether unknown paths return a real 404 rather
 * than a soft-404 (a 200 with "not found" content, which Google indexes).
 */
export async function technicalChecks(): Promise<TechCheck[]> {
  const checks: TechCheck[] = [];

  // robots.txt
  try {
    const res = await fetchWithTimeout(`${PUBLIC_URL}/robots.txt`, {
      headers: { "user-agent": USER_AGENT },
      timeoutMs: 10_000,
    });
    const txt = res.ok ? await res.text() : "";
    checks.push({
      name: "robots.txt reachable",
      ok: res.ok,
      detail: res.ok ? `HTTP 200, ${txt.length} bytes` : `HTTP ${res.status}`,
    });
    if (res.ok) {
      const hasSitemap = /sitemap:/i.test(txt);
      checks.push({
        name: "robots.txt declares sitemap",
        ok: hasSitemap,
        detail: hasSitemap
          ? (txt.match(/sitemap:.*/i)?.[0] ?? "").trim()
          : "no `Sitemap:` line — add one so crawlers find it without GSC",
      });
      const groups = parseRobots(txt);
      const searchGroups = groups.filter((g) =>
        g.agents.some((a) => SEARCH_AGENTS.includes(a) || a.startsWith("googlebot"))
      );
      const blocked = searchGroups.filter((g) => g.disallow.includes("/") && !g.allow.includes("/"));
      checks.push({
        name: "search crawlers are allowed",
        ok: blocked.length === 0,
        detail: blocked.length
          ? `\`Disallow: /\` applies to ${blocked.flatMap((g) => g.agents).join(", ")} — these crawlers are blocked`
          : `Googlebot/* groups allow crawling`,
      });

      // Blocked AI crawlers aren't an error, but you should know they're there —
      // Cloudflare adds this block by default and it's easy to miss.
      const aiBlocked = groups
        .filter((g) => g.disallow.includes("/") && !g.agents.some((a) => SEARCH_AGENTS.includes(a)))
        .flatMap((g) => g.agents);
      if (aiBlocked.length) {
        checks.push({
          name: "AI crawler policy (informational)",
          ok: true,
          detail: `blocked: ${aiBlocked.join(", ")} — normal Google Search indexing is unaffected, but blocking Google-Extended/GPTBot/ClaudeBot keeps the site out of AI assistant answers`,
        });
      }
    }
  } catch (e) {
    checks.push({ name: "robots.txt reachable", ok: false, detail: errMsg(e) });
  }

  // Host-level checks only make sense against the real domain.
  if (IS_LOCAL_TARGET) {
    checks.push({
      name: "host checks (http→https, www, 404)",
      ok: null,
      detail: `skipped — auditing ${PUBLIC_URL}, not the production host`,
    });
    return checks;
  }

  // http -> https
  try {
    const res = await fetchWithTimeout("http://ryanm.info/", {
      redirect: "manual",
      headers: { "user-agent": USER_AGENT },
      timeoutMs: 10_000,
    });
    const loc = res.headers.get("location") ?? "";
    const ok = res.status >= 300 && res.status < 400 && loc.startsWith("https://");
    checks.push({
      name: "http:// redirects to https://",
      ok,
      detail: `HTTP ${res.status}${loc ? ` → ${loc}` : ""}`,
    });
  } catch (e) {
    checks.push({ name: "http:// redirects to https://", ok: null, detail: errMsg(e) });
  }

  // www -> apex (or at least a consistent single canonical host)
  try {
    const res = await fetchWithTimeout("https://www.ryanm.info/", {
      redirect: "manual",
      headers: { "user-agent": USER_AGENT },
      timeoutMs: 10_000,
    });
    const loc = res.headers.get("location") ?? "";
    const redirects = res.status >= 300 && res.status < 400;
    checks.push({
      name: "www redirects to apex",
      ok: redirects ? loc.includes("//ryanm.info") : res.status >= 400 ? true : false,
      detail: redirects
        ? `HTTP ${res.status} → ${loc}`
        : res.status >= 400
          ? `HTTP ${res.status} (www not served at all — fine, no duplicate host)`
          : `HTTP ${res.status} — www serves content directly, duplicate-host risk`,
    });
  } catch (e) {
    // DNS not configured for www is an acceptable outcome.
    checks.push({ name: "www redirects to apex", ok: true, detail: `not resolvable (${errMsg(e)})` });
  }

  // Soft-404 detection
  try {
    const res = await fetchWithTimeout(`${PUBLIC_URL}/this-page-should-not-exist-${Date.now()}`, {
      headers: { "user-agent": USER_AGENT },
      timeoutMs: 10_000,
    });
    checks.push({
      name: "missing pages return HTTP 404",
      ok: res.status === 404,
      detail:
        res.status === 404
          ? "HTTP 404 ✓"
          : `HTTP ${res.status} — soft 404, Google may index junk URLs`,
    });
  } catch (e) {
    checks.push({ name: "missing pages return HTTP 404", ok: null, detail: errMsg(e) });
  }

  return checks;
}
