import type { MetadataRoute } from "next";
import { projects } from "./projects/data";

const baseUrl = "https://ryanm.info";

/**
 * Bump this whenever page content meaningfully changes. A stale lastmod tells
 * Google not to bother re-crawling, so it should move when the copy moves.
 */
const lastModified = new Date("2026-07-29T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    // Both service pages sit above /projects — they're the pages that need to
    // rank for the local service queries.
    {
      url: `${baseUrl}/web-development`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-services`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
