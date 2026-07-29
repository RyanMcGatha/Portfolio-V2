import { addGoogleCalendarEvent } from "./google";
import { addAppleCalendarEvent } from "./apple";
import type { CalendarEventInput } from "./types";

export type { CalendarEventInput };

export interface CalendarSyncResult {
  provider: "google" | "apple";
  ok: boolean;
  error?: string;
}

/**
 * Fires off both calendar integrations in parallel. Each is best-effort and
 * independently configured via env vars — if one (or both) isn't set up,
 * it's skipped rather than failing the whole request.
 */
export async function addToCalendars(event: CalendarEventInput): Promise<CalendarSyncResult[]> {
  const jobs: Array<{ provider: CalendarSyncResult["provider"]; run: () => Promise<void> }> = [
    { provider: "google", run: () => addGoogleCalendarEvent(event) },
    { provider: "apple", run: () => addAppleCalendarEvent(event) },
  ];

  const results = await Promise.allSettled(jobs.map((j) => j.run()));

  return results.map((result, i) => ({
    provider: jobs[i].provider,
    ok: result.status === "fulfilled",
    error: result.status === "rejected" ? String(result.reason?.message ?? result.reason) : undefined,
  }));
}
