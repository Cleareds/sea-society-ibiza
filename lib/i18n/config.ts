/**
 * Single source of truth for the site's supported locales.
 *
 * English is canonical: served at the root paths (no `/en` prefix in the URL),
 * stored unprefixed in every content table, and the fallback when a translation
 * is missing for another locale.
 */
// Locale set narrowed to English-only for launch. The [locale] segment
// folder structure is kept (avoids a churn-heavy route restructure
// 30 hours before launch), but only "en" is registered — so
// generateStaticParams produces a single page per route instead of 5,
// the sitemap shrinks 5x, and the [locale] serverless function bundle
// drops below Vercel's 300 MB ceiling.
//
// Re-add a locale to this array to bring it back; all routing,
// middleware and language switcher logic is already wired.
export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/**
 * Strip a leading locale segment from a pathname. Returns the un-prefixed path
 * (root if the path is just `/{locale}`).
 *
 *   stripLocale("/nl/fleet/pershing-54")  -> "/fleet/pershing-54"
 *   stripLocale("/fr")                    -> "/"
 *   stripLocale("/fleet")                 -> "/fleet"
 */
export function stripLocale(pathname: string): string {
  const m = pathname.match(/^\/([a-z]{2})(?:\/(.*))?$/);
  if (m && m[1] && isLocale(m[1])) {
    return "/" + (m[2] ?? "");
  }
  return pathname;
}

/**
 * Build a path under a specific locale. The default locale gets no prefix.
 *
 *   localePath("en", "/fleet")          -> "/fleet"
 *   localePath("nl", "/fleet")          -> "/nl/fleet"
 *   localePath("nl", "/")               -> "/nl"
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean === "/" ? "/" : clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}
