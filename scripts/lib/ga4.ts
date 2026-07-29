/**
 * Google Analytics 4 section.
 *
 * GSC tells you how people find the site; this tells you what happens after they
 * land. Every query is isolated in its own try/catch so one unsupported metric
 * (properties differ in what they expose) can't blank the whole section.
 */

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import type { AuthResult } from "./auth";
import {
  bullet,
  delta,
  num,
  pctOf,
  sparkline,
  table,
  trunc,
  type Action,
  type SectionResult,
} from "./fmt";
import { errMsg } from "./util";

interface Cell {
  value?: string | null;
}

/**
 * The generated client types resolve `runReport` through overloads that TS can't
 * unwrap cleanly, so we describe the only shape we read.
 */
interface Ga4Row {
  dimensionValues?: Cell[] | null;
  metricValues?: Cell[] | null;
}
interface RunReportResponse {
  rows?: Ga4Row[] | null;
  rowCount?: number | null;
}

function dim(row: Ga4Row | undefined, i: number): string {
  return row?.dimensionValues?.[i]?.value ?? "";
}
function met(row: Ga4Row | undefined, i: number): number {
  const v = row?.metricValues?.[i]?.value;
  return v ? Number(v) : 0;
}

export async function ga4Section(auth: AuthResult, propertyId: string): Promise<SectionResult> {
  const client =
    auth.kind === "oauth"
      ? new BetaAnalyticsDataClient({ authClient: auth.authClient as never })
      : new BetaAnalyticsDataClient();

  const property = `properties/${propertyId}`;
  const CUR = { startDate: "28daysAgo", endDate: "today" };
  const PREV = { startDate: "56daysAgo", endDate: "29daysAgo" };

  const errors: string[] = [];
  const actions: Action[] = [];

  async function run(label: string, req: Record<string, unknown>): Promise<RunReportResponse | null> {
    try {
      const [res] = await client.runReport({ property, ...req } as never);
      return res as unknown as RunReportResponse;
    } catch (e) {
      errors.push(`${label}: ${errMsg(e)}`);
      return null;
    }
  }

  const OVERVIEW_METRICS = [
    "totalUsers",
    "newUsers",
    "sessions",
    "engagedSessions",
    "engagementRate",
    "averageSessionDuration",
    "screenPageViews",
    "bounceRate",
    "screenPageViewsPerSession",
    "sessionsPerUser",
  ].map((name) => ({ name }));

  const [
    overviewCur,
    overviewPrev,
    daily,
    monthly,
    pages,
    landing,
    organicLanding,
    channels,
    sourceMedium,
    campaigns,
    newReturning,
    geo,
    cities,
    devices,
    browsers,
    resolutions,
    events,
    eventsByPage,
    keyEvents,
    hours,
    weekdays,
  ] = await Promise.all([
    run("overview (current)", { dateRanges: [CUR], metrics: OVERVIEW_METRICS }),
    run("overview (previous)", { dateRanges: [PREV], metrics: OVERVIEW_METRICS }),
    run("daily", {
      dateRanges: [CUR],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "totalUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
      limit: 40,
    }),
    run("monthly", {
      dateRanges: [{ startDate: "365daysAgo", endDate: "today" }],
      dimensions: [{ name: "yearMonth" }],
      metrics: [
        { name: "totalUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "engagementRate" },
      ],
      orderBys: [{ dimension: { dimensionName: "yearMonth" } }],
      limit: 24,
    }),
    run("pages", {
      dateRanges: [CUR],
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "totalUsers" },
        { name: "userEngagementDuration" },
        { name: "bounceRate" },
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 40,
    }),
    run("landing pages", {
      dateRanges: [CUR],
      dimensions: [{ name: "landingPagePlusQueryString" }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "engagedSessions" },
        { name: "engagementRate" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
      ],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 30,
    }),
    run("organic landing pages", {
      dateRanges: [CUR],
      dimensions: [{ name: "landingPagePlusQueryString" }],
      metrics: [{ name: "sessions" }, { name: "engagedSessions" }, { name: "averageSessionDuration" }],
      dimensionFilter: {
        filter: {
          fieldName: "sessionDefaultChannelGroup",
          stringFilter: { matchType: "EXACT", value: "Organic Search" },
        },
      },
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 20,
    }),
    run("channels", {
      dateRanges: [CUR],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "engagedSessions" },
        { name: "engagementRate" },
        { name: "averageSessionDuration" },
      ],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 20,
    }),
    run("source/medium", {
      dateRanges: [CUR],
      dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
      metrics: [{ name: "sessions" }, { name: "engagedSessions" }, { name: "averageSessionDuration" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 25,
    }),
    run("campaigns", {
      dateRanges: [CUR],
      dimensions: [{ name: "sessionCampaignName" }],
      metrics: [{ name: "sessions" }, { name: "engagedSessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 15,
    }),
    run("new vs returning", {
      dateRanges: [CUR],
      dimensions: [{ name: "newVsReturning" }],
      metrics: [{ name: "totalUsers" }, { name: "sessions" }, { name: "engagementRate" }],
      limit: 5,
    }),
    run("countries", {
      dateRanges: [CUR],
      dimensions: [{ name: "country" }],
      metrics: [{ name: "totalUsers" }, { name: "sessions" }, { name: "engagementRate" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 20,
    }),
    run("cities", {
      dateRanges: [CUR],
      dimensions: [{ name: "city" }, { name: "region" }],
      metrics: [{ name: "totalUsers" }, { name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 20,
    }),
    run("devices", {
      dateRanges: [CUR],
      dimensions: [{ name: "deviceCategory" }],
      metrics: [
        { name: "totalUsers" },
        { name: "sessions" },
        { name: "engagementRate" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
      ],
      limit: 10,
    }),
    run("browsers", {
      dateRanges: [CUR],
      dimensions: [{ name: "browser" }, { name: "operatingSystem" }],
      metrics: [{ name: "totalUsers" }, { name: "sessions" }, { name: "engagementRate" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 15,
    }),
    run("screen resolutions", {
      dateRanges: [CUR],
      dimensions: [{ name: "screenResolution" }],
      metrics: [{ name: "totalUsers" }, { name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 12,
    }),
    run("events", {
      dateRanges: [CUR],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 25,
    }),
    run("events by page", {
      dateRanges: [CUR],
      dimensions: [{ name: "pagePath" }, { name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 40,
    }),
    run("key events", {
      dateRanges: [CUR],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "keyEvents" }],
      orderBys: [{ metric: { metricName: "keyEvents" }, desc: true }],
      limit: 15,
    }),
    run("hour of day", {
      dateRanges: [CUR],
      dimensions: [{ name: "hour" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ dimension: { dimensionName: "hour" } }],
      limit: 24,
    }),
    run("day of week", {
      dateRanges: [CUR],
      dimensions: [{ name: "dayOfWeekName" }],
      metrics: [{ name: "sessions" }, { name: "engagementRate" }],
      limit: 7,
    }),
  ]);

  const ovCur = overviewCur?.rows?.[0];
  const ovPrev = overviewPrev?.rows?.[0];
  const M = [
    "Users",
    "New users",
    "Sessions",
    "Engaged sessions",
    "Engagement rate",
    "Avg session duration",
    "Page views",
    "Bounce rate",
    "Pages per session",
    "Sessions per user",
  ];

  const overviewRows = M.map((label, i) => {
    const c = met(ovCur, i);
    const p = met(ovPrev, i);
    const isRate = label === "Engagement rate" || label === "Bounce rate";
    const isDur = label === "Avg session duration";
    const fmt = (v: number) => (isRate ? pctOf(v) : isDur ? `${v.toFixed(1)}s` : num(v, label.includes("per") ? 2 : 0));
    return [
      label,
      fmt(p),
      fmt(c),
      isRate
        ? delta(c * 100, p * 100, { digits: 1, suffix: "%", lowerIsBetter: label === "Bounce rate" })
        : delta(c, p, { digits: isDur || label.includes("per") ? 1 : 0, lowerIsBetter: false }),
    ];
  });

  const users = met(ovCur, 0);
  const sessions = met(ovCur, 2);
  const engagementRate = met(ovCur, 4);
  const pageViews = met(ovCur, 6);

  const dailyRows = daily?.rows ?? [];
  const dailyUsers = dailyRows.map((r) => met(r, 0));
  const dailySessions = dailyRows.map((r) => met(r, 1));

  const channelRows = (channels?.rows ?? []).map((r) => [
    dim(r, 0),
    num(met(r, 0)),
    num(met(r, 1)),
    num(met(r, 2)),
    pctOf(met(r, 3)),
    `${met(r, 4).toFixed(1)}s`,
    pctOf(sessions ? met(r, 0) / sessions : 0),
  ]);

  const directSessions = (channels?.rows ?? [])
    .filter((r) => /direct|unassigned/i.test(dim(r, 0)))
    .reduce((a, r) => a + met(r, 0), 0);
  const organicSessions = (channels?.rows ?? [])
    .filter((r) => /organic search/i.test(dim(r, 0)))
    .reduce((a, r) => a + met(r, 0), 0);

  // ---------- derived actions ----------
  if (sessions > 0 && directSessions / sessions > 0.5) {
    actions.push({
      severity: "medium",
      area: "Attribution",
      title: `${pctOf(directSessions / sessions)} of sessions are Direct/Unassigned — you can't tell what's working`,
      detail:
        "Direct is the bucket for untagged links (email signature, resume PDF, DMs, link-in-bio). Add UTM parameters to every link you place yourself, e.g. `?utm_source=linkedin&utm_medium=social&utm_campaign=profile`, so these resolve into real channels.",
    });
  }
  if (users > 0 && engagementRate < 0.4) {
    actions.push({
      severity: "high",
      area: "Engagement",
      title: `Engagement rate is ${pctOf(engagementRate)} — most visitors leave without interacting`,
      detail:
        "GA4 counts a session as engaged at 10s+, 2+ pageviews, or a key event. Fix the top of the homepage: state what you do and who it's for in the first screenful, and put one clear call-to-action above the fold.",
    });
  }

  const scrollEvents = (events?.rows ?? []).find((r) => dim(r, 0) === "scroll");
  if (scrollEvents && pageViews > 0 && met(scrollEvents, 0) / pageViews < 0.2) {
    actions.push({
      severity: "medium",
      area: "Engagement",
      title: `Only ${num(met(scrollEvents, 0))} scroll events across ${num(pageViews)} pageviews`,
      detail:
        "GA4's automatic `scroll` event fires at 90% page depth, so almost nobody reaches the bottom of your pages. Move your strongest proof (projects, results, CTA) higher up.",
    });
  }

  const keyEventTotal = (keyEvents?.rows ?? []).reduce((a, r) => a + met(r, 0), 0);
  if (keyEventTotal === 0) {
    actions.push({
      severity: "high",
      area: "Measurement",
      title: "No key events (conversions) recorded — you can't measure whether traffic turns into leads",
      detail:
        "In GA4 Admin → Events, mark a contact-form submit and outbound-click event as a key event. Then fire a custom event on successful contact submit so the report can show leads instead of just pageviews.",
    });
  }

  const deviceRows = (devices?.rows ?? []).map((r) => [
    dim(r, 0),
    num(met(r, 0)),
    num(met(r, 1)),
    pctOf(met(r, 2)),
    `${met(r, 3).toFixed(1)}s`,
    pctOf(met(r, 4)),
  ]);

  const mobile = (devices?.rows ?? []).find((r) => dim(r, 0) === "mobile");
  const desktop = (devices?.rows ?? []).find((r) => dim(r, 0) === "desktop");
  if (mobile && desktop && met(mobile, 2) - met(desktop, 2) > 0.15) {
    actions.push({
      severity: "low",
      area: "Audience",
      title: `Mobile engages far better than desktop (${pctOf(met(mobile, 2))} vs ${pctOf(met(desktop, 2))})`,
      detail:
        "Your best-engaging segment is also the one with the worst Lighthouse scores. Prioritize mobile performance fixes in the PageSpeed section — that's where the upside is.",
    });
  }

  const summary = [
    `**Users (28d):** ${delta(users, met(ovPrev, 0))}`,
    `**Sessions:** ${delta(sessions, met(ovPrev, 2))}`,
    `**Engagement rate:** ${delta(engagementRate * 100, met(ovPrev, 4) * 100, { digits: 1, suffix: "%" })}`,
    `**Organic search sessions:** ${num(organicSessions)} of ${num(sessions)} (${pctOf(sessions ? organicSessions / sessions : 0)})`,
    `**Key events (conversions):** ${num(keyEventTotal)}`,
  ];

  const body = [
    `### Window: last 28 days (vs previous 28 days)`,
    ``,
    `#### Overview, period over period`,
    table(["metric", "previous 28d", "current 28d", "change"], overviewRows, ["l", "r", "r", "l"]),
    ``,
    `#### Daily trend`,
    "```",
    `users    ${sparkline(dailyUsers)}  max ${Math.max(0, ...dailyUsers)}`,
    `sessions ${sparkline(dailySessions)}  max ${Math.max(0, ...dailySessions)}`,
    "```",
    table(
      ["date", "users", "sessions", "views"],
      dailyRows.slice(-14).map((r) => [dim(r, 0), num(met(r, 0)), num(met(r, 1)), num(met(r, 2))]),
      ["l", "r", "r", "r"]
    ),
    ``,
    `#### Monthly trend (12 months)`,
    table(
      ["month", "users", "sessions", "views", "engagement rate"],
      (monthly?.rows ?? []).map((r) => [
        dim(r, 0),
        num(met(r, 0)),
        num(met(r, 1)),
        num(met(r, 2)),
        pctOf(met(r, 3)),
      ]),
      ["l", "r", "r", "r", "r"]
    ),
    ``,
    `#### Channels (share of sessions)`,
    table(
      ["channel", "sessions", "users", "engaged", "engagement rate", "avg duration", "share"],
      channelRows,
      ["l", "r", "r", "r", "r", "r", "r"]
    ),
    ``,
    `#### Source / medium`,
    table(
      ["source", "medium", "sessions", "engaged", "avg duration"],
      (sourceMedium?.rows ?? []).map((r) => [
        dim(r, 0),
        dim(r, 1),
        num(met(r, 0)),
        num(met(r, 1)),
        `${met(r, 2).toFixed(1)}s`,
      ]),
      ["l", "l", "r", "r", "r"]
    ),
    ``,
    `#### Campaigns (UTM-tagged traffic)`,
    table(
      ["campaign", "sessions", "engaged"],
      (campaigns?.rows ?? []).map((r) => [dim(r, 0), num(met(r, 0)), num(met(r, 1))]),
      ["l", "r", "r"]
    ),
    ``,
    `#### Pages by views`,
    table(
      ["path", "title", "views", "users", "engagement time", "bounce"],
      (pages?.rows ?? []).map((r) => [
        dim(r, 0),
        trunc(dim(r, 1), 40),
        num(met(r, 0)),
        num(met(r, 1)),
        `${met(r, 2).toFixed(0)}s`,
        pctOf(met(r, 3)),
      ]),
      ["l", "l", "r", "r", "r", "r"]
    ),
    ``,
    `#### Landing pages — where sessions start (the pages SEO actually needs to win)`,
    table(
      ["landing page", "sessions", "users", "engaged", "engagement rate", "bounce", "avg duration"],
      (landing?.rows ?? []).map((r) => [
        trunc(dim(r, 0), 44),
        num(met(r, 0)),
        num(met(r, 1)),
        num(met(r, 2)),
        pctOf(met(r, 3)),
        pctOf(met(r, 4)),
        `${met(r, 5).toFixed(1)}s`,
      ]),
      ["l", "r", "r", "r", "r", "r", "r"]
    ),
    ``,
    `#### Landing pages — organic search only`,
    table(
      ["landing page", "sessions", "engaged", "avg duration"],
      (organicLanding?.rows ?? []).map((r) => [
        trunc(dim(r, 0), 44),
        num(met(r, 0)),
        num(met(r, 1)),
        `${met(r, 2).toFixed(1)}s`,
      ]),
      ["l", "r", "r", "r"]
    ),
    ``,
    `#### New vs returning`,
    table(
      ["type", "users", "sessions", "engagement rate"],
      (newReturning?.rows ?? []).map((r) => [
        dim(r, 0) || "(unknown)",
        num(met(r, 0)),
        num(met(r, 1)),
        pctOf(met(r, 2)),
      ]),
      ["l", "r", "r", "r"]
    ),
    ``,
    `#### Countries`,
    table(
      ["country", "users", "sessions", "engagement rate"],
      (geo?.rows ?? []).map((r) => [dim(r, 0), num(met(r, 0)), num(met(r, 1)), pctOf(met(r, 2))]),
      ["l", "r", "r", "r"]
    ),
    ``,
    `#### Cities`,
    table(
      ["city", "region", "users", "sessions"],
      (cities?.rows ?? []).map((r) => [dim(r, 0), dim(r, 1), num(met(r, 0)), num(met(r, 1))]),
      ["l", "l", "r", "r"]
    ),
    ``,
    `#### Devices`,
    table(
      ["device", "users", "sessions", "engagement rate", "avg duration", "bounce"],
      deviceRows,
      ["l", "r", "r", "r", "r", "r"]
    ),
    ``,
    `#### Browsers / OS`,
    table(
      ["browser", "os", "users", "sessions", "engagement rate"],
      (browsers?.rows ?? []).map((r) => [
        dim(r, 0),
        dim(r, 1),
        num(met(r, 0)),
        num(met(r, 1)),
        pctOf(met(r, 2)),
      ]),
      ["l", "l", "r", "r", "r"]
    ),
    ``,
    `#### Screen resolutions (what layouts to test)`,
    table(
      ["resolution", "users", "sessions"],
      (resolutions?.rows ?? []).map((r) => [dim(r, 0), num(met(r, 0)), num(met(r, 1))]),
      ["l", "r", "r"]
    ),
    ``,
    `#### Events`,
    table(
      ["event", "count", "users"],
      (events?.rows ?? []).map((r) => [dim(r, 0), num(met(r, 0)), num(met(r, 1))]),
      ["l", "r", "r"]
    ),
    ``,
    `#### Key events (conversions)`,
    table(
      ["event", "key events"],
      (keyEvents?.rows ?? []).filter((r) => met(r, 0) > 0).map((r) => [dim(r, 0), num(met(r, 0))]),
      ["l", "r"]
    ),
    ``,
    `#### Events by page`,
    table(
      ["path", "event", "count"],
      (eventsByPage?.rows ?? []).map((r) => [dim(r, 0), dim(r, 1), num(met(r, 0))]),
      ["l", "l", "r"]
    ),
    ``,
    `#### Sessions by day of week`,
    table(
      ["day", "sessions", "engagement rate"],
      (weekdays?.rows ?? []).map((r) => [dim(r, 0), num(met(r, 0)), pctOf(met(r, 1))]),
      ["l", "r", "r"]
    ),
    ``,
    `#### Sessions by hour (property timezone)`,
    "```",
    `${sparkline((hours?.rows ?? []).map((r) => met(r, 0)))}`,
    `00${" ".repeat(Math.max(0, (hours?.rows?.length ?? 24) - 6))}23`,
    "```",
    errors.length ? `\n_GA4 query errors:_\n${bullet(errors)}` : "",
  ].join("\n");

  return {
    heading: "Google Analytics 4",
    body,
    summary,
    actions,
    snapshot: {
      users,
      sessions,
      engagementRate,
      pageViews,
      bounceRate: met(ovCur, 7),
      organicSessions,
      directSessions,
      keyEvents: keyEventTotal,
    },
  };
}
