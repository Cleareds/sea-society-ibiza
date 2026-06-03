/**
 * Single source of truth for the site's supported locales.
 *
 * English is canonical: served at the root paths (no `/en` prefix in the URL),
 * stored unprefixed in every content table, and the fallback when a translation
 * is missing for another locale.
 */
// Site supports four locales: EN (default, no URL prefix), ES, FR, NL.
// All routing helpers below + the LocaleSwitcher in the header are
// driven from this array — to add another locale later, append it
// here, add its message bundle in lib/i18n/messages.ts, add an entry
// to OG_LOCALE_MAP in lib/seo/metadata.ts, populate boats.i18n /
// site_settings.about_i18n / etc. with translations, and add the
// inline locale-keyed copy in static pages (destinations / about /
// privacy / terms). See CLAUDE.md for the translation-parity rule.
export const locales = ["en", "es", "fr", "nl"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Short label used in the inline header switcher. */
export const localeLabels: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  fr: "FR",
  nl: "NL",
};

/** Long display label (used elsewhere if a wider control needs it). */
export const localeFullLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  nl: "Nederlands",
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
