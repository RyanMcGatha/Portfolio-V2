/**
 * One-time (idempotent) GA4 Admin API setup for the client-side event
 * tracking in app/components/util/ConversionTracking.tsx.
 *
 * Registers each new event parameter as a GA4 custom dimension (Admin →
 * Custom definitions) — without this, a parameter's data is collected but
 * can't be added as a dimension in Explore or standard reports. Also marks
 * the events that represent real lead intent as key events (Admin → Events),
 * so they count as conversions instead of just showing up in the events list.
 *
 * Run: npm run ga4:setup
 *   --dry-run   print what would change without calling the API
 *
 * Requires the analytics.edit scope. If .oauth-token.json predates it,
 * revoke access at https://myaccount.google.com/permissions and re-run
 * `npm run auth`.
 */
import { resolve } from "node:path";
import { google } from "googleapis";
import { loadDotEnv, errMsg } from "./lib/util";
import { resolveAuth } from "./lib/auth";
import { bullet, table } from "./lib/fmt";

loadDotEnv(resolve(process.cwd(), ".env.local"));

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const DRY_RUN = process.argv.includes("--dry-run");

const CUSTOM_DIMENSIONS: { parameterName: string; displayName: string; description: string }[] = [
  { parameterName: "page_path", displayName: "Event page path", description: "Path the event fired on (custom instrumentation)." },
  { parameterName: "method", displayName: "Contact method", description: "phone or email, from tel:/mailto: link clicks." },
  { parameterName: "link_url", displayName: "Link URL", description: "href of the clicked link." },
  { parameterName: "link_domain", displayName: "Link domain", description: "Hostname of an outbound link." },
  { parameterName: "content_type", displayName: "Content type", description: "select_content content type (e.g. project)." },
  { parameterName: "item_id", displayName: "Content item ID", description: "select_content item identifier (project title)." },
  { parameterName: "project", displayName: "Project", description: "Project title for project_external_click." },
  { parameterName: "link_type", displayName: "Project link type", description: "live or code, for project_external_click." },
  { parameterName: "network", displayName: "Social network", description: "linkedin or github, for social_click." },
  { parameterName: "nav_source", displayName: "Nav source", description: "header, sidebar, mobile menu, or logo." },
  { parameterName: "link_text", displayName: "Nav link text", description: "Visible text of a tracked nav link." },
  { parameterName: "destination", displayName: "Nav destination", description: "href of a tracked nav link." },
  { parameterName: "percent_scrolled", displayName: "Scroll percent", description: "Scroll depth milestone: 25/50/75/90/100." },
  { parameterName: "section", displayName: "Section viewed", description: "Homepage section id: about/projects/experience/contact." },
  { parameterName: "theme", displayName: "Theme", description: "light or dark, from the theme toggle." },
  { parameterName: "form_name", displayName: "Form name", description: "Which form generated a lead." },
];

/** Real lead-intent signals. Kept short on purpose — GA4 treats key events as conversions everywhere. */
const KEY_EVENTS = ["generate_lead", "contact_click", "resume_download"];

