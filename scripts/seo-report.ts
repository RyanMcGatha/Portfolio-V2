/**
 * SEO + analytics aggregator. Pulls real-world data from:
 *   - Google Search Console  (queries, pages, index status, sitemaps, trends)
 *   - Google Analytics 4     (traffic, landing pages, channels, engagement)
 *   - PageSpeed Insights     (Lighthouse per page × device, failing audits)
 *   - Chrome UX Report       (real-user Core Web Vitals, URL + origin level)
 *   - The live site itself    (on-page crawl: meta, headings, links, schema)
 *
 * Run: npm run seo:report
 *   --full        print the entire report to the terminal (default prints the summary)
 *   --fast        only audit / and /ai-services in PageSpeed (much quicker)
 *   --no-psi      skip PageSpeed entirely (it's the slow part)
 *   --no-crawl    skip the on-page crawl
 *
 * Auth: prefers OAuth (.oauth-token.json from `npm run auth`) and falls back
 * to a service account at GOOGLE_APPLICATION_CREDENTIALS.
 */

import { existsSync, mkdirSync, writeFileSync, readdirSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { loadDotEnv } from "./lib/util";

loadDotEnv(resolve(process.cwd(), ".env.local"));

import { resolveAuth } from "./lib/auth";
import { gscSection } from "./lib/gsc";
import { ga4Section } from "./lib/ga4";
import { psiSection } from "./lib/psi";
import { crawlSection } from "./lib/crawl";
import { fetchSitemap, technicalChecks, PUBLIC_URL, IS_LOCAL_TARGET } from "./lib/site";
import {
  SEVERITY_ICON,
  SEVERITY_ORDER,
  bullet,
  delta,
  table,
  type Action,
  type SectionResult,
} from "./lib/fmt";
import { errMsg } from "./lib/util";

const argv = process.argv.slice(2);
const OPT = {
  full: argv.includes("--full"),
  fast: argv.includes("--fast"),
  noPsi: argv.includes("--no-psi"),
  noCrawl: argv.includes("--no-crawl"),
};

const SITE_URL = process.env.GSC_SITE_URL;
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const PSI_API_KEY = process.env.PSI_API_KEY;

const auth = resolveAuth();

const reportDir = resolve(process.cwd(), ".reports");
const snapshotDir = join(reportDir, "snapshots");
for (const dir of [reportDir, snapshotDir]) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

const today = new Date().toISOString().slice(0, 10);
const log = (msg: string) => console.log(msg);

/** Keys lifted out of the snapshots for the run-over-run trend table. */
const TREND_KEYS: { path: string; label: string; digits?: number; lowerIsBetter?: boolean }[] = [
  { path: "gsc.impressions", label: "GSC impressions (28d)" },
  { path: "gsc.clicks", label: "GSC clicks (28d)" },
  { path: "gsc.position", label: "GSC avg position", digits: 1, lowerIsBetter: true },
  { path: "gsc.uniqueQueries", label: "GSC unique queries" },
  { path: "gsc.nonBrandedImpressions", label: "GSC non-branded impressions" },
  { path: "gsc.indexedKeyUrls", label: "Indexed key URLs" },
  { path: "ga4.users", label: "GA4 users (28d)" },
  { path: "ga4.sessions", label: "GA4 sessions (28d)" },
  { path: "ga4.organicSessions", label: "GA4 organic sessions" },
  { path: "ga4.keyEvents", label: "GA4 key events" },
  { path: "crawl.avgWordCount", label: "Avg words per page" },
  { path: "crawl.thinPages", label: "Thin pages (<300 words)", lowerIsBetter: true },
  { path: "crawl.missingAlt", label: "Images missing alt", lowerIsBetter: true },
  { path: "crawl.missingDims", label: "Images missing dimensions", lowerIsBetter: true },
  { path: "crawl.orphanPages", label: "Orphan pages", lowerIsBetter: true },
  { path: "crawl.brokenUrls", label: "Broken URLs", lowerIsBetter: true },
  { path: "crawl.pagesWithoutStructuredData", label: "Pages without schema", lowerIsBetter: true },
];

function dig(obj: unknown, path: string): number | null {
  let cur: unknown = obj;
  for (const part of path.split(".")) {
    if (!cur || typeof cur !== "object") return null;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === "number" ? cur : null;
}

function loadPreviousSnapshot(): { date: string; data: unknown } | null {
  const files = readdirSync(snapshotDir)
    .filter((f) => f.startsWith("snapshot-") && f.endsWith(".json") && f !== `snapshot-${today}.json`)
    .sort();
  const last = files.pop();
  if (!last) return null;
  try {
    return {
      date: last.replace("snapshot-", "").replace(".json", ""),
      data: JSON.parse(readFileSync(join(snapshotDir, last), "utf8")),
    };
  } catch {
    return null;
  }
}

const GLOSSARY = `
## How to read this report

**Search Console vs Analytics.** GSC measures what happens *in Google's results*
(impressions, clicks, position). GA4 measures what happens *on the site* after the
click. They will never match exactly: different windows, different attribution,
and GA4 misses visitors who block analytics.

**Why query totals don't equal page totals.** GSC hides queries that too few
people searched, for privacy. On a low-traffic site most impressions come from
these hidden queries, so the query table always sums to less than the page table.

**Impressions** = your page appeared in results someone loaded. **Position** is
impression-weighted average rank; 1–10 is page one. Positions above ~20 get
effectively zero clicks, so ranking movement there matters more than CTR.

**Striking distance** = queries at position 4–20. These are the cheapest wins:
Google already considers you relevant, so tighter titles, an H2 matching the
phrase, and an internal link can move them onto page one.

**Engagement rate** (GA4) = share of sessions lasting 10s+, hitting 2+ pages, or
firing a key event. Bounce rate is its inverse. Under 40% engagement usually
means the top of the page isn't answering "what is this and is it for me?".

**Core Web Vitals thresholds.** LCP ≤ 2.5s (how fast the main content paints),
CLS ≤ 0.10 (how much the layout jumps), INP ≤ 200ms (input responsiveness; TBT
is the lab proxy). These are real ranking inputs, and they're judged on *field*
data from Chrome users — not the lab scores in this report.

**Lab vs field.** Lighthouse simulates a throttled device from a Google datacenter,
so it's a consistent regression check, not truth. CrUX is real Chrome users at the
75th percentile; it needs meaningful traffic before it reports anything.

**Audit weight** (PageSpeed section) tells you how much a failing audit drags its
category score. A weight-0 failure costs nothing — fix the heavy ones first.

**Word count** is a proxy, not a target. The reason thin pages lose isn't length,
it's that there's nothing on them for Google to match a query against.

**Orphan pages** get no internal links. Google discovers and weights pages largely
through links; a sitemap entry alone is a weak hint.
`.trim();

async function main() {
  const started = Date.now();
  console.log(`\nSEO report — ${PUBLIC_URL}`);
  console.log(`Auth mode: ${auth.kind}`);
  console.log(`GSC site:  ${SITE_URL ?? "(skipped — set GSC_SITE_URL)"}`);
  console.log(`GA4 prop:  ${GA4_PROPERTY_ID ?? "(skipped — set GA4_PROPERTY_ID)"}`);
  console.log(`PSI key:   ${PSI_API_KEY ? "set" : "(skipped — set PSI_API_KEY)"}`);
  console.log(
    `Options:   ${
      [OPT.full && "--full", OPT.fast && "--fast", OPT.noPsi && "--no-psi", OPT.noCrawl && "--no-crawl"]
        .filter(Boolean)
        .join(" ") || "(none)"
    }\n`
  );

  log("Fetching sitemap…");
  const sitemap = await fetchSitemap();
  log(
    `  ${sitemap.entries.length} URLs from ${sitemap.source}${sitemap.error ? ` (${sitemap.error})` : ""}\n`
  );

  const psiTargets = OPT.fast
    ? [`${PUBLIC_URL}`, `${PUBLIC_URL}/ai-services`]
    : sitemap.entries.map((e) => e.url);

  const errors: string[] = [];
  const sections: SectionResult[] = [];
  const snapshot: Record<string, unknown> = { date: today };

  const tasks: Promise<void>[] = [];

  if (SITE_URL) {
    tasks.push(
      gscSection(
        auth,
        SITE_URL,
        // GSC can only inspect the real property, never a localhost build.
        sitemap.entries.map((e) =>
          IS_LOCAL_TARGET ? e.url.replace(/^https?:\/\/[^/]+/, "https://ryanm.info") : e.url
        )
      )
        .then((s) => {
          sections.push(s);
          snapshot.gsc = s.snapshot;
        })
        .catch((e) => {
          errors.push(`Search Console: ${errMsg(e)}`);
        })
    );
  }

  if (GA4_PROPERTY_ID) {
    tasks.push(
      ga4Section(auth, GA4_PROPERTY_ID)
        .then((s) => {
          sections.push(s);
          snapshot.ga4 = s.snapshot;
        })
        .catch((e) => {
          errors.push(`GA4: ${errMsg(e)}`);
        })
    );
  }

  if (!OPT.noCrawl) {
    tasks.push(
      crawlSection(sitemap.entries, log)
        .then((s) => {
          sections.push(s);
          snapshot.crawl = s.snapshot;
        })
        .catch((e) => {
          errors.push(`Crawl: ${errMsg(e)}`);
        })
    );
  }

  if (PSI_API_KEY && !OPT.noPsi) {
    tasks.push(
      psiSection(PSI_API_KEY, psiTargets, log)
        .then((s) => {
          sections.push(s);
          snapshot.psi = s.snapshot;
        })
        .catch((e) => {
          errors.push(`PageSpeed: ${errMsg(e)}`);
        })
    );
  }

  const checks = await technicalChecks();
  await Promise.all(tasks);

  // Keep a stable section order regardless of which promise settled first.
  const order = [
    "Google Search Console",
    "Google Analytics 4",
    "On-page crawl (live HTML)",
    "PageSpeed Insights + Core Web Vitals",
  ];
  sections.sort((a, b) => order.indexOf(a.heading) - order.indexOf(b.heading));

  for (const c of checks) {
    if (c.ok === false) {
      errors.push(`Technical check failed — ${c.name}: ${c.detail}`);
    }
  }

  const actions: Action[] = sections
    .flatMap((s) => s.actions)
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

  const prev = loadPreviousSnapshot();
  const trendRows = prev
    ? TREND_KEYS.map((k) => {
        const cur = dig(snapshot, k.path);
        const old = dig(prev.data, k.path);
        if (cur === null && old === null) return null;
        return [
          k.label,
          old === null ? "–" : old.toFixed(k.digits ?? 0),
          cur === null ? "–" : cur.toFixed(k.digits ?? 0),
          delta(cur, old, { digits: k.digits ?? 0, lowerIsBetter: k.lowerIsBetter }),
        ];
      }).filter((r): r is string[] => r !== null)
    : [];

  const actionPlan = actions.length
    ? actions
        .map(
          (a, i) =>
            `${i + 1}. ${SEVERITY_ICON[a.severity]} **[${a.severity.toUpperCase()} · ${a.area}]** ${a.title}\n` +
            `    ${a.detail.replace(/\n/g, "\n    ")}`
        )
        .join("\n\n")
    : "_No issues detected._";

  const severityCounts = (["critical", "high", "medium", "low"] as const).map(
    (s) => `${SEVERITY_ICON[s]} ${actions.filter((a) => a.severity === s).length} ${s}`
  );

  const report = [
    `# SEO + analytics report — ryanm.info`,
    ``,
    `- **Generated:** ${new Date().toISOString()}`,
    `- **Auth:** ${auth.kind}`,
    `- **URLs analyzed:** ${sitemap.entries.length} (from ${sitemap.source})`,
    `- **Sections:** ${sections.map((s) => s.heading).join(" · ") || "none"}`,
    `- **Issues found:** ${severityCounts.join(" · ")}`,
    ``,
    `## Executive summary`,
    sections
      .map((s) => `**${s.heading}**\n${bullet(s.summary)}`)
      .join("\n\n") || "_No data collected._",
    ``,
    `## Prioritized action plan`,
    ``,
    actionPlan,
    ``,
    `## Trend vs previous run`,
    prev
      ? table(["metric", prev.date, today, "change"], trendRows, ["l", "r", "r", "l"])
      : `_No previous snapshot to compare against. This run wrote \`.reports/snapshots/snapshot-${today}.json\`; the next run will show deltas._`,
    ``,
    `## Technical checks`,
    table(
      ["check", "result", "detail"],
      checks.map((c) => [c.name, c.ok === null ? "?" : c.ok ? "✅" : "❌", c.detail])
    ),
    ``,
    ...sections.flatMap((s) => [`# ${s.heading}`, ``, s.body, ``]),
    GLOSSARY,
    ``,
    errors.length ? `## Errors\n${bullet(errors)}` : "",
  ].join("\n");

  const reportPath = join(reportDir, `report-${today}.md`);
  writeFileSync(reportPath, report);
  writeFileSync(join(reportDir, "latest.md"), report);
  writeFileSync(join(snapshotDir, `snapshot-${today}.json`), JSON.stringify(snapshot, null, 2));

  const elapsed = ((Date.now() - started) / 1000).toFixed(0);

  if (OPT.full) {
    console.log("\n" + report);
  } else {
    // Terminal gets the decision-making part; the file has everything.
    console.log(
      "\n" +
        [
          `## Executive summary`,
          sections.map((s) => `**${s.heading}**\n${bullet(s.summary)}`).join("\n\n"),
          ``,
          `## Prioritized action plan (${severityCounts.join(" · ")})`,
          ``,
          actionPlan,
          ``,
          prev ? `## Trend vs ${prev.date}\n${table(["metric", prev.date, today, "change"], trendRows, ["l", "r", "r", "l"])}` : "",
          errors.length ? `## Errors\n${bullet(errors)}` : "",
        ]
          .filter(Boolean)
          .join("\n")
    );
  }

  console.log(
    `\nFull report (${(report.length / 1024).toFixed(0)} KB): ${reportPath}` +
      `\nAlso at:                 ${join(reportDir, "latest.md")}` +
      `\nSnapshot:                ${join(snapshotDir, `snapshot-${today}.json`)}` +
      `\nFinished in ${elapsed}s.` +
      (OPT.full ? "" : `\nRe-run with --full to print everything to the terminal.\n`)
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
