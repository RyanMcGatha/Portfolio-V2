import type { MetadataRoute } from "next";
import { projects } from "./projects/data";

const baseUrl = "https://ryanm.info";

const lastModified = new Date("2026-05-14T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
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
  ];
}
