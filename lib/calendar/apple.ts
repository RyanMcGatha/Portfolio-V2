import { createDAVClient } from "tsdav";
import type { CalendarEventInput } from "./types";

/**
 * Apple/iCloud Calendar via CalDAV.
 *
 * Setup:
 *   1. Generate an app-specific password at https://appleid.apple.com
 *      (Sign-In and Security > App-Specific Passwords).
 *   2. Set APPLE_ID to your iCloud email and APPLE_APP_SPECIFIC_PASSWORD to
 *      that generated password.
 *   3. (Optional) Set APPLE_CALENDAR_URL to target a specific calendar; by
 *      default the first calendar that supports events is used.
 */
export async function addAppleCalendarEvent(event: CalendarEventInput): Promise<void> {
  const username = process.env.APPLE_ID;
  const password = process.env.APPLE_APP_SPECIFIC_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "Apple Calendar not configured (missing APPLE_ID / APPLE_APP_SPECIFIC_PASSWORD)"
    );
  }

  const client = await createDAVClient({
    serverUrl: "https://caldav.icloud.com/",
    credentials: { username, password },
    authMethod: "Basic",
    defaultAccountType: "caldav",
  });

  const calendars = await client.fetchCalendars();
  const targetUrl = process.env.APPLE_CALENDAR_URL;
  const calendar =
    calendars.find((c) => (targetUrl ? c.url === targetUrl : false)) ??
    calendars.find((c) => (c.components ?? []).includes("VEVENT")) ??
    calendars[0];

  if (!calendar) {
    throw new Error("No iCloud calendar found for this account");
  }

  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@ryanm.info`;

  await client.createCalendarObject({
    calendar,
    iCalString: buildICS(event, uid),
    filename: `${uid}.ics`,
  });
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toICSDate(date: Date): string {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function buildICS(event: CalendarEventInput, uid: string): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//portfolio-next-js//contact-form//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(event.start)}`,
    `DTEND:${toICSDate(event.end)}`,
    `SUMMARY:${escapeICSText(event.summary)}`,
    `DESCRIPTION:${escapeICSText(event.description)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "TRIGGER:PT0M",
    "DESCRIPTION:Reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
