import type { Boat, BoatType, Destination, EnquiryInput, Experience, Faq, Settings, Testimonial } from "../types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseStaticClient } from "@/lib/supabase/static";

interface ExperienceRow {
  id: string;
  slug: string;
  title: string;
  intro: string | null;
  body: string | null;
  long_description: string | null;
  gallery: Array<{ src: string; alt: string }> | null;
  duration: string | null;
  group_size: string | null;
  price_from: number | null;
  meta_title: string | null;
  meta_description: string | null;
  hero_image: string | null;
  sort_order: number;
  is_published: boolean;
}

interface DestinationRow {
  id: string;
  slug: string;
  title: string;
  intro: string | null;
  body: string | null;
  hero_image: string | null;
  gallery: Array<{ src: string; alt: string }> | null;
  highlights: string[] | null;
  is_published: boolean;
}

interface FaqRow {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  is_published: boolean;
}

interface SettingsRow {
  id: number;
  whatsapp_number: string | null;
  whatsapp_default_message: string | null;
  instagram_url: string | null;
  instagram_handle: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  stats: Array<{ label: string; value: string }> | null;
  hero_headline: string | null;
  hero_sub: string | null;
  testimonials: Testimonial[] | null;
  about: import("../types").PageCopy | null;
  contact: import("../types").PageCopy | null;
  about_i18n: Partial<Record<string, Partial<import("../types").PageCopy>>> | null;
  contact_i18n: Partial<Record<string, Partial<import("../types").PageCopy>>> | null;
  journey_images: Array<{ src: string }> | null;
}

const emptyCopy = (): import("../types").PageCopy => ({
  heroEyebrow: "",
  heroTitle: "",
  heroSub: "",
  body: "",
});

// Row shapes (snake_case as stored in Supabase).
interface BoatRow {
  id: string;
  slug: string;
  name: string;
  model_name: string | null;
  tagline: string | null;
  description: string | null;
  long_description: string | null;
  length_m: number | null;
  beam_m: number | null;
  guests: number | null;
  guests_night: number | null;
  cabins: number | null;
  type: BoatType | null;
  brand: string | null;
  build_year: number | null;
  refit_year: number | null;
  base_harbour: string | null;
  cruise_knots: number | null;
  max_knots: number | null;
  engines: string | null;
  stabilizers: string | null;
  consumption: string | null;
  price_from: number | null;
  price_high: number | null;
  currency: string | null;
  what_included: string[] | null;
  specs: Array<{ label: string; value: string }> | null;
  gallery: Array<{ src: string; alt: string }> | null;
  highlights: Array<{ icon: string; label: string; value: string }> | null;
  hero_image: string | null;
  card_image: string | null;
  pdf_url: string | null;
  featured: boolean;
  sort_order: number;
  is_published: boolean;
  meta_title: string | null;
  meta_description: string | null;
}

function mapBoat(row: BoatRow): Boat {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    modelName: row.model_name ?? undefined,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    longDescription: row.long_description ?? "",
    lengthM: Number(row.length_m ?? 0),
    beamM: row.beam_m == null ? undefined : Number(row.beam_m),
    guests: row.guests ?? 0,
    guestsNight: row.guests_night ?? undefined,
    cabins: row.cabins,
    type: (row.type ?? "motor_yacht") as BoatType,
    brand: row.brand ?? "",
    buildYear: row.build_year ?? 0,
    refitYear: row.refit_year ?? undefined,
    baseHarbour: row.base_harbour ?? undefined,
    cruiseKnots: row.cruise_knots ?? undefined,
    maxKnots: row.max_knots ?? undefined,
    engines: row.engines ?? undefined,
    stabilizers: row.stabilizers ?? undefined,
    consumption: row.consumption ?? undefined,
    priceFrom: row.price_from ?? 0,
    priceHigh: row.price_high ?? undefined,
    currency: (row.currency ?? "EUR") as "EUR",
    whatIncluded: row.what_included ?? [],
    specs: row.specs ?? [],
    gallery: row.gallery ?? [],
    highlights: (row.highlights ?? []) as Boat["highlights"],
    heroImage: row.hero_image ?? "",
    cardImage: row.card_image ?? undefined,
    pdfUrl: row.pdf_url,
    featured: row.featured,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    metaTitle: row.meta_title ?? row.name,
    metaDescription: row.meta_description ?? row.tagline ?? "",
  };
}

