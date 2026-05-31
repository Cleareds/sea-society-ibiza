import { getBoats } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo/metadata";
import { locales, localePath } from "@/lib/i18n/config";

/**
 * Custom sitemap route — replaces app/sitemap.ts. Switched to a route
 * handler so we can emit `<?xml-stylesheet?>` PI for human-readable
 * browser rendering via public/sitemap.xsl. Next's metadata-route
 * sitemap can't add PIs to its output.
 *
 * Output: hreflang alternates inside each <url> per Google's spec;
 * one <url> per (page × locale) pair so each translation has its
 * own canonical sitemap entry.
 */
export const revalidate = 3600;

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const now = new Date().toISOString();
  const staticPaths: Array<{ path: string; freq: string; priority: number }> = [
    { path: "/", freq: "weekly", priority: 1.0 },
    { path: "/fleet", freq: "weekly", priority: 0.9 },
    // Experiences hidden until launch — see app/robots.ts disallow + page noindex.
    // { path: "/experiences", freq: "monthly", priority: 0.7 },
    { path: "/destinations", freq: "monthly", priority: 0.7 },
    { path: "/about", freq: "monthly", priority: 0.5 },
    { path: "/contact", freq: "monthly", priority: 0.7 },
    { path: "/privacy", freq: "yearly", priority: 0.2 },
    { path: "/terms", freq: "yearly", priority: 0.2 },
  ];

  const boats = await getBoats();
  const allPaths = [
    ...staticPaths,
    ...boats.map((b) => ({ path: `/fleet/${b.slug}`, freq: "weekly", priority: 0.8 })),
  ];

  const urls: string[] = [];
  for (const { path, freq, priority } of allPaths) {
    const alternates = locales
      .map(
        (lc) =>
          `    <xhtml:link rel="alternate" hreflang="${lc}" href="${xmlEscape(absoluteUrl(localePath(lc, path)))}" />`,
      )
      .join("\n");
    for (const lc of locales) {
      const loc = xmlEscape(absoluteUrl(localePath(lc, path)));
      urls.push(
        [
          "  <url>",
          `    <loc>${loc}</loc>`,
          `    <lastmod>${now}</lastmod>`,
          `    <changefreq>${freq}</changefreq>`,
          `    <priority>${priority}</priority>`,
          alternates,
          "  </url>",
        ].join("\n"),
      );
    }
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls.join("\n"),
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
