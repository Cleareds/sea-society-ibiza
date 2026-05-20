import type { MetadataRoute } from "next";
import { getBoats } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: absoluteUrl("/fleet"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/experiences"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/destinations"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const boats = await getBoats();
  const boatRoutes: MetadataRoute.Sitemap = boats.map((b) => ({
    url: absoluteUrl(`/fleet/${b.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...boatRoutes];
}
