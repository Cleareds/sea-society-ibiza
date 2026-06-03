import type { Metadata } from "next";
import { defaultLocale, locales, localePath, type Locale } from "@/lib/i18n/config";

export const SITE_NAME = "Sea Society Ibiza";
export const SITE_TAGLINE = "Luxury Yacht Charter";

const OG_LOCALE_MAP: Record<Locale, string> = {
  en: "en_GB",
  es: "es_ES",
  fr: "fr_FR",
  nl: "nl_NL",
};

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://seasocietyibiza.com";
}

export function absoluteUrl(path = "/") {
  const base = siteUrl().replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

interface PageMetaInput {
  title: string;
  description: string;
  /** Path relative to a locale root, e.g. "/fleet/pershing-54". Leading `/`. */
  path: string;
  image?: string;
  noIndex?: boolean;
  locale?: Locale;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex,
  locale = defaultLocale,
}: PageMetaInput): Metadata {
  // Canonical = this locale's version of the page
  const canonical = localePath(locale, path);
  const url = absoluteUrl(canonical);
  const ogImage = image ?? absoluteUrl(`/api/og?title=${encodeURIComponent(title)}`);

  // hreflang map: every supported locale + an x-default pointing at EN
  const languages: Record<string, string> = {};
  for (const lc of locales) {
    languages[lc] = localePath(lc, path);
  }
  languages["x-default"] = localePath(defaultLocale, path);

  return {
    title,
    description,
    alternates: { canonical, languages },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: OG_LOCALE_MAP[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE_MAP[l]),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