export async function getBoats(): Promise<Boat[]> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("boats")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .returns<BoatRow[]>();
  if (error) throw error;
  return (data ?? []).map(mapBoat);
}

export async function getBoatBySlug(slug: string): Promise<Boat | null> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("boats")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .returns<BoatRow[]>()
    .maybeSingle();
  if (error) throw error;
  return data ? mapBoat(data) : null;
}

export async function getFeaturedBoats(limit = 6): Promise<Boat[]> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("boats")
    .select("*")
    .eq("is_published", true)
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit)
    .returns<BoatRow[]>();
  if (error) throw error;
  return (data ?? []).map(mapBoat);
}

function mapExperience(r: ExperienceRow): Experience {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    intro: r.intro ?? "",
    body: r.body ?? "",
    longDescription: r.long_description ?? "",
    gallery: (r.gallery ?? []).map((g) => ({ src: g.src, alt: g.alt })),
    duration: r.duration ?? undefined,
    groupSize: r.group_size ?? undefined,
    priceFrom: r.price_from ?? undefined,
    metaTitle: r.meta_title ?? undefined,
    metaDescription: r.meta_description ?? undefined,
    heroImage: r.hero_image ?? "",
    sortOrder: r.sort_order,
    isPublished: r.is_published,
  };
}

export async function getExperiences(): Promise<Experience[]> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .returns<ExperienceRow[]>();
  if (error) throw error;
  return (data ?? []).map(mapExperience);
}

export async function getAllExperiences(): Promise<Experience[]> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true })
    .returns<ExperienceRow[]>();
  if (error) throw error;
  return (data ?? []).map(mapExperience);
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", id)
    .returns<ExperienceRow[]>()
    .maybeSingle();
  if (error) throw error;
  return data ? mapExperience(data) : null;
}

export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .returns<ExperienceRow[]>()
    .maybeSingle();
  if (error) throw error;
  return data ? mapExperience(data) : null;
}

function mapDestination(r: DestinationRow): Destination {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    intro: r.intro ?? "",
    body: r.body ?? "",
    heroImage: r.hero_image ?? "",
    gallery: r.gallery ?? [],
    highlights: r.highlights ?? [],
    isPublished: r.is_published,
  };
}

export async function getDestinations(): Promise<Destination[]> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("is_published", true)
    .returns<DestinationRow[]>();
  if (error) throw error;
  return (data ?? []).map(mapDestination);
}

export async function getAllDestinations(): Promise<Destination[]> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .returns<DestinationRow[]>();
  if (error) throw error;
  return (data ?? []).map(mapDestination);
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("id", id)
    .returns<DestinationRow[]>()
    .maybeSingle();
  if (error) throw error;
  return data ? mapDestination(data) : null;
}

export async function getFaqs(): Promise<Faq[]> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .returns<FaqRow[]>();
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    question: r.question,
    answer: r.answer,
    category: r.category ?? "",
    sortOrder: r.sort_order,
    isPublished: r.is_published,
  }));
}

export async function getSettings(): Promise<Settings> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .returns<SettingsRow[]>()
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    // Fall back to dummy settings if the row hasn't been seeded yet.
    const { settings } = await import("../dummy/settings");
    return settings;
  }
  return {
    whatsappNumber: data.whatsapp_number ?? "",
    whatsappDefaultMessage:
      data.whatsapp_default_message ?? "Hi Sea Society, I'd like to enquire about a charter.",
    instagramUrl: data.instagram_url ?? "",
    instagramHandle: data.instagram_handle ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    address: data.address ?? "",
    stats: data.stats ?? [],
    heroHeadline: data.hero_headline ?? "",
    heroSub: data.hero_sub ?? "",
    testimonials: data.testimonials ?? [],
    about: { ...emptyCopy(), ...(data.about ?? {}) },
    contact: { ...emptyCopy(), ...(data.contact ?? {}) },
    aboutI18n: data.about_i18n ?? {},
    contactI18n: data.contact_i18n ?? {},
    journeyImages: data.journey_images ?? [],
  };
}

export async function createEnquiry(input: EnquiryInput): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("enquiries").insert({
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    dates: input.dates ?? null,
    group_size: input.groupSize ?? null,
    boat_id: input.boatId ?? null,
    message: input.message ?? null,
    source_page: input.sourcePage ?? null,
    utm: input.utm ?? null,
  });
  if (error) throw error;
}
