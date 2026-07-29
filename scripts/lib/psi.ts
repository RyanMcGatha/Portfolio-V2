/**
 * PageSpeed Insights (lab) + Chrome UX Report (field) section.
 *
 * Runs every sitemap URL on mobile *and* desktop, then reports not just the
 * scores but the specific audits that failed — including which DOM elements
 * shift (CLS) and which element is the LCP — because "perf 82" isn't actionable
 * on its own.
 */

import {
  bullet,
  flag,
  num,
  pathOf,
  score100,
  table,
  trunc,
  type Action,
  type SectionResult,
} from "./fmt";
import { errMsg, fetchWithTimeout, mapLimit, withRetry } from "./util";
import { PUBLIC_URL } from "./site";

interface ChecklistEntry {
  value?: boolean;
  label?: string;
}

interface AuditDetailItem {
  type?: string;
  url?: string;
  label?: string;
  subpart?: string;
  duration?: number;
  wastedBytes?: number;
  wastedMs?: number;
  totalBytes?: number;
  transferSize?: number;
  blockingTime?: number;
  mainThreadTime?: number;
  entity?: string | { text?: string };
  node?: { snippet?: string; selector?: string; nodeLabel?: string; type?: string; value?: string };
  score?: number;
  /** Arrays are nested tables; an object is a checklist (lcp-discovery-insight). */
  items?: AuditDetailItem[] | Record<string, ChecklistEntry>;
  subItems?: { items?: AuditDetailItem[] };
}

interface Audit {
  id?: string;
  title?: string;
  description?: string;
  score?: number | null;
  scoreDisplayMode?: string;
  displayValue?: string;
  numericValue?: number;
  /** Lighthouse 13 replaced the old "opportunity" model with per-metric savings. */
  metricSavings?: Record<string, number>;
  details?: {
    type?: string;
    items?: AuditDetailItem[];
    overallSavingsMs?: number;
    overallSavingsBytes?: number;
  };
}

/**
 * Lighthouse 13 wraps most tables in a `list`, so leaf rows can be one or two
 * levels down. Flatten to the rows that actually carry data.
 */
function tableRows(audit?: Audit): AuditDetailItem[] {
  const out: AuditDetailItem[] = [];
  const walk = (items?: AuditDetailItem[]) => {
    for (const item of items ?? []) {
      if (Array.isArray(item.items)) walk(item.items);
      else out.push(item);
    }
  };
  walk(audit?.details?.items);
  return out;
}

/** First audit present from a list of ids — lets us support LH13 + legacy names. */
function pick(audits: Record<string, Audit>, ids: string[]): Audit | undefined {
  for (const id of ids) if (audits[id]) return audits[id];
  return undefined;
}

interface PsiResponse {
  lighthouseResult?: {
    categories?: Record<string, { score?: number | null; auditRefs?: { id: string; weight: number; group?: string }[] }>;
    audits?: Record<string, Audit>;
    configSettings?: { formFactor?: string };
  };
  loadingExperience?: {
    metrics?: Record<string, { percentile?: number; category?: string }>;
    overall_category?: string;
  };
  originLoadingExperience?: {
    metrics?: Record<string, { percentile?: number; category?: string }>;
    overall_category?: string;
  };
}

export interface PsiRun {
  url: string;
  strategy: "mobile" | "desktop";
  error?: string;
  scores: { performance?: number | null; accessibility?: number | null; bestPractices?: number | null; seo?: number | null };
  metrics: { lcp?: number; fcp?: number; tbt?: number; cls?: number; si?: number; tti?: number; ttfb?: number };
  display: Record<string, string>;
  failing: { category: string; id: string; title: string; score: number; weight: number; displayValue?: string; description?: string }[];
  opportunities: {
    id: string;
    title: string;
    savingsMs?: number;
    savingsBytes?: number;
    /** Which Core Web Vital this would improve, per Lighthouse's own estimate. */
    metric?: string;
    displayValue?: string;
  }[];
  lcpElement?: string;
  /** lcp-discovery-insight checklist: discoverable / not lazy / fetchpriority. */
  lcpChecklist: { label: string; ok: boolean }[];
  /** Which phase of LCP is slow: TTFB, load delay, load duration, render delay. */
  lcpBreakdown: { label: string; ms: number }[];
  clsElements: { snippet: string; selector: string; score: number; shifts: number }[];
  unusedJs: { url: string; wastedBytes: number; totalBytes: number }[];
  renderBlocking: { url: string; wastedMs: number }[];
  thirdParty: { entity: string; blockingTime: number; transferSize: number }[];
  diagnostics: { id: string; title: string; displayValue: string }[];
  field?: { overall?: string; metrics: { name: string; p75?: number; bucket?: string }[] };
}

