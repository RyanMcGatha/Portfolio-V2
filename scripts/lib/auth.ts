/**
 * Auth helper. Two paths:
 *   1. OAuth (recommended) — uses YOUR Google account that already owns
 *      Search Console + GA4. No need to add a service account anywhere.
 *      Requires .oauth-client.json (Desktop OAuth client) and a one-time
 *      `npm run auth` to capture a refresh token into .oauth-token.json.
 *   2. Service account — set GOOGLE_APPLICATION_CREDENTIALS to a JSON key
 *      and grant that service account email access in GSC + GA4.
 *
 * The seo-report script auto-detects which is available, preferring OAuth.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";

const OAUTH_CLIENT_PATH = resolve(process.cwd(), ".oauth-client.json");
const OAUTH_TOKEN_PATH = resolve(process.cwd(), ".oauth-token.json");

export const SCOPES = [
  "https://www.googleapis.com/auth/webmasters",
  "https://www.googleapis.com/auth/analytics.readonly",
];

interface OAuthClientFile {
  installed?: { client_id: string; client_secret: string };
  web?: { client_id: string; client_secret: string };
}

interface OAuthTokenFile {
  refresh_token?: string;
  access_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
}

export const REDIRECT_PORT = 53789;
export const REDIRECT_URI = `http://127.0.0.1:${REDIRECT_PORT}/`;

export function loadOAuthClient(): OAuth2Client | null {
  if (!existsSync(OAUTH_CLIENT_PATH)) return null;
  const raw = JSON.parse(readFileSync(OAUTH_CLIENT_PATH, "utf8")) as OAuthClientFile;
  const cfg = raw.installed ?? raw.web;
  if (!cfg) return null;
  return new google.auth.OAuth2(cfg.client_id, cfg.client_secret, REDIRECT_URI);
}

export function loadOAuthClientWithToken(): OAuth2Client | null {
  const client = loadOAuthClient();
  if (!client) return null;
  if (!existsSync(OAUTH_TOKEN_PATH)) return null;
  const tokens = JSON.parse(readFileSync(OAUTH_TOKEN_PATH, "utf8")) as OAuthTokenFile;
  if (!tokens.refresh_token) return null;
  client.setCredentials(tokens);
  return client;
}

export interface AuthResult {
  kind: "oauth" | "service-account";
  /** Google APIs auth (used by googleapis package). */
  authClient: OAuth2Client | null;
  /** Service-account file path for ADC (used by GA4 SDK). */
  credentialsPath?: string;
}

export function resolveAuth(): AuthResult {
  const oauth = loadOAuthClientWithToken();
  if (oauth) {
    return { kind: "oauth", authClient: oauth };
  }
  const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (saPath && existsSync(resolve(process.cwd(), saPath))) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = resolve(process.cwd(), saPath);
    return {
      kind: "service-account",
      authClient: null,
      credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    };
  }
  throw new Error(
    "No auth available. Either:\n" +
      "  (a) run `npm run auth` after creating .oauth-client.json (recommended), or\n" +
      "  (b) set GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON path."
  );
}

export const AUTH_PATHS = {
  OAUTH_CLIENT_PATH,
  OAUTH_TOKEN_PATH,
};
