/**
 * Google Search Console section.
 *
 * Everything here answers one of three questions:
 *   1. Is Google indexing the site at all?      (sitemaps + URL inspection)
 *   2. What is it ranking us for, and moving?   (queries/pages, period-over-period)
 *   3. Where's the cheapest available win?      (striking distance, zero-click, CTR gaps)
 */

import { google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";
import type { AuthResult } from "./auth";
import {
  bullet,
  delta,
  num,
  pathOf,
  pctOf,
  sparkline,
  table,
  trunc,
  type Action,
  type SectionResult,
} from "./fmt";
import { errMsg, mapLimit } from "./util";
import { PUBLIC_URL } from "./site";

type Row = {
  keys?: string[] | null;
  clicks?: number | null;
  impressions?: number | null;
  ctr?: number | null;
  position?: number | null;
};

type Totals = { clicks: number; impressions: number; ctr: number; position: number };

const BRAND_RE = /ryan|mcgatha|ryanm/i;

function authFor(auth: AuthResult, scope: string): OAuth2Client | InstanceType<typeof google.auth.GoogleAuth> {
  return auth.kind === "oauth"
    ? auth.authClient!
    : new google.auth.GoogleAuth({ scopes: [scope] });
}

function agoDate(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function sumRows(rows: Row[]): Totals {
  const clicks = rows.reduce((a, r) => a + (r.clicks ?? 0), 0);
  const impressions = rows.reduce((a, r) => a + (r.impressions ?? 0), 0);
  // Position must be impression-weighted; a plain average over rows lies.
  const weighted = rows.reduce((a, r) => a + (r.position ?? 0) * (r.impressions ?? 0), 0);
  return {
    clicks,
    impressions,
    ctr: impressions ? clicks / impressions : 0,
    position: impressions ? weighted / impressions : 0,
  };
}

export async function gscSection(
  auth: AuthResult,
  siteUrl: string,
  /** URLs to run through the URL Inspection API — normally the live sitemap. */
  inspectTargets: string[]
): Promise<SectionResult> {
  const webmasters = google.webmasters({ version: "v3", auth: authFor(auth, "https://www.googleapis.com/auth/webmasters.readonly") as never });
  const searchconsole = google.searchconsole({ version: "v1", auth: authFor(auth, "https://www.googleapis.com/auth/webmasters.readonly") as never });

  // GSC data lags ~2 days, so the "current" window ends there.
  const curEnd = agoDate(2);
  const curStart = agoDate(29);
  const prevEnd = agoDate(30);
  const prevStart = agoDate(57);

  const errors: string[] = [];
  const actions: Action[] = [];

  async function query(
    label: string,
    body: Record<string, unknown>
  ): Promise<Row[]> {
    try {
      const res = await webmasters.searchanalytics.query({
        siteUrl,
        requestBody: body as never,
      });
      return (res.data.rows ?? []) as Row[];
    } catch (e) {
      errors.push(`${label}: ${errMsg(e)}`);
      return [];
    }
  }

  const [
    curTotals,
    prevTotals,
    daily,
    monthly,
    curQueries,
    prevQueries,
    curPages,
    prevPages,
    queryPagePairs,
    countries,
    devices,
    appearance,
    imageTotals,
    videoTotals,
  ] = await Promise.all([
    query("totals (current)", { startDate: curStart, endDate: curEnd }),
    query("totals (previous)", { startDate: prevStart, endDate: prevEnd }),
    query("daily", { startDate: curStart, endDate: curEnd, dimensions: ["date"], rowLimit: 100 }),
    query("monthly", { startDate: agoDate(480), endDate: curEnd, dimensions: ["date"], rowLimit: 500 }),
    query("queries (current)", { startDate: curStart, endDate: curEnd, dimensions: ["query"], rowLimit: 500 }),
    query("queries (previous)", { startDate: prevStart, endDate: prevEnd, dimensions: ["query"], rowLimit: 500 }),
    query("pages (current)", { startDate: curStart, endDate: curEnd, dimensions: ["page"], rowLimit: 200 }),
    query("pages (previous)", { startDate: prevStart, endDate: prevEnd, dimensions: ["page"], rowLimit: 200 }),
    query("query+page", { startDate: curStart, endDate: curEnd, dimensions: ["page", "query"], rowLimit: 200 }),
    query("countries", { startDate: curStart, endDate: curEnd, dimensions: ["country"], rowLimit: 25 }),
    query("devices", { startDate: curStart, endDate: curEnd, dimensions: ["device"], rowLimit: 5 }),
    query("searchAppearance", { startDate: curStart, endDate: curEnd, dimensions: ["searchAppearance"], rowLimit: 25 }),
    query("image search", { startDate: curStart, endDate: curEnd, type: "image" }),
    query("video search", { startDate: curStart, endDate: curEnd, type: "video" }),
  ]);

  const cur = sumRows(curTotals);
  const prev = sumRows(prevTotals);

  // ---------- trend ----------
  const dailySorted = [...daily].sort((a, b) => (a.keys?.[0] ?? "").localeCompare(b.keys?.[0] ?? ""));
  const dailyImpr = dailySorted.map((r) => r.impressions ?? 0);
  const dailyClicks = dailySorted.map((r) => r.clicks ?? 0);

  const monthBuckets = new Map<string, Row[]>();
  for (const r of monthly) {
    const key = (r.keys?.[0] ?? "").slice(0, 7);
    if (!key) continue;
    if (!monthBuckets.has(key)) monthBuckets.set(key, []);
    monthBuckets.get(key)!.push(r);
  }
  const monthlyRows = [...monthBuckets.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, rows]) => {
      const t = sumRows(rows);
      return [month, num(t.clicks), num(t.impressions), pctOf(t.ctr), t.position.toFixed(1)];
    });

  // ---------- queries ----------
  const prevQueryMap = new Map(prevQueries.map((r) => [r.keys?.[0] ?? "", r]));
  const curQueryMap = new Map(curQueries.map((r) => [r.keys?.[0] ?? "", r]));

  const queryRows = curQueries
    .slice(0, 50)
    .map((r) => {
      const k = r.keys?.[0] ?? "";
      const p = prevQueryMap.get(k);
      return [
        trunc(k, 52),
        num(r.clicks ?? 0),
        num(r.impressions ?? 0),
        pctOf(r.ctr ?? 0),
        (r.position ?? 0).toFixed(1),
        p ? ((r.position ?? 0) - (p.position ?? 0)).toFixed(1) : "new",
      ];
    });

  const newQueries = curQueries
    .filter((r) => !prevQueryMap.has(r.keys?.[0] ?? ""))
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
    .slice(0, 25);
  const lostQueries = prevQueries
    .filter((r) => !curQueryMap.has(r.keys?.[0] ?? ""))
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
    .slice(0, 25);

  // Striking distance: page 1–2 but not getting clicks. The impression floor is
  // deliberately 1 — a site this size has nothing above 10 to filter on.
  const striking = curQueries
    .filter((r) => (r.position ?? 99) >= 4 && (r.position ?? 99) <= 20)
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
    .slice(0, 30);

  const zeroClick = curQueries
    .filter((r) => (r.clicks ?? 0) === 0 && (r.impressions ?? 0) >= 3)
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
    .slice(0, 25);

  const buckets = [
    { label: "1–3   (top of page 1)", min: 0, max: 3.999 },
    { label: "4–10  (rest of page 1)", min: 4, max: 10.999 },
    { label: "11–20 (page 2)", min: 11, max: 20.999 },
    { label: "21–50 (page 3–5)", min: 21, max: 50.999 },
    { label: "51+   (invisible)", min: 51, max: Infinity },
  ].map((b) => {
    const rows = curQueries.filter((r) => (r.position ?? 999) >= b.min && (r.position ?? 999) <= b.max);
    const t = sumRows(rows);
    return [b.label, num(rows.length), num(t.impressions), num(t.clicks), pctOf(t.ctr)];
  });

  const branded = sumRows(curQueries.filter((r) => BRAND_RE.test(r.keys?.[0] ?? "")));
  const nonBranded = sumRows(curQueries.filter((r) => !BRAND_RE.test(r.keys?.[0] ?? "")));

  const queryImpressionTotal = sumRows(curQueries).impressions;
  const anonymizedShare = cur.impressions
    ? Math.max(0, cur.impressions - queryImpressionTotal) / cur.impressions
    : 0;

  // ---------- pages ----------
  const prevPageMap = new Map(prevPages.map((r) => [r.keys?.[0] ?? "", r]));
  const pageRows = curPages.map((r) => {
    const k = r.keys?.[0] ?? "";
    const p = prevPageMap.get(k);
    return [
      pathOf(k, PUBLIC_URL),
      num(r.clicks ?? 0),
      num(r.impressions ?? 0),
      pctOf(r.ctr ?? 0),
      (r.position ?? 0).toFixed(1),
      p ? `${(r.impressions ?? 0) - (p.impressions ?? 0) >= 0 ? "+" : ""}${(r.impressions ?? 0) - (p.impressions ?? 0)}` : "new",
    ];
  });

  // Which query does each page actually rank for? Best 3 per page.
  const byPage = new Map<string, Row[]>();
  for (const r of queryPagePairs) {
    const page = r.keys?.[0] ?? "";
    if (!byPage.has(page)) byPage.set(page, []);
    byPage.get(page)!.push(r);
  }
  const pairRows: (string | number)[][] = [];
  for (const [page, rows] of [...byPage.entries()].sort(
    (a, b) => sumRows(b[1]).impressions - sumRows(a[1]).impressions
  )) {
    for (const r of rows.sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0)).slice(0, 5)) {
      pairRows.push([
        pathOf(page, PUBLIC_URL),
        trunc(r.keys?.[1] ?? "", 44),
        num(r.clicks ?? 0),
        num(r.impressions ?? 0),
        (r.position ?? 0).toFixed(1),
      ]);
    }
  }

  // ---------- sitemaps ----------
  let sitemapRows: (string | number)[][] = [];
  try {
    const list = await webmasters.sitemaps.list({ siteUrl });
    sitemapRows = (list.data.sitemap ?? []).map((s) => [
      s.path ?? "?",
      (s.lastSubmitted ?? "?").slice(0, 10),
      (s.lastDownloaded ?? "never").slice(0, 10),
      String(s.contents?.[0]?.submitted ?? "?"),
      String(s.warnings ?? 0),
      String(s.errors ?? 0),
      String(s.isPending ?? false),
    ]);
    for (const s of list.data.sitemap ?? []) {
      if (Number(s.errors ?? 0) > 0) {
        actions.push({
          severity: "high",
          area: "Indexing",
          title: `Sitemap ${s.path} reports ${s.errors} error(s)`,
          detail: "Open Search Console → Sitemaps and fix the listed errors; a failing sitemap slows discovery of new pages.",
        });
      }
      if (!s.lastDownloaded) {
        actions.push({
          severity: "high",
          area: "Indexing",
          title: `Sitemap ${s.path} has never been downloaded by Google (submitted ${(s.lastSubmitted ?? "?").slice(0, 10)}${s.isPending ? ", still pending" : ""})`,
          detail:
            "Google has the submission but hasn't fetched the file, so new URLs are only discovered by crawling links. Confirm it loads publicly, re-submit with `npm run seo:reindex`, and check the Sitemaps report in GSC for a fetch error.",
        });
      }
    }
  } catch (e) {
    errors.push(`sitemaps.list: ${errMsg(e)}`);
  }

  // ---------- per-URL index status ----------
  const norm = (s: string) => s.replace(/\/+$/, "").replace(/^http:/, "https:").toLowerCase();
  let indexedCount = 0;
  const inspectRows = await mapLimit(inspectTargets, 3, async (url) => {
    try {
      const res = await searchconsole.urlInspection.index.inspect({
        requestBody: { inspectionUrl: url, siteUrl },
      });
      const r = res.data.inspectionResult;
      const idx = r?.indexStatusResult;
      const coverage = idx?.coverageState ?? "?";
      const isIndexed = /indexed/i.test(coverage) && !/not indexed/i.test(coverage);
      if (isIndexed) indexedCount++;

      const canonicalMismatch =
        idx?.userCanonical && idx?.googleCanonical && norm(idx.userCanonical) !== norm(idx.googleCanonical);

      if (!isIndexed) {
        actions.push({
          severity: "critical",
          area: "Indexing",
          title: `${pathOf(url, PUBLIC_URL)} is not indexed (${coverage})`,
          detail:
            "A page that isn't indexed can never rank. Open GSC → URL Inspection → Request Indexing, and make sure the page is internally linked from a page Google already crawls.",
        });
      }
      if (canonicalMismatch) {
        actions.push({
          severity: "high",
          area: "Indexing",
          title: `Canonical mismatch on ${pathOf(url, PUBLIC_URL)}`,
          detail: `You declare ${idx?.userCanonical}, Google chose ${idx?.googleCanonical}. Google is treating another URL as the real one, so your rankings consolidate elsewhere.`,
        });
      }
      const mobileVerdict = r?.mobileUsabilityResult?.verdict ?? "?";
      if (mobileVerdict === "FAIL") {
        actions.push({
          severity: "high",
          area: "Mobile",
          title: `Mobile usability issues on ${pathOf(url, PUBLIC_URL)}`,
          detail: (r?.mobileUsabilityResult?.issues ?? [])
            .map((i) => `${i.issueType}: ${i.message}`)
            .join("; "),
        });
      }

      const richTypes = (r?.richResultsResult?.detectedItems ?? [])
        .map((d) => `${d.richResultType}(${d.items?.length ?? 0})`)
        .join(", ");

      return [
        pathOf(url, PUBLIC_URL),
        idx?.verdict ?? "?",
        coverage,
        (idx?.lastCrawlTime ?? "never").slice(0, 10),
        idx?.robotsTxtState ?? "?",
        idx?.pageFetchState ?? "?",
        canonicalMismatch ? "⚠ mismatch" : "ok",
        mobileVerdict,
        richTypes || "none",
        String(idx?.referringUrls?.length ?? 0),
      ];
    } catch (e) {
      return [pathOf(url, PUBLIC_URL), "ERROR", errMsg(e).slice(0, 60), "", "", "", "", "", "", ""];
    }
  });

  // ---------- summary + actions ----------
  const summary = [
    `**Search impressions (28d):** ${delta(cur.impressions, prev.impressions)}`,
    `**Search clicks (28d):** ${delta(cur.clicks, prev.clicks)}`,
    `**CTR:** ${pctOf(cur.ctr)} (prev ${pctOf(prev.ctr)})`,
    `**Avg position:** ${delta(cur.position, prev.position, { digits: 1, lowerIsBetter: true })}`,
    `**Indexed:** ${indexedCount}/${inspectTargets.length} key URLs`,
    `**Unique queries:** ${curQueries.length} (prev ${prevQueries.length})`,
  ];

  if (cur.impressions < 100) {
    actions.push({
      severity: "critical",
      area: "Visibility",
      title: `Only ${cur.impressions} impressions in 28 days — the site is effectively invisible in search`,
      detail:
        "Nothing else in this report matters as much. You need indexed pages targeting phrases people actually search. Practical moves: publish topic pages for the services you want to be found for, get 2–3 real inbound links (directories, GitHub profile, client sites, local listings), and add substantial unique text (600+ words) to /ai-services and each project page.",
    });
  }
  if (nonBranded.impressions === 0 && cur.impressions > 0) {
    actions.push({
      severity: "high",
      area: "Visibility",
      title: "No non-branded impressions — you only surface for your own name",
      detail:
        "Branded search only reaches people who already know you. Target service + location phrases (e.g. \"AI automation consultant Athens GA\", \"custom internal tools developer\") in page titles, H1s, and body copy.",
    });
  }
  if (striking.length) {
    actions.push({
      severity: "medium",
      area: "Rankings",
      title: `${striking.length} quer${striking.length === 1 ? "y" : "ies"} ranking in position 4–20 — closest to page-1 clicks`,
      detail:
        "For each, tighten the target page's <title> and meta description around that exact phrase, add it as an H2, and link to that page from the homepage. See the striking-distance table.",
    });
  }
  if (zeroClick.length) {
    actions.push({
      severity: "medium",
      area: "CTR",
      title: `${zeroClick.length} quer${zeroClick.length === 1 ? "y" : "ies"} get impressions but zero clicks`,
      detail:
        "Impressions without clicks usually means the title/description doesn't match the searcher's intent. Rewrite the meta description to state the outcome the searcher wants, and put the query phrase near the front of the title.",
    });
  }

  const body = [
    `### Window: ${curStart} → ${curEnd} (vs ${prevStart} → ${prevEnd})`,
    `_GSC data lags ~2 days, so the window ends ${curEnd}._`,
    ``,
    `#### Totals, period over period`,
    table(
      ["metric", "previous 28d", "current 28d", "change"],
      [
        ["Clicks", num(prev.clicks), num(cur.clicks), delta(cur.clicks, prev.clicks)],
        ["Impressions", num(prev.impressions), num(cur.impressions), delta(cur.impressions, prev.impressions)],
        ["CTR", pctOf(prev.ctr), pctOf(cur.ctr), delta(cur.ctr * 100, prev.ctr * 100, { digits: 2, suffix: "%" })],
        [
          "Avg position",
          prev.position.toFixed(1),
          cur.position.toFixed(1),
          delta(cur.position, prev.position, { digits: 1, lowerIsBetter: true }),
        ],
        ["Unique queries", num(prevQueries.length), num(curQueries.length), delta(curQueries.length, prevQueries.length)],
        ["Pages with impressions", num(prevPages.length), num(curPages.length), delta(curPages.length, prevPages.length)],
      ],
      ["l", "r", "r", "l"]
    ),
    ``,
    `#### Daily trend (current window)`,
    "```",
    `impressions ${sparkline(dailyImpr)}  max ${Math.max(0, ...dailyImpr)}`,
    `clicks      ${sparkline(dailyClicks)}  max ${Math.max(0, ...dailyClicks)}`,
    "```",
    table(
      ["date", "clicks", "impr", "ctr", "pos"],
      dailySorted.slice(-14).map((r) => [
        r.keys?.[0] ?? "",
        num(r.clicks ?? 0),
        num(r.impressions ?? 0),
        pctOf(r.ctr ?? 0),
        (r.position ?? 0).toFixed(1),
      ]),
      ["l", "r", "r", "r", "r"]
    ),
    ``,
    `#### Monthly history (up to 16 months — the GSC retention limit)`,
    table(["month", "clicks", "impr", "ctr", "avg pos"], monthlyRows, ["l", "r", "r", "r", "r"]),
    ``,
    `#### Search type split`,
    table(
      ["search type", "clicks", "impressions"],
      [
        ["web", num(cur.clicks), num(cur.impressions)],
        ["image", num(sumRows(imageTotals).clicks), num(sumRows(imageTotals).impressions)],
        ["video", num(sumRows(videoTotals).clicks), num(sumRows(videoTotals).impressions)],
      ],
      ["l", "r", "r"]
    ),
    ``,
    `#### Branded vs non-branded queries`,
    table(
      ["bucket", "queries", "clicks", "impressions", "ctr", "avg pos"],
      [
        [
          "branded (name)",
          num(curQueries.filter((r) => BRAND_RE.test(r.keys?.[0] ?? "")).length),
          num(branded.clicks),
          num(branded.impressions),
          pctOf(branded.ctr),
          branded.position.toFixed(1),
        ],
        [
          "non-branded",
          num(curQueries.filter((r) => !BRAND_RE.test(r.keys?.[0] ?? "")).length),
          num(nonBranded.clicks),
          num(nonBranded.impressions),
          pctOf(nonBranded.ctr),
          nonBranded.position.toFixed(1),
        ],
      ],
      ["l", "r", "r", "r", "r", "r"]
    ),
    ``,
    `#### Ranking position distribution`,
    table(["position bucket", "queries", "impressions", "clicks", "ctr"], buckets, ["l", "r", "r", "r", "r"]),
    ``,
    `#### Top 50 queries (position delta vs previous period; negative = improved)`,
    table(["query", "clicks", "impr", "ctr", "pos", "Δpos"], queryRows, ["l", "r", "r", "r", "r", "r"]),
    ``,
    `_Query rows only account for ${num(queryImpressionTotal)} of ${num(cur.impressions)} impressions_ ` +
      `_(${pctOf(anonymizedShare)} are hidden — Google withholds queries searched by too few people, so query totals never match page totals on a small site.)_`,
    ``,
    `#### Striking distance — position 4–20, the cheapest wins available`,
    table(
      ["query", "clicks", "impr", "ctr", "pos"],
      striking.map((r) => [
        trunc(r.keys?.[0] ?? "", 52),
        num(r.clicks ?? 0),
        num(r.impressions ?? 0),
        pctOf(r.ctr ?? 0),
        (r.position ?? 0).toFixed(1),
      ]),
      ["l", "r", "r", "r", "r"]
    ),
    ``,
    `#### Impressions but zero clicks (≥3 impressions) — title/description problems`,
    table(
      ["query", "impr", "pos"],
      zeroClick.map((r) => [trunc(r.keys?.[0] ?? "", 52), num(r.impressions ?? 0), (r.position ?? 0).toFixed(1)]),
      ["l", "r", "r"]
    ),
    ``,
    `#### New queries this period`,
    table(
      ["query", "clicks", "impr", "pos"],
      newQueries.map((r) => [
        trunc(r.keys?.[0] ?? "", 52),
        num(r.clicks ?? 0),
        num(r.impressions ?? 0),
        (r.position ?? 0).toFixed(1),
      ]),
      ["l", "r", "r", "r"]
    ),
    ``,
    `#### Queries lost since last period`,
    table(
      ["query", "prev clicks", "prev impr", "prev pos"],
      lostQueries.map((r) => [
        trunc(r.keys?.[0] ?? "", 52),
        num(r.clicks ?? 0),
        num(r.impressions ?? 0),
        (r.position ?? 0).toFixed(1),
      ]),
      ["l", "r", "r", "r"]
    ),
    ``,
    `#### Pages (impression delta vs previous period)`,
    table(["page", "clicks", "impr", "ctr", "pos", "Δimpr"], pageRows, ["l", "r", "r", "r", "r", "r"]),
    ``,
    `#### Which query does each page rank for? (top 5 per page)`,
    table(["page", "query", "clicks", "impr", "pos"], pairRows, ["l", "l", "r", "r", "r"]),
    ``,
    `#### Search appearance (rich result types Google showed)`,
    table(
      ["appearance", "clicks", "impr", "ctr", "pos"],
      appearance.map((r) => [
        r.keys?.[0] ?? "",
        num(r.clicks ?? 0),
        num(r.impressions ?? 0),
        pctOf(r.ctr ?? 0),
        (r.position ?? 0).toFixed(1),
      ]),
      ["l", "r", "r", "r", "r"]
    ),
    ``,
    `#### Countries`,
    table(
      ["country", "clicks", "impr", "ctr", "pos"],
      countries.map((r) => [
        r.keys?.[0] ?? "",
        num(r.clicks ?? 0),
        num(r.impressions ?? 0),
        pctOf(r.ctr ?? 0),
        (r.position ?? 0).toFixed(1),
      ]),
      ["l", "r", "r", "r", "r"]
    ),
    ``,
    `#### Devices`,
    table(
      ["device", "clicks", "impr", "ctr", "pos"],
      devices.map((r) => [
        r.keys?.[0] ?? "",
        num(r.clicks ?? 0),
        num(r.impressions ?? 0),
        pctOf(r.ctr ?? 0),
        (r.position ?? 0).toFixed(1),
      ]),
      ["l", "r", "r", "r", "r"]
    ),
    ``,
    `#### Submitted sitemaps`,
    table(
      ["path", "submitted", "downloaded", "urls", "warnings", "errors", "pending"],
      sitemapRows,
      ["l", "l", "l", "r", "r", "r", "l"]
    ),
    ``,
    `#### Index status per URL (live URL Inspection API)`,
    table(
      ["page", "verdict", "coverage", "last crawl", "robots", "fetch", "canonical", "mobile", "rich results", "ref urls"],
      inspectRows,
      ["l", "l", "l", "l", "l", "l", "l", "l", "l", "r"]
    ),
    errors.length ? `\n_GSC query errors:_\n${bullet(errors)}` : "",
  ].join("\n");

  return {
    heading: "Google Search Console",
    body,
    summary,
    actions,
    snapshot: {
      clicks: cur.clicks,
      impressions: cur.impressions,
      ctr: cur.ctr,
      position: cur.position,
      uniqueQueries: curQueries.length,
      pagesWithImpressions: curPages.length,
      indexedKeyUrls: indexedCount,
      keyUrlsChecked: inspectTargets.length,
      nonBrandedImpressions: nonBranded.impressions,
    },
  };
}
