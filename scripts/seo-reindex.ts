/**
 * Submits/resubmits your sitemap to Google Search Console and inspects the
 * indexing status of key URLs. Run after deploying SEO changes:
 *
 *   npm run seo:reindex
 *
 * Note: there's no public "request indexing" API for a portfolio site
 * (the Indexing API only works for JobPosting / BroadcastEvent schemas).
 * The reliable signals to Google are:
 *   1. A clean, fresh sitemap (this script submits/refreshes it)
 *   2. URL Inspection (this script reports current status per URL)
 *   3. Manual "Request Indexing" in the GSC web UI for individual URLs
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

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
import { resolveAuth } from "./lib/auth";

const SITE_URL = process.env.GSC_SITE_URL;
if (!SITE_URL) {
  console.error("GSC_SITE_URL is not set in .env.local");
  process.exit(1);
}

const PUBLIC_URL = "https://ryanm.info";
const SITEMAP_URL = `${PUBLIC_URL}/sitemap.xml`;
const URLS_TO_INSPECT = [
  PUBLIC_URL,
  `${PUBLIC_URL}/`,
  `${PUBLIC_URL}/ai-services`,
];

const auth = resolveAuth();

async function submitSitemap() {
  const webmastersAuth =
    auth.kind === "oauth"
      ? auth.authClient!
      : new google.auth.GoogleAuth({
          scopes: ["https://www.googleapis.com/auth/webmasters"],
        });

  const webmasters = google.webmasters({ version: "v3", auth: webmastersAuth });

  console.log(`\nSubmitting sitemap: ${SITEMAP_URL}\n  for site: ${SITE_URL}\n`);

  await webmasters.sitemaps.submit({
    siteUrl: SITE_URL!,
    feedpath: SITEMAP_URL,
  });

  const list = await webmasters.sitemaps.list({ siteUrl: SITE_URL! });
  console.log(`Sitemaps registered for ${SITE_URL}:`);
  for (const s of list.data.sitemap ?? []) {
    console.log(
      `  ${s.path} | submitted=${s.lastSubmitted ?? "?"} | downloaded=${
        s.lastDownloaded ?? "?"
      } | warnings=${s.warnings ?? 0} | errors=${s.errors ?? 0} | isPending=${
        s.isPending ?? "?"
      }`
    );
  }
}

async function inspectUrls() {
  const auth2 =
    auth.kind === "oauth"
      ? auth.authClient!
      : new google.auth.GoogleAuth({
          scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
        });

  const sc = google.searchconsole({ version: "v1", auth: auth2 });
  console.log(`\nInspecting key URLs:\n`);

  for (const u of URLS_TO_INSPECT) {
    try {
      const res = await sc.urlInspection.index.inspect({
        requestBody: { inspectionUrl: u, siteUrl: SITE_URL! },
      });

      const r = res.data.inspectionResult;
      const idx = r?.indexStatusResult;
      const cov = idx?.coverageState ?? "?";
      const verdict = idx?.verdict ?? "?";
      const lastCrawl = idx?.lastCrawlTime ?? "never";
      const userCanonical = idx?.userCanonical ?? "?";
      const googleCanonical = idx?.googleCanonical ?? "?";
      const robotsTxt = idx?.robotsTxtState ?? "?";
      const indexing = idx?.indexingState ?? "?";

      console.log(`URL: ${u}`);
      console.log(`  verdict:           ${verdict}`);
      console.log(`  coverage:          ${cov}`);
      console.log(`  indexing state:    ${indexing}`);
      console.log(`  robots.txt state:  ${robotsTxt}`);
      console.log(`  last crawl:        ${lastCrawl}`);
      console.log(`  declared canon:    ${userCanonical}`);
      console.log(`  google's canon:    ${googleCanonical}`);
      if (userCanonical !== "?" && googleCanonical !== "?" && userCanonical !== googleCanonical) {
        console.log(
          `  ⚠ canonical mismatch — Google is using a different canonical than you declared.`
        );
      }
      console.log("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`URL: ${u}\n  ERROR: ${msg}\n`);
    }
  }
}

async function main() {
  console.log(`Auth mode: ${auth.kind}`);

  await submitSitemap();
  await inspectUrls();

  console.log(
    `\nDone.\n\n` +
      `Tips:\n` +
      `  • If verdict says "URL is unknown to Google", open GSC's URL Inspection\n` +
      `    tool in the browser and click "Request Indexing" for each page.\n` +
      `    https://search.google.com/search-console\n` +
      `  • Re-run this script weekly until coverage is "Submitted and indexed".\n`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