const CATEGORY_LABELS: Record<string, string> = {
  performance: "Performance",
  accessibility: "Accessibility",
  "best-practices": "Best practices",
  seo: "SEO",
};

/** Union of Lighthouse 13 `*-insight` ids and their pre-13 equivalents. */
const DIAGNOSTIC_IDS = [
  "server-response-time",
  "document-latency-insight",
  "total-byte-weight",
  "dom-size-insight",
  "dom-size",
  "mainthread-work-breakdown",
  "bootup-time",
  "long-tasks",
  "network-requests",
  "network-dependency-tree-insight",
  "cache-insight",
  "uses-long-cache-ttl",
  "font-display-insight",
  "font-display",
  "legacy-javascript-insight",
  "legacy-javascript",
  "duplicated-javascript-insight",
  "duplicated-javascript",
  "image-delivery-insight",
  "modern-image-formats",
  "uses-responsive-images",
  "unsized-images",
  "non-composited-animations",
  "viewport-insight",
  "redirects",
  "unused-css-rules",
];

function firstSentence(s?: string): string {
  if (!s) return "";
  const clean = s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s+/g, " ").trim();
  const cut = clean.match(/^(.*?[.!?])(\s|$)/);
  return trunc(cut ? cut[1] : clean, 160);
}

/** First element snippet anywhere in a details tree. */
function findSnippet(items?: AuditDetailItem[]): string | undefined {
  for (const item of items ?? []) {
    if (item.node?.snippet) return item.node.snippet;
    const nested = findSnippet(
      (Array.isArray(item.items) ? item.items : undefined) ?? item.subItems?.items
    );
    if (nested) return nested;
  }
  return undefined;
}

function entityName(e: AuditDetailItem["entity"]): string {
  if (!e) return "unknown";
  return typeof e === "string" ? e : (e.text ?? "unknown");
}

