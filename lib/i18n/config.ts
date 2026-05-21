/**
 * Single source of truth for the site's supported locales.
 *
 * English is canonical: served at the root paths (no `/en` prefix in the URL),
 * stored unprefixed in every content table, and the fallback when a translation
 * is missing for another locale.
 */
export const locales = ["en", "nl", "fr", "de", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  nl: "Nederlands",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  nl: "🇳🇱",
  fr: "🇫🇷",
  de: "🇩🇪",
  es: "🇪🇸",
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
