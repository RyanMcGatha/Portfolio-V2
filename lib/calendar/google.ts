import { google } from "googleapis";
import type { CalendarEventInput } from "./types";

/**
 * Google Calendar, authenticated as YOUR account (not a service account) so the
 * event lands on a calendar you actually look at.
 *
 * Setup:
 *   1. `npm run auth` (see scripts/auth.ts) to get a refresh token that includes
 *      the calendar scope — re-run it if you already have a token without that
 *      scope (revoke old access at https://myaccount.google.com/permissions first).
 *   2. Copy client_id/client_secret from .oauth-client.json and refresh_token
 *      from .oauth-token.json into GOOGLE_OAUTH_CLIENT_ID,
 *      GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN — these are the
 *      env vars actually used at request time, since the deployed app has no
 *      access to local files.
 */
export async function addGoogleCalendarEvent(event: CalendarEventInput): Promise<void> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Google Calendar not configured (missing GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET / GOOGLE_OAUTH_REFRESH_TOKEN)"
    );
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials({ refresh_token: refreshToken });

  const calendar = google.calendar({ version: "v3", auth });
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: event.summary,
      description: event.description,
      start: { dateTime: event.start.toISOString() },
      end: { dateTime: event.end.toISOString() },
      reminders: {
        useDefault: false,
        overrides: [{ method: "popup", minutes: 0 }],
      },
    },
  });
}
