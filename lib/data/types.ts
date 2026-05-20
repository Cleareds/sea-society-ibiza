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

export interface Boat {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  lengthM: number;
  guests: number;
  cabins: number | null;
  type: BoatType;
  brand: string;
  buildYear: number;
  priceFrom: number;
  currency: "EUR";
  whatIncluded: string[];
  specs: BoatSpec[];
  gallery: BoatGalleryImage[];
  heroImage: string;
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

export interface Settings {
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  instagramUrl: string;
  instagramHandle: string;
  email: string;
  phone: string;
  address: string;
  stats: Array<{ label: string; value: string }>;
  heroHeadline: string;
  heroSub: string;
  testimonials: Testimonial[];
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
