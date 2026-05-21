import type { MetadataRoute } from "next";
import { getBoats } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo/metadata";
import { locales, localePath } from "@/lib/i18n/config";

/**
 * One sitemap entry per (page × locale). For each path we emit a single
 * entry per locale with hreflang `alternates.languages` pointing at every
 * locale variant — Google reads this as a single page with translations.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPaths: Array<{ path: string; freq: "weekly" | "monthly" | "yearly"; priority: number }> = [
    { path: "/", freq: "weekly", priority: 1.0 },
    { path: "/fleet", freq: "weekly", priority: 0.9 },
    { path: "/experiences", freq: "monthly", priority: 0.7 },
    { path: "/destinations", freq: "monthly", priority: 0.7 },
    { path: "/about", freq: "monthly", priority: 0.5 },
    { path: "/contact", freq: "monthly", priority: 0.7 },
    { path: "/privacy", freq: "yearly", priority: 0.2 },
    { path: "/terms", freq: "yearly", priority: 0.2 },
  ];

  const boats = await getBoats();
  const allPaths = [
    ...staticPaths,
    ...boats.map((b) => ({ path: `/fleet/${b.slug}`, freq: "weekly" as const, priority: 0.8 })),
  ];

  const out: MetadataRoute.Sitemap = [];
  for (const { path, freq, priority } of allPaths) {
    const languages: Record<string, string> = {};
    for (const lc of locales) languages[lc] = absoluteUrl(localePath(lc, path));
    for (const lc of locales) {
      out.push({
        url: absoluteUrl(localePath(lc, path)),
        lastModified: now,
        changeFrequency: freq,
        priority,
        alternates: { languages },
      });
    }
  }
  return out;
}