async function runOne(
  target: string,
  strategy: "mobile" | "desktop",
  apiKey: string,
  onRetry: (msg: string) => void
): Promise<PsiRun> {
  const base: PsiRun = {
    url: target,
    strategy,
    scores: {},
    metrics: {},
    display: {},
    failing: [],
    opportunities: [],
    lcpChecklist: [],
    lcpBreakdown: [],
    clsElements: [],
    unusedJs: [],
    renderBlocking: [],
    thirdParty: [],
    diagnostics: [],
  };

  const endpoint =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(target)}` +
    `&strategy=${strategy}` +
    `&category=performance&category=accessibility&category=seo&category=best-practices` +
    `&key=${apiKey}`;

  const TRIES = 4;
  let data: PsiResponse;
  try {
    data = await withRetry(
      async () => {
        const res = await fetchWithTimeout(endpoint, { timeoutMs: 120_000 });
        if (!res.ok) {
          const text = await res.text();
          const err = new Error(`HTTP ${res.status}: ${trunc(text.replace(/\s+/g, " "), 200)}`);
          // 4xx (bad URL, bad key, quota) won't fix itself; only 429/5xx are worth retrying.
          if (res.status < 500 && res.status !== 429) Object.assign(err, { fatal: true });
          throw err;
        }
        return (await res.json()) as PsiResponse;
      },
      {
        tries: TRIES,
        baseDelayMs: 4000,
        shouldRetry: (e) => !(e as { fatal?: boolean })?.fatal,
        onRetry: (attempt, e) =>
          onRetry(
            `  retry ${attempt}/${TRIES - 1} ${strategy} ${pathOf(target, PUBLIC_URL)} — ${errMsg(e)}`
          ),
      }
    );
  } catch (e) {
    return { ...base, error: errMsg(e) };
  }

  const lh = data.lighthouseResult;
  const audits = lh?.audits ?? {};
  const cats = lh?.categories ?? {};

  base.scores = {
    performance: cats.performance?.score ?? null,
    accessibility: cats.accessibility?.score ?? null,
    bestPractices: cats["best-practices"]?.score ?? null,
    seo: cats.seo?.score ?? null,
  };

  const numeric = (id: string) => audits[id]?.numericValue;
  base.metrics = {
    lcp: numeric("largest-contentful-paint"),
    fcp: numeric("first-contentful-paint"),
    tbt: numeric("total-blocking-time"),
    cls: numeric("cumulative-layout-shift"),
    si: numeric("speed-index"),
    tti: numeric("interactive"),
    ttfb: numeric("server-response-time"),
  };
  for (const id of [
    "largest-contentful-paint",
    "first-contentful-paint",
    "total-blocking-time",
    "cumulative-layout-shift",
    "speed-index",
    "interactive",
    "server-response-time",
  ]) {
    base.display[id] = audits[id]?.displayValue ?? "?";
  }

  // Failing audits, attributed to the category whose score they drag down.
  for (const [catId, cat] of Object.entries(cats)) {
    for (const ref of cat.auditRefs ?? []) {
      const a = audits[ref.id];
      if (!a || a.score === null || a.score === undefined) continue;
      if (a.score >= 1) continue;
      base.failing.push({
        category: CATEGORY_LABELS[catId] ?? catId,
        id: ref.id,
        title: a.title ?? ref.id,
        score: a.score,
        weight: ref.weight ?? 0,
        displayValue: a.displayValue,
        description: firstSentence(a.description),
      });
    }
  }
  base.failing.sort((x, y) => y.weight - x.weight || x.score - y.score);

  // The metric audits (LCP/CLS/FCP/…) are measurements, not fixes — they belong
  // in the metrics table above, not in a list of things to do.
  const metricAuditIds = new Set([
    ...(cats.performance?.auditRefs ?? []).filter((r) => r.group === "metrics").map((r) => r.id),
    // These are measurements too, but Lighthouse files them outside the group.
    "max-potential-fid",
    "interactive",
    "speed-index",
  ]);

  // Lighthouse 13 dropped `details.type === "opportunity"` for most audits in
  // favour of `metricSavings`, so rank by the metric each fix would improve.
  base.opportunities = Object.entries(audits)
    .filter(([id]) => !metricAuditIds.has(id))
    .filter(([, a]) => {
      if (a.score === null || a.score === undefined || a.score >= 1) return false;
      const savings = Object.values(a.metricSavings ?? {});
      return a.details?.type === "opportunity" || savings.some((v) => v > 0) || a.displayValue;
    })
    .map(([id, a]) => {
      const savings = a.metricSavings ?? {};
      const best = Object.entries(savings).sort((x, y) => y[1] - x[1])[0];
      return {
        id,
        title: a.title ?? id,
        savingsMs: a.details?.overallSavingsMs ?? (best && best[0] !== "CLS" ? best[1] : undefined),
        savingsBytes: a.details?.overallSavingsBytes,
        metric: best && best[1] > 0 ? `${best[0]} −${best[0] === "CLS" ? best[1].toFixed(3) : `${best[1]}ms`}` : undefined,
        displayValue: a.displayValue,
      };
    })
    .sort((x, y) => (y.savingsMs ?? 0) - (x.savingsMs ?? 0));

  const lcpDiscovery = pick(audits, ["lcp-discovery-insight"]);
  const lcpBreakdown = pick(audits, ["lcp-breakdown-insight"]);
  base.lcpElement =
    findSnippet(lcpDiscovery?.details?.items) ??
    findSnippet(lcpBreakdown?.details?.items) ??
    findSnippet(audits["largest-contentful-paint-element"]?.details?.items);

  const checklistRow = tableRows(lcpDiscovery).find((r) => r.type === "checklist" && r.items && !Array.isArray(r.items));
  if (checklistRow && checklistRow.items && !Array.isArray(checklistRow.items)) {
    base.lcpChecklist = Object.values(checklistRow.items as Record<string, ChecklistEntry>).map((c) => ({
      label: c.label ?? "",
      ok: c.value === true,
    }));
  }

  base.lcpBreakdown = tableRows(lcpBreakdown)
    .filter((r) => r.subpart && typeof r.duration === "number")
    .map((r) => ({ label: r.label ?? r.subpart ?? "", ms: r.duration ?? 0 }));

  // The same element usually shifts many times, so aggregate by selector — the
  // table should name culprits, not individual shift events. Use one source
  // only; cls-culprits-insight and layout-shifts describe the same shifts.
  const shiftRows = ["cls-culprits-insight", "layout-shifts", "layout-shift-elements"]
    .map((id) => tableRows(audits[id]).filter((r) => r.node?.snippet))
    .find((rows) => rows.length) ?? [];
  const shiftAgg = new Map<string, { snippet: string; selector: string; score: number; shifts: number }>();
  for (const r of shiftRows) {
    const key = r.node?.selector || r.node?.snippet || "";
    const existing = shiftAgg.get(key);
    if (existing) {
      existing.score += r.score ?? 0;
      existing.shifts++;
    } else {
      shiftAgg.set(key, {
        snippet: r.node?.snippet ?? "",
        selector: r.node?.selector ?? "",
        score: r.score ?? 0,
        shifts: 1,
      });
    }
  }
  base.clsElements = [...shiftAgg.values()].sort((a, b) => b.score - a.score).slice(0, 6);

  base.unusedJs = tableRows(audits["unused-javascript"])
    .map((i) => ({ url: i.url ?? "", wastedBytes: i.wastedBytes ?? 0, totalBytes: i.totalBytes ?? 0 }))
    .filter((i) => i.url)
    .sort((a, b) => b.wastedBytes - a.wastedBytes)
    .slice(0, 8);

  base.renderBlocking = tableRows(pick(audits, ["render-blocking-insight", "render-blocking-resources"]))
    .map((i) => ({ url: i.url ?? "", wastedMs: i.wastedMs ?? 0 }))
    .filter((i) => i.url)
    .slice(0, 6);

  base.thirdParty = tableRows(pick(audits, ["third-parties-insight", "third-party-summary"]))
    .filter((i) => i.entity)
    .map((i) => ({
      entity: entityName(i.entity),
      blockingTime: i.blockingTime ?? i.mainThreadTime ?? 0,
      transferSize: i.transferSize ?? 0,
    }))
    .sort((a, b) => b.transferSize - a.transferSize)
    .slice(0, 8);

  base.diagnostics = DIAGNOSTIC_IDS.filter((id) => audits[id]).map((id) => {
    const a = audits[id];
    const savings = Object.entries(a.metricSavings ?? {}).filter(([, v]) => v > 0);
    const verdict =
      a.displayValue ??
      (a.score === null || a.score === undefined ? "informative" : a.score >= 1 ? "pass" : "needs work");
    return {
      id,
      title: a.title ?? id,
      displayValue: savings.length
        ? `${verdict} (would save ${savings.map(([m, v]) => `${m} ${m === "CLS" ? v.toFixed(3) : `${v}ms`}`).join(", ")})`
        : verdict,
    };
  });

  const fieldSource = data.loadingExperience?.metrics ? data.loadingExperience : data.originLoadingExperience;
  if (fieldSource?.metrics) {
    base.field = {
      overall: fieldSource.overall_category,
      metrics: Object.entries(fieldSource.metrics).map(([name, m]) => ({
        name,
        p75: m.percentile,
        bucket: m.category,
      })),
    };
  }

  return base;
}

/** Origin-level CrUX. Often has data when individual URLs don't. */
async function cruxOrigin(apiKey: string): Promise<string> {
  const lines: string[] = [];
  for (const formFactor of ["PHONE", "DESKTOP"] as const) {
    try {
      const res = await fetchWithTimeout(
        `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${apiKey}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ origin: PUBLIC_URL, formFactor }),
          timeoutMs: 20_000,
        }
      );
      if (res.status === 404) {
        lines.push(`- **${formFactor}:** no field data — the origin doesn't have enough real Chrome traffic yet.`);
        continue;
      }
      if (!res.ok) {
        lines.push(`- **${formFactor}:** error ${res.status}`);
        continue;
      }
      const json = (await res.json()) as {
        record?: { metrics?: Record<string, { percentiles?: { p75?: number | string } }> };
      };
      const metrics = json.record?.metrics ?? {};
      const parts = Object.entries(metrics).map(([k, v]) => `${k} p75=${v.percentiles?.p75 ?? "?"}`);
      lines.push(`- **${formFactor}:** ${parts.join(", ") || "no metrics"}`);
    } catch (e) {
      lines.push(`- **${formFactor}:** ${errMsg(e)}`);
    }
  }
  return lines.join("\n");
}

