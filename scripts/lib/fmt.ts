/**
 * Formatting helpers. Output is a .md file that also has to stay readable when
 * dumped straight into a terminal, so tables are markdown *and* column-padded.
 */

export type Align = "l" | "r";

export interface Action {
  severity: "critical" | "high" | "medium" | "low";
  area: string;
  title: string;
  detail: string;
}

export interface SectionResult {
  heading: string;
  body: string;
  /** Bullet lines pulled up into the executive summary at the top of the report. */
  summary: string[];
  /** Prioritized fixes pulled up into the action plan. */
  actions: Action[];
  /** Machine-readable values persisted so future runs can show deltas. */
  snapshot: Record<string, unknown>;
}

export const SEVERITY_ORDER: Record<Action["severity"], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const SEVERITY_ICON: Record<Action["severity"], string> = {
  critical: "🔴",
  high: "🟠",
  medium: "🟡",
  low: "⚪",
};

/** Fixed-width markdown table. Empty row sets collapse to a placeholder line. */
export function table(
  headers: string[],
  rows: (string | number | null | undefined)[][],
  align: Align[] = []
): string {
  if (!rows.length) return "_(no rows returned)_";

  const cells = rows.map((r) => r.map((c) => (c === null || c === undefined ? "" : String(c))));
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...cells.map((r) => (r[i] ?? "").length))
  );

  const pad = (s: string, i: number) =>
    (align[i] ?? "l") === "r" ? s.padStart(widths[i]) : s.padEnd(widths[i]);

  const head = `| ${headers.map((h, i) => pad(h, i)).join(" | ")} |`;
  const sep = `| ${widths
    .map((w, i) => ((align[i] ?? "l") === "r" ? "-".repeat(Math.max(w - 1, 1)) + ":" : "-".repeat(w)))
    .join(" | ")} |`;
  const body = cells.map((r) => `| ${r.map((c, i) => pad(c ?? "", i)).join(" | ")} |`);
  return [head, sep, ...body].join("\n");
}

export function num(n: number | null | undefined, digits = 0): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "–";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function pctOf(n: number | null | undefined, digits = 1): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "–";
  return `${(n * 100).toFixed(digits)}%`;
}

export function score100(n: number | null | undefined): string {
  if (n === null || n === undefined) return "–";
  return String(Math.round(n * 100));
}

export function secs(n: number | null | undefined, digits = 1): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "–";
  return `${n.toFixed(digits)}s`;
}

/**
 * "12 → 18  ▲ +6 (+50%)". `lowerIsBetter` flips the good/bad arrow, which is
 * what average search position needs.
 */
export function delta(
  cur: number | null | undefined,
  prev: number | null | undefined,
  opts: { digits?: number; lowerIsBetter?: boolean; suffix?: string } = {}
): string {
  const digits = opts.digits ?? 0;
  const fmt = (v: number) => v.toFixed(digits) + (opts.suffix ?? "");
  if (cur === null || cur === undefined) return "–";
  if (prev === null || prev === undefined) return fmt(cur);

  const diff = cur - prev;
  const good = opts.lowerIsBetter ? diff < 0 : diff > 0;
  const arrow = diff === 0 ? "▬" : good ? "▲" : "▼";
  const pctChange =
    prev === 0 ? (diff === 0 ? "0%" : "new") : `${diff >= 0 ? "+" : ""}${((diff / prev) * 100).toFixed(0)}%`;
  const signed = `${diff >= 0 ? "+" : ""}${diff.toFixed(digits)}`;
  return `${fmt(prev)} → ${fmt(cur)}  ${arrow} ${signed} (${pctChange})`;
}

/** Inline sparkline for daily trends. */
export function sparkline(values: number[]): string {
  if (!values.length) return "";
  const blocks = "▁▂▃▄▅▆▇█";
  const max = Math.max(...values);
  if (max === 0) return blocks[0].repeat(values.length);
  return values
    .map((v) => blocks[Math.min(blocks.length - 1, Math.round((v / max) * (blocks.length - 1)))])
    .join("");
}

/** Truncate long URLs/titles so tables stay narrow. */
export function trunc(s: string, max = 60): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

/** Strip the origin so page tables read as paths. */
export function pathOf(url: string, origin: string): string {
  return url.startsWith(origin) ? url.slice(origin.length) || "/" : url;
}

export function bullet(lines: string[]): string {
  if (!lines.length) return "_(none)_";
  return lines.map((l) => `- ${l}`).join("\n");
}

/** Threshold marker used across Core Web Vitals and content-length checks. */
export function flag(value: number, good: number, poor: number, lowerIsBetter = true): string {
  const isGood = lowerIsBetter ? value <= good : value >= good;
  const isPoor = lowerIsBetter ? value >= poor : value <= poor;
  if (isGood) return "✅";
  if (isPoor) return "❌";
  return "⚠️";
}
