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
  Settings,
  Testimonial,
} from "./types";

export const getBoats = () => (supabaseEnabled() ? supa.getBoats() : dummy.getBoats());
export const getBoatBySlug = (slug: string) =>
  supabaseEnabled() ? supa.getBoatBySlug(slug) : dummy.getBoatBySlug(slug);
export const getFeaturedBoats = (limit?: number) =>
  supabaseEnabled() ? supa.getFeaturedBoats(limit) : dummy.getFeaturedBoats(limit);
export const getExperiences = () =>
  supabaseEnabled() ? supa.getExperiences() : dummy.getExperiences();
export const getDestinations = () =>
  supabaseEnabled() ? supa.getDestinations() : dummy.getDestinations();
export const getFaqs = () => (supabaseEnabled() ? supa.getFaqs() : dummy.getFaqs());
export const getSettings = () => (supabaseEnabled() ? supa.getSettings() : dummy.getSettings());
export const createEnquiry = (input: import("./types").EnquiryInput) =>
  supabaseEnabled() ? supa.createEnquiry(input) : dummy.createEnquiry(input);

export { addOns } from "./dummy";
