import type { MetadataRoute } from "next";

const baseUrl = "https://ryanm.info";

const lastModified = new Date("2026-05-05T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/ai-services`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