export async function psiSection(
  apiKey: string,
  urls: string[],
  log: (msg: string) => void
): Promise<SectionResult> {
  const jobs: { url: string; strategy: "mobile" | "desktop" }[] = [];
  for (const url of urls) {
    jobs.push({ url, strategy: "mobile" });
    jobs.push({ url, strategy: "desktop" });
  }

  log(`Running ${jobs.length} Lighthouse audits (${urls.length} URLs × mobile/desktop)…`);
  let done = 0;
  const runs = await mapLimit(jobs, 4, async (job) => {
    const r = await runOne(job.url, job.strategy, apiKey, log);
    done++;
    log(
      `  [${done}/${jobs.length}] ${job.strategy.padEnd(7)} ${pathOf(job.url, PUBLIC_URL).padEnd(38)} ${
        r.error ? `FAILED (${trunc(r.error, 60)})` : `perf ${score100(r.scores.performance)}`
      }`
    );
    return r;
  });

  const actions: Action[] = [];
  const byUrl = new Map<string, { mobile?: PsiRun; desktop?: PsiRun }>();
  for (const r of runs) {
    if (!byUrl.has(r.url)) byUrl.set(r.url, {});
    byUrl.get(r.url)![r.strategy] = r;
  }

  // ---------- scorecard ----------
  const matrix: (string | number)[][] = [];
  for (const [url, pair] of byUrl) {
    for (const strategy of ["mobile", "desktop"] as const) {
      const r = pair[strategy];
      if (!r) continue;
      if (r.error) {
        matrix.push([pathOf(url, PUBLIC_URL), strategy, "ERROR", "", "", "", "", "", "", trunc(r.error, 40)]);
        continue;
      }
      const lcpS = (r.metrics.lcp ?? 0) / 1000;
      const cls = r.metrics.cls ?? 0;
      const tbt = r.metrics.tbt ?? 0;
      matrix.push([
        pathOf(url, PUBLIC_URL),
        strategy,
        score100(r.scores.performance),
        score100(r.scores.accessibility),
        score100(r.scores.bestPractices),
        score100(r.scores.seo),
        `${lcpS.toFixed(1)}s ${flag(lcpS, 2.5, 4)}`,
        `${cls.toFixed(3)} ${flag(cls, 0.1, 0.25)}`,
        `${tbt.toFixed(0)}ms ${flag(tbt, 200, 600)}`,
        `${(r.metrics.ttfb ?? 0).toFixed(0)}ms`,
      ]);
    }
  }

  // ---------- Core Web Vitals actions ----------
  const clsOffenders = runs.filter((r) => !r.error && (r.metrics.cls ?? 0) > 0.1);
  if (clsOffenders.length) {
    const worst = clsOffenders.sort((a, b) => (b.metrics.cls ?? 0) - (a.metrics.cls ?? 0))[0];
    // Rank culprits by how much total shift they account for across all runs.
    const bySelector = new Map<string, { snippet: string; score: number; pages: Set<string> }>();
    for (const r of clsOffenders) {
      for (const c of r.clsElements) {
        const key = c.selector || c.snippet;
        if (!bySelector.has(key)) bySelector.set(key, { snippet: c.snippet, score: 0, pages: new Set() });
        const agg = bySelector.get(key)!;
        agg.score += c.score;
        agg.pages.add(pathOf(r.url, PUBLIC_URL));
      }
    }
    const culprits = [...bySelector.entries()].sort((a, b) => b[1].score - a[1].score).slice(0, 4);
    actions.push({
      severity: "high",
      area: "Core Web Vitals",
      title: `CLS fails on ${clsOffenders.length} of ${runs.filter((r) => !r.error).length} runs (worst ${(worst.metrics.cls ?? 0).toFixed(3)} on ${pathOf(worst.url, PUBLIC_URL)} ${worst.strategy})`,
      detail:
        `Layout shift above 0.10 fails a Core Web Vital on every affected page. Lighthouse attributes the shifts to:\n` +
        (culprits.length
          ? culprits
              .map(
                ([selector, agg]) =>
                  `    • ${selector} — ${agg.score.toFixed(3)} total shift on ${agg.pages.size} page(s)\n      ${trunc(agg.snippet, 130)}`
              )
              .join("\n")
          : "    (no element attribution returned)") +
        `\n    Fix by reserving space before the element renders: explicit width/height or aspect-ratio, and animate only \`transform\`/\`opacity\` — animating \`left\`/\`top\`/\`width\`/\`height\` moves surrounding layout and counts as shift.`,
    });
  }

  const lcpOffenders = runs.filter((r) => !r.error && (r.metrics.lcp ?? 0) > 2500);
  if (lcpOffenders.length) {
    const worst = lcpOffenders.sort((a, b) => (b.metrics.lcp ?? 0) - (a.metrics.lcp ?? 0))[0];
    const failedChecks = worst.lcpChecklist.filter((c) => !c.ok);
    const slowestPhase = [...worst.lcpBreakdown].sort((a, b) => b.ms - a.ms)[0];
    actions.push({
      severity: "high",
      area: "Core Web Vitals",
      title: `LCP over 2.5s on ${lcpOffenders.length} run(s) — worst ${((worst.metrics.lcp ?? 0) / 1000).toFixed(1)}s on ${pathOf(worst.url, PUBLIC_URL)} ${worst.strategy}`,
      detail:
        (worst.lcpElement ? `LCP element: ${trunc(worst.lcpElement, 150)}\n    ` : "") +
        (slowestPhase ? `Slowest phase: ${slowestPhase.label} (${slowestPhase.ms.toFixed(0)}ms).\n    ` : "") +
        (failedChecks.length
          ? `Lighthouse's LCP checklist fails on: ${failedChecks.map((c) => c.label).join("; ")}. Fix those first — they're mechanical.\n    `
          : "") +
        `Then: keep the LCP element out of lazy-loading, set \`priority\` on the hero next/image, preload the hero font, and cut render-blocking CSS/JS above the fold.`,
    });
  }

  // Category-level regressions worth naming explicitly.
  for (const r of runs.filter((x) => !x.error)) {
    for (const [key, label, threshold] of [
      ["seo", "SEO", 1],
      ["accessibility", "Accessibility", 0.95],
      ["bestPractices", "Best practices", 0.95],
    ] as const) {
      const score = r.scores[key];
      if (score !== null && score !== undefined && score < threshold) {
        const fails = r.failing.filter((f) => f.category === label);
        if (!fails.length) continue;
        actions.push({
          severity: key === "seo" ? "high" : "medium",
          area: label,
          title: `${label} ${score100(score)}/100 on ${pathOf(r.url, PUBLIC_URL)} (${r.strategy})`,
          detail: fails
            .slice(0, 5)
            .map((f) => `${f.title}${f.displayValue ? ` — ${f.displayValue}` : ""}`)
            .join("; "),
        });
      }
    }
  }

  const failed = runs.filter((r) => r.error);
  if (failed.length) {
    actions.push({
      severity: "low",
      area: "Tooling",
      title: `${failed.length} Lighthouse run(s) failed after retries`,
      detail:
        "PageSpeed Insights returns sporadic 500s from its own infrastructure. Re-run `npm run seo:report` later; if a single URL fails consistently, load it in the PSI web UI to see the real error.",
    });
  }

  // ---------- per-URL detail ----------
  const details: string[] = [];
  for (const [url, pair] of byUrl) {
    details.push(`### ${pathOf(url, PUBLIC_URL)}`);
    for (const strategy of ["mobile", "desktop"] as const) {
      const r = pair[strategy];
      if (!r) continue;
      details.push(`**${strategy.toUpperCase()}**`);
      if (r.error) {
        details.push(`ERROR: ${r.error}`, ``);
        continue;
      }
      details.push(
        table(
          ["metric", "value", "good", "verdict"],
          [
            ["LCP (largest contentful paint)", r.display["largest-contentful-paint"], "≤ 2.5s", flag((r.metrics.lcp ?? 0) / 1000, 2.5, 4)],
            ["CLS (cumulative layout shift)", r.display["cumulative-layout-shift"], "≤ 0.10", flag(r.metrics.cls ?? 0, 0.1, 0.25)],
            ["TBT (total blocking time)", r.display["total-blocking-time"], "≤ 200ms", flag(r.metrics.tbt ?? 0, 200, 600)],
            ["FCP (first contentful paint)", r.display["first-contentful-paint"], "≤ 1.8s", flag((r.metrics.fcp ?? 0) / 1000, 1.8, 3)],
            ["Speed Index", r.display["speed-index"], "≤ 3.4s", flag((r.metrics.si ?? 0) / 1000, 3.4, 5.8)],
            ["Time to interactive", r.display["interactive"], "≤ 3.8s", flag((r.metrics.tti ?? 0) / 1000, 3.8, 7.3)],
            ["TTFB (server response)", r.display["server-response-time"], "≤ 0.8s", flag((r.metrics.ttfb ?? 0) / 1000, 0.8, 1.8)],
          ]
        )
      );

      if (r.lcpElement) details.push(``, `LCP element: \`${trunc(r.lcpElement, 200)}\``);

      if (r.lcpChecklist.length) {
        details.push(
          ``,
          `LCP checklist:`,
          bullet(r.lcpChecklist.map((c) => `${c.ok ? "✅" : "❌"} ${c.label}`))
        );
      }

      if (r.lcpBreakdown.length) {
        details.push(
          ``,
          `LCP phase breakdown (which part of the load is slow):`,
          table(
            ["phase", "duration"],
            r.lcpBreakdown.map((p) => [p.label, `${p.ms.toFixed(0)}ms`]),
            ["l", "r"]
          )
        );
      }

      if (r.clsElements.length) {
        details.push(
          ``,
          `Layout-shift culprits (aggregated by element):`,
          table(
            ["element", "shift score", "shifts", "snippet"],
            r.clsElements.map((c) => [
              trunc(c.selector || "(unknown)", 46),
              c.score.toFixed(4),
              String(c.shifts),
              trunc(c.snippet, 70),
            ]),
            ["l", "r", "r", "l"]
          )
        );
      }

      if (r.failing.length) {
        details.push(
          ``,
          `Failing audits (weight = how much it moves the category score):`,
          table(
            ["category", "audit", "score", "weight", "value", "what it means"],
            r.failing
              .slice(0, 14)
              .map((f) => [
                f.category,
                trunc(f.title, 42),
                score100(f.score),
                String(f.weight),
                trunc(f.displayValue ?? "", 22),
                trunc(f.description ?? "", 80),
              ]),
            ["l", "l", "r", "r", "l", "l"]
          )
        );
      }

      if (r.opportunities.length) {
        details.push(
          ``,
          `Opportunities (what Lighthouse estimates each fix would recover):`,
          table(
            ["opportunity", "improves", "est. savings", "detail"],
            r.opportunities
              .slice(0, 12)
              .map((o) => [
                trunc(o.title, 46),
                o.metric ?? "—",
                o.savingsBytes ? `${(o.savingsBytes / 1024).toFixed(0)} KiB` : o.savingsMs ? `${o.savingsMs.toFixed(0)}ms` : "—",
                trunc(o.displayValue ?? "", 30),
              ]),
            ["l", "l", "r", "l"]
          )
        );
      }

      if (r.unusedJs.length) {
        details.push(
          ``,
          `Largest unused JavaScript:`,
          table(
            ["file", "unused", "total"],
            r.unusedJs.map((u) => [
              trunc(u.url.replace(PUBLIC_URL, ""), 60),
              `${(u.wastedBytes / 1024).toFixed(0)} KiB`,
              `${(u.totalBytes / 1024).toFixed(0)} KiB`,
            ]),
            ["l", "r", "r"]
          )
        );
      }

      if (r.renderBlocking.length) {
        details.push(
          ``,
          `Render-blocking resources:`,
          table(
            ["resource", "blocking"],
            r.renderBlocking.map((u) => [trunc(u.url.replace(PUBLIC_URL, ""), 60), `${u.wastedMs.toFixed(0)}ms`]),
            ["l", "r"]
          )
        );
      }

      if (r.thirdParty.length) {
        details.push(
          ``,
          `Third-party weight:`,
          table(
            ["entity", "transfer", "blocking"],
            r.thirdParty.map((t) => [
              t.entity,
              `${(t.transferSize / 1024).toFixed(0)} KiB`,
              `${t.blockingTime.toFixed(0)}ms`,
            ]),
            ["l", "r", "r"]
          )
        );
      }

      if (r.diagnostics.length) {
        details.push(
          ``,
          `Diagnostics:`,
          table(
            ["check", "value"],
            r.diagnostics.map((d) => [trunc(d.title, 50), d.displayValue]),
            ["l", "l"]
          )
        );
      }

      details.push(
        ``,
        r.field
          ? `Real-user field data (CrUX, 28d): overall **${r.field.overall ?? "?"}**\n` +
            bullet(r.field.metrics.map((m) => `${m.name}: p75 ${m.p75 ?? "?"} (${m.bucket ?? "?"})`))
          : `Real-user field data (CrUX): none — not enough Chrome traffic on this URL yet, so all numbers above are lab simulations.`,
        ``
      );
    }
  }

  log("Fetching origin-level CrUX…");
  const originCrux = await cruxOrigin(apiKey);

  const okRuns = runs.filter((r) => !r.error);
  const avg = (pick: (r: PsiRun) => number | null | undefined) => {
    const vals = okRuns.map(pick).filter((v): v is number => typeof v === "number");
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  };

  const summary = [
    `**Lighthouse runs:** ${okRuns.length} ok, ${failed.length} failed`,
    `**Avg performance:** mobile ${score100(avg((r) => (r.strategy === "mobile" ? r.scores.performance : null)))}, desktop ${score100(avg((r) => (r.strategy === "desktop" ? r.scores.performance : null)))}`,
    `**Core Web Vitals:** ${clsOffenders.length} run(s) fail CLS, ${lcpOffenders.length} fail LCP`,
    `**Pages with SEO < 100:** ${okRuns.filter((r) => (r.scores.seo ?? 1) < 1).length}`,
  ];

  const body = [
    `### Scorecard — every page, both form factors`,
    table(
      ["page", "device", "perf", "a11y", "best-pr", "seo", "LCP", "CLS", "TBT", "TTFB"],
      matrix,
      ["l", "l", "r", "r", "r", "r", "r", "r", "r", "r"]
    ),
    ``,
    `_Thresholds: LCP ≤2.5s, CLS ≤0.10, TBT ≤200ms, TTFB ≤0.8s. ✅ good / ⚠️ needs improvement / ❌ poor._`,
    ``,
    `### Origin-level real-user data (CrUX)`,
    originCrux,
    ``,
    `## Per-page detail`,
    details.join("\n"),
  ].join("\n");

  return {
    heading: "PageSpeed Insights + Core Web Vitals",
    body,
    summary,
    actions,
    snapshot: {
      runs: okRuns.map((r) => ({
        url: r.url,
        strategy: r.strategy,
        performance: r.scores.performance,
        accessibility: r.scores.accessibility,
        bestPractices: r.scores.bestPractices,
        seo: r.scores.seo,
        lcp: r.metrics.lcp,
        cls: r.metrics.cls,
        tbt: r.metrics.tbt,
      })),
      failedRuns: failed.length,
    },
  };
}
