/**
 * Unified data-access layer.
 *
 * Reads from in-memory dummy data by default. Set `USE_SUPABASE=true` in the
 * environment and provide `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
 * to switch to live Supabase queries — no other code needs to change.
 *
 * Boats, experiences, destinations, faqs, settings: dummy & Supabase implementations.
 * Enquiries: write goes via /api/enquiries (file log in dummy mode, table insert
 * in Supabase mode).
 */
import * as dummy from "./dummy";
import * as supa from "./supabase";
import type { Locale } from "@/lib/i18n/config";

const supabaseEnabled = () => process.env.USE_SUPABASE === "true";

export type {
  Boat,
  BoatGalleryImage,
  BoatSpec,
  BoatType,
  Destination,
  EnquiryInput,
  Experience,
  Faq,
  PageCopy,
  Settings,
  Testimonial,
} from "./types";

export const getBoats = (locale: Locale = "en") =>
  supabaseEnabled() ? supa.getBoats(locale) : dummy.getBoats();
export const getBoatBySlug = (slug: string, locale: Locale = "en") =>
  supabaseEnabled() ? supa.getBoatBySlug(slug, locale) : dummy.getBoatBySlug(slug);
export const getFeaturedBoats = (limit?: number, locale: Locale = "en") =>
  supabaseEnabled() ? supa.getFeaturedBoats(limit, locale) : dummy.getFeaturedBoats(limit);
export const getExperiences = (locale: Locale = "en") =>
  supabaseEnabled() ? supa.getExperiences(locale) : dummy.getExperiences();
export const getAllExperiences = () =>
  supabaseEnabled() ? supa.getAllExperiences() : dummy.getAllExperiences();
export const getExperienceById = (id: string) =>
  supabaseEnabled() ? supa.getExperienceById(id) : dummy.getExperienceById(id);
export const getExperienceBySlug = (slug: string, locale: Locale = "en") =>
  supabaseEnabled() ? supa.getExperienceBySlug(slug, locale) : dummy.getExperienceBySlug(slug);
export const getDestinations = (locale: Locale = "en") =>
  supabaseEnabled() ? supa.getDestinations(locale) : dummy.getDestinations();
export const getAllDestinations = () =>
  supabaseEnabled() ? supa.getAllDestinations() : dummy.getAllDestinations();
export const getDestinationById = (id: string) =>
  supabaseEnabled() ? supa.getDestinationById(id) : dummy.getDestinationById(id);
export const getFaqs = () => (supabaseEnabled() ? supa.getFaqs() : dummy.getFaqs());
export const getPageSeo = (pageKey: string, locale: Locale = "en") =>
  supabaseEnabled() ? supa.getPageSeo(pageKey, locale) : dummy.getPageSeo();
export const getAllPageSeo = () =>
  supabaseEnabled() ? supa.getAllPageSeo() : dummy.getAllPageSeo();
export const getSettings = () => (supabaseEnabled() ? supa.getSettings() : dummy.getSettings());
export const createEnquiry = (input: import("./types").EnquiryInput) =>
  supabaseEnabled() ? supa.createEnquiry(input) : dummy.createEnquiry(input);

export { addOns } from "./dummy";
