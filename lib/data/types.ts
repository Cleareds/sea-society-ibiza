export type BoatType = "motor_yacht" | "sailing_yacht" | "catamaran" | "day_boat" | "sport_yacht";

export interface BoatSpec {
  label: string;
  value: string;
}

export interface BoatGalleryImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export type HighlightIcon =
  | "length"
  | "guests"
  | "cabins"
  | "speed"
  | "year"
  | "engine"
  | "bathrooms"
  | "anchor";

export interface BoatHighlight {
  icon: HighlightIcon;
  label: string;
  value: string;
}

export interface Boat {
  id: string;
  slug: string;
  name: string;
  modelName?: string;
  tagline: string;
  description: string;
  longDescription: string;
  lengthM: number;
  beamM?: number;
  guests: number;
  guestsNight?: number;
  cabins: number | null;
  type: BoatType;
  brand: string;
  buildYear: number;
  refitYear?: number;
  baseHarbour?: string;
  cruiseKnots?: number;
  maxKnots?: number;
  engines?: string;
  stabilizers?: string;
  consumption?: string;
  priceFrom: number;
  priceHigh?: number;
  currency: "EUR";
  whatIncluded: string[];
  highlights?: BoatHighlight[];
  specs: BoatSpec[];
  gallery: BoatGalleryImage[];
  heroImage: string;
  /** Optional override for list/tile contexts (homepage featured grid,
   *  /fleet card grid, related-boats block on detail pages). Falls back
   *  to heroImage when absent. Detail-page banners always use heroImage. */
  cardImage?: string;
  pdfUrl: string | null;
  featured: boolean;
  sortOrder: number;
  isPublished: boolean;
  metaTitle: string;
  metaDescription: string;
}

export interface Experience {
  id: string;
  slug: string;
  title: string;
  intro: string;
  body: string;
  longDescription: string;
  gallery: BoatGalleryImage[];
  duration?: string;
  groupSize?: string;
  priceFrom?: number;
  metaTitle?: string;
  metaDescription?: string;
  heroImage: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface Destination {
  id: string;
  slug: string;
  title: string;
  intro: string;
  body: string;
  heroImage: string;
  gallery: BoatGalleryImage[];
  highlights: string[];
  isPublished: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
}

export interface PageCopy {
  heroEyebrow: string;
  heroTitle: string;
  heroSub: string;
  body: string;
}

/**
 * Partial per-locale overrides keyed by Locale (excluding "en", which is
 * stored canonically in the row's top-level columns). Any missing field
 * on a locale falls back to the canonical English value at read time.
 */
export type I18nOverrides<T> = Partial<Record<string, Partial<T>>>;

export interface Settings {
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  instagramUrl: string;
  instagramHandle: string;
  /** Optional Facebook page URL — rendered in footer when present. */
  facebookUrl?: string;
  /** Optional TikTok profile URL — rendered in footer when present. */
  tiktokUrl?: string;
  email: string;
  phone: string;
  address: string;
  stats: Array<{ label: string; value: string }>;
  heroHeadline: string;
  heroSub: string;
  testimonials: Testimonial[];
  about: PageCopy;
  contact: PageCopy;
  /** Locale-keyed PageCopy overrides for /about and /contact. */
  aboutI18n: Partial<Record<string, Partial<PageCopy>>>;
  contactI18n: Partial<Record<string, Partial<PageCopy>>>;
  /** "Follow our society" tile-wall images. Editable from /admin/journey.
   *  Each entry is a public URL (Supabase Storage upload or /public path).
   *  Component falls back to the hardcoded defaults when this is empty. */
  journeyImages: Array<{ src: string }>;
}

export interface EnquiryInput {
  name: string;
  email: string;
  phone?: string;
  dates?: string;
  groupSize?: number;
  boatId?: string;
  boatName?: string;
  message?: string;
  sourcePage?: string;
  utm?: Record<string, string>;
}
