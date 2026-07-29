import type { MetadataRoute } from "next";

// Explicit per-bot allow rules so search + AI crawlers are unambiguously
// welcome even if an edge/CDN layer (e.g. Cloudflare's managed robots.txt or
// "AI Crawl Control") ever injects its own directives in front of this file.
// If a rewrite is ever spotted in production, check the CDN dashboard first —
// this file is the source of truth on the origin.
const aiCrawlers = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "Bytespider",
  "CCBot",
  "Amazonbot",
  "meta-externalagent",
  "FacebookBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
    ],
    sitemap: "https://ryanm.info/sitemap.xml",
    host: "https://ryanm.info",
  };
}
