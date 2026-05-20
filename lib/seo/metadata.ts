import type { Metadata } from "next";

export const SITE_NAME = "Sea Society Ibiza";
export const SITE_TAGLINE = "Luxury Yacht Charter";

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
  path: string;
  image?: string;
  noIndex?: boolean;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? absoluteUrl(`/api/og?title=${encodeURIComponent(title)}`);
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: { en: path, "x-default": path },
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
