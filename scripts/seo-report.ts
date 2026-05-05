/**
 * SEO + analytics aggregator. Pulls real-world data from:
 *   - Google Search Console (queries, pages, indexing)
 *   - Google Analytics 4 (traffic, sources, devices, engagement)
 *   - PageSpeed Insights / CrUX (Core Web Vitals from real users)
 *
 * Run: npm run seo:report
 *
 * Auth: prefers OAuth (.oauth-token.json from `npm run auth`) and falls back
 * to a service account at GOOGLE_APPLICATION_CREDENTIALS.
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

function loadDotEnv(path: string) {
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadDotEnv(resolve(process.cwd(), ".env.local"));

import { google } from "googleapis";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { resolveAuth } from "./lib/auth";

const SITE_URL = process.env.GSC_SITE_URL;
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const PSI_API_KEY = process.env.PSI_API_KEY;
const PUBLIC_URL = "https://ryanm.info";

const auth = resolveAuth();

const reportDir = resolve(process.cwd(), ".reports");
if (!existsSync(reportDir)) mkdirSync(reportDir, { recursive: true });

const today = new Date().toISOString().slice(0, 10);
const ago = (days: number) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
};

interface ReportSection {
  heading: string;
  body: string;
}

const sections: ReportSection[] = [];

async function gscReport() {
  if (!SITE_URL) {
    sections.push({
      heading: "Google Search Console",
      body: "Skipped — set GSC_SITE_URL in .env.local.",
    });
    return;
  }

  const webmastersAuth =
    auth.kind === "oauth"
      ? auth.authClient!
      : new google.auth.GoogleAuth({
          scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
        });

  const webmasters = google.webmasters({ version: "v3", auth: webmastersAuth });
  const startDate = ago(28);
  const endDate = ago(2);

  const queries = await webmasters.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 50,
    },
  });

  const pages = await webmasters.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["page"],
      rowLimit: 50,
    },
  });

  const countries = await webmasters.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["country"],
      rowLimit: 10,
    },
  });

  const devices = await webmasters.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["device"],
      rowLimit: 5,
    },
  });

  const formatRow = (r: {
    keys?: string[] | null;
    clicks?: number | null;
    impressions?: number | null;
    ctr?: number | null;
    position?: number | null;
  }) => {
    const key = r.keys?.[0] ?? "(none)";
    return `${(r.clicks ?? 0).toString().padStart(5)} clk | ${(r.impressions ?? 0)
      .toString()
      .padStart(6)} imp | ${((r.ctr ?? 0) * 100)
      .toFixed(1)
      .padStart(4)}% ctr | pos ${(r.position ?? 0).toFixed(1).padStart(5)}  ${key}`;
  };

  const rows = queries.data.rows ?? [];
  const body = [
    `### Window: ${startDate} → ${endDate}`,
    ``,
    `#### Top 25 search queries`,
    `clicks | impressions | ctr | avg position | query`,
    ...rows.slice(0, 25).map(formatRow),
    ``,
    `#### Almost-ranking queries (impressions > 10, position 5–20) — easiest CTR wins`,
    ...rows
      .filter(
        (r) =>
          (r.impressions ?? 0) > 10 &&
          (r.position ?? 99) >= 5 &&
          (r.position ?? 99) <= 20
      )
      .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
      .slice(0, 20)
      .map(formatRow),
    ``,
    `#### Top 20 pages`,
    `clicks | impressions | ctr | avg position | page`,
    ...(pages.data.rows ?? []).slice(0, 20).map(formatRow),
    ``,
    `#### Country breakdown`,
    ...(countries.data.rows ?? []).map(formatRow),
    ``,
    `#### Device breakdown`,
    ...(devices.data.rows ?? []).map(formatRow),
  ].join("\n");

  sections.push({ heading: "Google Search Console", body });
}

async function ga4Report() {
  if (!GA4_PROPERTY_ID) {
    sections.push({
      heading: "Google Analytics 4",
      body: "Skipped — set GA4_PROPERTY_ID in .env.local.",
    });
    return;
  }

  const client =
    auth.kind === "oauth"
      ? new BetaAnalyticsDataClient({ authClient: auth.authClient! })
      : new BetaAnalyticsDataClient();

  const startDate = ago(28);
  const endDate = "today";
  const property = `properties/${GA4_PROPERTY_ID}`;

  const [overview] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: "totalUsers" },
      { name: "newUsers" },
      { name: "sessions" },
      { name: "engagedSessions" },
      { name: "averageSessionDuration" },
      { name: "screenPageViews" },
      { name: "bounceRate" },
    ],
  });

  const [topPages] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "pagePath" }],
    metrics: [
      { name: "screenPageViews" },
      { name: "totalUsers" },
      { name: "averageSessionDuration" },
      { name: "bounceRate" },
    ],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 20,
  });

  const [sources] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: "sessionDefaultChannelGroup" },
      { name: "sessionSource" },
    ],
    metrics: [{ name: "sessions" }, { name: "engagedSessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 15,
  });

  const [devices] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "deviceCategory" }],
    metrics: [
      { name: "totalUsers" },
      { name: "engagementRate" },
      { name: "averageSessionDuration" },
    ],
  });

  const [events] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }],
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 15,
  });

  const ov = overview.rows?.[0]?.metricValues ?? [];
  const get = (i: number) => ov[i]?.value ?? "0";
  const overviewBody = [
    `Users (28d):              ${get(0)}`,
    `New users:                ${get(1)}`,
    `Sessions:                 ${get(2)}`,
    `Engaged sessions:         ${get(3)}`,
    `Avg session duration (s): ${parseFloat(get(4)).toFixed(1)}`,
    `Page views:               ${get(5)}`,
    `Bounce rate:              ${(parseFloat(get(6)) * 100).toFixed(1)}%`,
  ].join("\n");

  const fmtRow = (
    dims: string[],
    metrics: { value?: string | null }[]
  ) =>
    `${dims.join(" | ").padEnd(45)} ${metrics
      .map((m) => m.value ?? "")
      .join(" | ")}`;

  const body = [
    `### Window: last 28 days`,
    ``,
    `#### Overview`,
    overviewBody,
    ``,
    `#### Top 20 pages by views`,
    `path | views | users | avg duration (s) | bounce rate`,
    ...(topPages.rows ?? []).map((r) =>
      fmtRow(
        r.dimensionValues?.map((d) => d.value ?? "") ?? [],
        r.metricValues ?? []
      )
    ),
    ``,
    `#### Sources`,
    `channel | source | sessions | engaged sessions`,
    ...(sources.rows ?? []).map((r) =>
      fmtRow(
        r.dimensionValues?.map((d) => d.value ?? "") ?? [],
        r.metricValues ?? []
      )
    ),
    ``,
    `#### Devices`,
    `device | users | engagement rate | avg duration`,
    ...(devices.rows ?? []).map((r) =>
      fmtRow(
        r.dimensionValues?.map((d) => d.value ?? "") ?? [],
        r.metricValues ?? []
      )
    ),
    ``,
    `#### Top events`,
    `event | count`,
    ...(events.rows ?? []).map((r) =>
      fmtRow(
        r.dimensionValues?.map((d) => d.value ?? "") ?? [],
        r.metricValues ?? []
      )
    ),
  ].join("\n");

  sections.push({ heading: "Google Analytics 4", body });
}

async function psiReport() {
  if (!PSI_API_KEY) {
    sections.push({
      heading: "PageSpeed Insights / CrUX",
      body: "Skipped — set PSI_API_KEY in .env.local to enable.",
    });
    return;
  }

  const targets = [PUBLIC_URL, `${PUBLIC_URL}/ai-services`];
  const results: string[] = [];

  for (const target of targets) {
    for (const strategy of ["mobile", "desktop"] as const) {
      const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
        target
      )}&strategy=${strategy}&category=performance&category=accessibility&category=seo&category=best-practices&key=${PSI_API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) {
        results.push(
          `### ${strategy} | ${target}\nERROR ${res.status}: ${await res.text()}`
        );
        continue;
      }
      const data = (await res.json()) as {
        lighthouseResult?: {
          categories?: Record<string, { score?: number | null }>;
          audits?: Record<
            string,
            {
              displayValue?: string;
              numericValue?: number;
              title?: string;
              score?: number | null;
            }
          >;
        };
        loadingExperience?: {
          metrics?: Record<
            string,
            {
              percentile?: number;
              category?: string;
              distributions?: { proportion: number }[];
            }
          >;
          overall_category?: string;
        };
      };

      const lh = data.lighthouseResult;
      const cats = lh?.categories ?? {};
      const audits = lh?.audits ?? {};

      const lines = [
        `### ${strategy.toUpperCase()} | ${target}`,
        `Lighthouse: perf ${pct(cats.performance?.score)}  a11y ${pct(
          cats.accessibility?.score
        )}  best-practices ${pct(
          cats["best-practices"]?.score
        )}  seo ${pct(cats.seo?.score)}`,
        `LCP:         ${audits["largest-contentful-paint"]?.displayValue ?? "?"}`,
        `FCP:         ${audits["first-contentful-paint"]?.displayValue ?? "?"}`,
        `TBT:         ${audits["total-blocking-time"]?.displayValue ?? "?"}`,
        `CLS:         ${audits["cumulative-layout-shift"]?.displayValue ?? "?"}`,
        `Speed Index: ${audits["speed-index"]?.displayValue ?? "?"}`,
        `TTI:         ${audits["interactive"]?.displayValue ?? "?"}`,
      ];

      const cwv = data.loadingExperience?.metrics;
      if (cwv) {
        lines.push(
          ``,
          `Real-user CrUX (last 28 days): ${data.loadingExperience?.overall_category ?? "?"}`
        );
        for (const [k, v] of Object.entries(cwv)) {
          lines.push(
            `  ${k.padEnd(38)} p75=${v.percentile ?? "?"}  bucket=${v.category ?? "?"}`
          );
        }
      } else {
        lines.push(``, `Real-user CrUX: not enough field data yet.`);
      }

      const opportunities = Object.entries(audits)
        .filter(
          ([, a]) =>
            a.score !== null &&
            (a.score ?? 1) < 0.9 &&
            a.numericValue &&
            a.numericValue > 100
        )
        .sort((a, b) => (b[1].numericValue ?? 0) - (a[1].numericValue ?? 0))
        .slice(0, 10);

      if (opportunities.length) {
        lines.push(``, `Top opportunities (lower score = bigger win):`);
        for (const [id, a] of opportunities) {
          lines.push(`  [${pct(a.score)}] ${a.title ?? id}  ${a.displayValue ?? ""}`);
        }
      }

      results.push(lines.join("\n"));
    }
  }

  sections.push({ heading: "PageSpeed Insights + CrUX", body: results.join("\n\n") });
}

function pct(n: number | null | undefined) {
  if (n == null) return "?";
  return `${Math.round(n * 100)}`;
}

async function main() {
  console.log(`\nAuth mode: ${auth.kind}`);
  console.log(`GSC site:  ${SITE_URL ?? "(skipped)"}`);
  console.log(`GA4 prop:  ${GA4_PROPERTY_ID ?? "(skipped)"}`);
  console.log(`PSI key:   ${PSI_API_KEY ? "set" : "(skipped)"}\n`);

  const errors: string[] = [];
  await Promise.allSettled([
    gscReport().catch((e) => {
      errors.push(`GSC error: ${e.message}`);
    }),
    ga4Report().catch((e) => {
      errors.push(`GA4 error: ${e.message}`);
    }),
    psiReport().catch((e) => {
      errors.push(`PSI error: ${e.message}`);
    }),
  ]);

  const out = [
    `# SEO + analytics report — ryanm.info`,
    `Generated: ${new Date().toISOString()}`,
    `Auth: ${auth.kind}`,
    ``,
    ...sections.flatMap((s) => [`## ${s.heading}`, s.body, ``]),
    errors.length ? `## Errors\n${errors.join("\n")}` : "",
  ].join("\n");

  const path = join(reportDir, `report-${today}.md`);
  writeFileSync(path, out);
  console.log(`\nWrote ${path}\n`);
  console.log(out);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
