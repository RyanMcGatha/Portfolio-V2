/**
 * Small async/parsing helpers shared by the SEO report modules.
 */

import { existsSync, readFileSync } from "node:fs";

/** Populate process.env from a .env-style file, without overriding vars already set. */
export function loadDotEnv(path: string) {
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

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Run `fn` over `items` with at most `limit` in flight. Preserves input order. */
export async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

/**
 * Retry with exponential backoff. PageSpeed Insights returns sporadic 500s
 * ("Lighthouse returned error: Something went wrong") that succeed on retry,
 * so anything hitting that API should go through here.
 */
export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  opts: {
    tries?: number;
    baseDelayMs?: number;
    shouldRetry?: (err: unknown) => boolean;
    onRetry?: (attempt: number, err: unknown) => void;
  } = {}
): Promise<T> {
  const tries = opts.tries ?? 3;
  const base = opts.baseDelayMs ?? 2000;
  let lastErr: unknown;
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      return await fn(attempt);
    } catch (e) {
      lastErr = e;
      if (attempt === tries) break;
      if (opts.shouldRetry && !opts.shouldRetry(e)) break;
      opts.onRetry?.(attempt, e);
      await sleep(base * attempt);
    }
  }
  throw lastErr;
}

/** fetch with a hard timeout so a hung request can't stall the whole report. */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<Response> {
  const { timeoutMs = 20_000, ...rest } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...rest, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function errMsg(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

export function safeJsonParse<T = unknown>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Strip hash + trailing slash so link targets and sitemap entries compare equal. */
export function normalizeUrl(input: string): string {
  try {
    const u = new URL(input);
    u.hash = "";
    if (u.pathname !== "/" && u.pathname.endsWith("/")) {
      u.pathname = u.pathname.replace(/\/+$/, "");
    }
    return u.toString();
  } catch {
    return input;
  }
}
