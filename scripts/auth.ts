/**
 * One-time interactive Google OAuth flow.
 *   1. Reads .oauth-client.json (Desktop OAuth Client from Google Cloud).
 *   2. Opens your browser, you sign in with the Google account that owns
 *      Search Console + GA4, you click Allow.
 *   3. Writes .oauth-token.json with a refresh token.
 *
 * After this, `npm run seo:report` works without any service-account dance.
 *
 * Run: npm run auth
 */
import { createServer } from "node:http";
import { exec } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  loadOAuthClient,
  REDIRECT_PORT,
  REDIRECT_URI,
  SCOPES,
  AUTH_PATHS,
} from "./lib/auth";

const OAUTH_CLIENT_PATH = AUTH_PATHS.OAUTH_CLIENT_PATH;
const OAUTH_TOKEN_PATH = AUTH_PATHS.OAUTH_TOKEN_PATH;

async function main() {
  if (!existsSync(OAUTH_CLIENT_PATH)) {
    console.error(
      `Missing ${OAUTH_CLIENT_PATH}.\n\n` +
        `Create one in 30 seconds:\n` +
        `  1. https://console.cloud.google.com/apis/credentials\n` +
        `  2. + Create credentials → OAuth client ID\n` +
        `  3. Application type: Desktop app\n` +
        `  4. Name: portfolio-analytics-cli\n` +
        `  5. Click Create, then Download JSON\n` +
        `  6. Move it: mv ~/Downloads/client_secret_*.json ${OAUTH_CLIENT_PATH}\n\n` +
        `If you see "OAuth consent screen not configured", first go to:\n` +
        `  https://console.cloud.google.com/apis/credentials/consent\n` +
        `  → User Type: External → Create\n` +
        `  → App name: portfolio-analytics, your email for support + dev contact\n` +
        `  → Scopes: skip → Test users: add your own Gmail → Save\n`
    );
    process.exit(1);
  }

  const oAuth2Client = loadOAuthClient();
  if (!oAuth2Client) {
    console.error(
      `Couldn't parse ${OAUTH_CLIENT_PATH}. Make sure it's a Desktop OAuth client JSON.`
    );
    process.exit(1);
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  console.log(
    `\nOpening browser for Google sign-in.\n` +
      `If it doesn't open, paste this URL manually:\n\n${authUrl}\n`
  );

  const code = await new Promise<string>((resolveCode, rejectCode) => {
    const server = createServer((req, res) => {
      try {
        const url = new URL(req.url ?? "/", REDIRECT_URI);
        const codeParam = url.searchParams.get("code");
        const error = url.searchParams.get("error");
        if (error) {
          res.statusCode = 400;
          res.end(`Auth error: ${error}`);
          server.close();
          rejectCode(new Error(error));
          return;
        }
        if (codeParam) {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(
            `<!doctype html><meta charset="utf-8"><title>Done</title>` +
              `<body style="font-family:system-ui;padding:48px;text-align:center">` +
              `<h1 style="margin:0 0 8px">All set ✓</h1>` +
              `<p>Authentication successful. You can close this tab and return to your terminal.</p>` +
              `</body>`
          );
          server.close();
          resolveCode(codeParam);
        }
      } catch (e) {
        rejectCode(e as Error);
      }
    });
    server.on("error", rejectCode);
    server.listen(REDIRECT_PORT, "127.0.0.1");
  });

  exec(
    process.platform === "darwin"
      ? `open "${authUrl}"`
      : process.platform === "win32"
        ? `start "" "${authUrl}"`
        : `xdg-open "${authUrl}"`
  );

  const { tokens } = await oAuth2Client.getToken(code);
  if (!tokens.refresh_token) {
    console.error(
      `Got an access token but no refresh token. This usually means you've\n` +
        `already authorized this OAuth client before. Revoke access at\n` +
        `https://myaccount.google.com/permissions and re-run.`
    );
    process.exit(1);
  }

  writeFileSync(resolve(OAUTH_TOKEN_PATH), JSON.stringify(tokens, null, 2));
  console.log(`\nSaved refresh token to ${OAUTH_TOKEN_PATH}.`);
  console.log(`Now run:  npm run seo:report\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