async function main() {
  if (!PROPERTY_ID) {
    console.error("Set GA4_PROPERTY_ID in .env.local first (GA4 Admin → Property Settings → Property details).");
    process.exit(1);
  }

  const auth = resolveAuth();
  if (auth.kind !== "oauth" || !auth.authClient) {
    console.error("This script needs OAuth. Run `npm run auth`, then re-run this script.");
    process.exit(1);
  }

  const analyticsadmin = google.analyticsadmin({ version: "v1beta", auth: auth.authClient as never });
  const parent = `properties/${PROPERTY_ID}`;

  console.log(`\nGA4 setup — ${parent}${DRY_RUN ? " (dry run — no changes will be made)" : ""}\n`);

  // ---------- custom dimensions ----------
  const existing = await analyticsadmin.properties.customDimensions.list({ parent, pageSize: 200 });
  const existingNames = new Set((existing.data.customDimensions ?? []).map((d) => d.parameterName));

  const dimRows: string[][] = [];
  for (const dim of CUSTOM_DIMENSIONS) {
    if (existingNames.has(dim.parameterName)) {
      dimRows.push([dim.parameterName, "already registered"]);
      continue;
    }
    if (DRY_RUN) {
      dimRows.push([dim.parameterName, "would create"]);
      continue;
    }
    try {
      await analyticsadmin.properties.customDimensions.create({
        parent,
        requestBody: {
          parameterName: dim.parameterName,
          displayName: dim.displayName,
          description: dim.description,
          scope: "EVENT",
        },
      });
      dimRows.push([dim.parameterName, "created"]);
    } catch (e) {
      dimRows.push([dim.parameterName, `ERROR: ${errMsg(e)}`]);
    }
  }
  console.log(table(["custom dimension", "result"], dimRows, ["l", "l"]));

  // ---------- key events ----------
  const existingKeyEvents = await analyticsadmin.properties.keyEvents.list({ parent, pageSize: 200 });
  const existingKeyNames = new Set((existingKeyEvents.data.keyEvents ?? []).map((k) => k.eventName));

  const keyRows: string[][] = [];
  for (const name of KEY_EVENTS) {
    if (existingKeyNames.has(name)) {
      keyRows.push([name, "already a key event"]);
      continue;
    }
    if (DRY_RUN) {
      keyRows.push([name, "would mark as key event"]);
      continue;
    }
    try {
      await analyticsadmin.properties.keyEvents.create({
        parent,
        requestBody: { eventName: name, countingMethod: "ONCE_PER_EVENT" },
      });
      keyRows.push([name, "marked as key event"]);
    } catch (e) {
      keyRows.push([name, `ERROR: ${errMsg(e)}`]);
    }
  }
  console.log("\n" + table(["event", "result"], keyRows, ["l", "l"]));

  // ---------- data retention ----------
  // GA4 defaults Explore's lookback to 2 months; bumping to 14 (the max on a
  // standard property) is what lets the funnel/path/free-form explorations
  // below actually cover more than the last 8 weeks. Reports (not Explore)
  // are unaffected either way. Only exposed on the v1alpha surface.
  const analyticsadminAlpha = google.analyticsadmin({ version: "v1alpha", auth: auth.authClient as never });
  const retentionName = `${parent}/dataRetentionSettings`;
  const retentionRows: string[][] = [];
  try {
    const current = await analyticsadminAlpha.properties.getDataRetentionSettings({ name: retentionName });
    if (current.data.eventDataRetention === "FOURTEEN_MONTHS") {
      retentionRows.push(["event + user data retention", "already 14 months"]);
    } else if (DRY_RUN) {
      retentionRows.push([
        `event + user data retention (currently ${current.data.eventDataRetention})`,
        "would extend to 14 months",
      ]);
    } else {
      await analyticsadminAlpha.properties.updateDataRetentionSettings({
        name: retentionName,
        updateMask: "event_data_retention,user_data_retention",
        requestBody: { eventDataRetention: "FOURTEEN_MONTHS", userDataRetention: "FOURTEEN_MONTHS" },
      });
      retentionRows.push([`event + user data retention (was ${current.data.eventDataRetention})`, "extended to 14 months"]);
    }
  } catch (e) {
    retentionRows.push(["event + user data retention", `ERROR: ${errMsg(e)}`]);
  }
  console.log("\n" + table(["setting", "result"], retentionRows, ["l", "l"]));

  console.log(
    "\n" +
      bullet([
        "Custom dimensions can take a few hours before they show up in Explore's dimension picker.",
        "Key events only show nonzero counts once real trackEvent(...) hits come in.",
        "GA4 Explorations (funnels, path exploration, free-form reports) have no public API — those still need to be built by hand in the GA4 UI.",
      ])
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
