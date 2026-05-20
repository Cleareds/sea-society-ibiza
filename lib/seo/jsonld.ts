import type { Boat, Faq, Settings } from "@/lib/data/types";
import { absoluteUrl, SITE_NAME } from "./metadata";

export function organizationLd(settings: Settings) {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/og/logo.png"),
    sameAs: settings.instagramUrl ? [settings.instagramUrl] : undefined,
    email: settings.email,
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Botafoc Marina",
      addressLocality: "Ibiza Town",
      postalCode: "07800",
      addressRegion: "Balearic Islands",
      addressCountry: "ES",
    },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/fleet")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function boatProductLd(boat: Boat) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: boat.name,
    description: boat.description,
    brand: { "@type": "Brand", name: boat.brand },
    image: [boat.heroImage, ...boat.gallery.map((g) => g.src)],
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/fleet/${boat.slug}`),
      priceCurrency: boat.currency,
      price: boat.priceFrom,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };
}

export function fleetItemListLd(boats: Boat[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: boats.map((b, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: absoluteUrl(`/fleet/${b.slug}`),
      name: b.name,
    })),
  };
}

export function faqPageLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
