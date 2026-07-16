import type { Boat, EnquiryInput, Experience, Destination, Faq, PageSeoRecord, Settings } from "../types";
import { boats } from "./boats";
import { experiences } from "./experiences";
import { destinations } from "./destinations";
import { faqs } from "./faqs";
import { settings } from "./settings";

export async function getBoats(): Promise<Boat[]> {
  return boats
    .filter((b) => b.isPublished)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getBoatBySlug(slug: string): Promise<Boat | null> {
  return boats.find((b) => b.slug === slug && b.isPublished) ?? null;
}

export async function getFeaturedBoats(limit = 6): Promise<Boat[]> {
  return boats
    .filter((b) => b.isPublished && b.featured)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, limit);
}

export async function getExperiences(): Promise<Experience[]> {
  return experiences.filter((e) => e.isPublished).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getAllExperiences(): Promise<Experience[]> {
  return experiences.slice().sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  return experiences.find((e) => e.id === id) ?? null;
}

export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  return experiences.find((e) => e.slug === slug && e.isPublished) ?? null;
}

export async function getDestinations(): Promise<Destination[]> {
  return destinations.filter((d) => d.isPublished);
}

export async function getAllDestinations(): Promise<Destination[]> {
  return destinations.slice();
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  return destinations.find((d) => d.id === id) ?? null;
}

export async function getFaqs(): Promise<Faq[]> {
  return faqs.filter((f) => f.isPublished).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getSettings(): Promise<Settings> {
  return settings;
}

/** Dummy mode has no page-SEO overrides — pages use their copy.ts defaults. */
export async function getPageSeo(): Promise<{ title?: string; description?: string } | null> {
  return null;
}

export async function getAllPageSeo(): Promise<Record<string, PageSeoRecord>> {
  return {};
}

export async function createEnquiry(input: EnquiryInput): Promise<void> {
  // Dummy mode: log to console. The /api/enquiries route also writes to a JSON
  // file when USE_SUPABASE=false; this keeps imports tree-shakeable on the client.
  if (typeof window === "undefined") {
    console.log("[dummy] enquiry received:", {
      ...input,
      receivedAt: new Date().toISOString(),
    });
  }
}

export { boats, experiences, destinations, faqs, settings };
export { addOns } from "./experiences";
