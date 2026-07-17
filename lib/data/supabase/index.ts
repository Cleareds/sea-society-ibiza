import type { Boat, BoatType, Destination, EnquiryInput, Experience, ExperienceBlockStored, Faq, PageSeoRecord, Settings, Testimonial } from "../types";
import type { Locale } from "@/lib/i18n/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseStaticClient } from "@/lib/supabase/static";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { resolveBlocks } from "@/lib/experiences/blocks";

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
  content: ExperienceBlockStored[] | null;
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
  i18n: Partial<Record<string, Partial<{ question: string; answer: string }>>> | null;
}

interface SettingsRow {
  id: number;
  whatsapp_number: string | null;
  whatsapp_default_message: string | null;
  instagram_url: string | null;
  instagram_handle: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  google_rating: number | null;
  google_review_count: number | null;
  google_reviews_url: string | null;
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
  /** Locale-keyed translations. Each locale key holds partial overrides;
   *  fields not present fall back to the English columns above. */
  i18n: Partial<Record<string, Partial<{
    name: string;
    model_name: string;
    tagline: string;
    description: string;
    long_description: string;
    what_included: string[];
    specs: Array<{ label: string; value: string }>;
    highlights: Array<{ icon: string; label: string; value: string }>;
    gallery: Array<{ src: string; alt: string }>;
    meta_title: string;
    meta_description: string;
    base_harbour: string;
  }>>> | null;
}

function mapBoat(row: BoatRow, locale: Locale = "en"): Boat {
  const t = locale !== "en" ? row.i18n?.[locale] : undefined;
  return {
    id: row.id,
    slug: row.slug,
    // Names + model numbers are proper nouns; locale doesn't change them.
    name: t?.name ?? row.name,
    modelName: t?.model_name ?? row.model_name ?? undefined,
    tagline: t?.tagline ?? row.tagline ?? "",
    description: t?.description ?? row.description ?? "",
    longDescription: t?.long_description ?? row.long_description ?? "",
    lengthM: Number(row.length_m ?? 0),
    beamM: row.beam_m == null ? undefined : Number(row.beam_m),
    guests: row.guests ?? 0,
    guestsNight: row.guests_night ?? undefined,
    cabins: row.cabins,
    type: (row.type ?? "motor_yacht") as BoatType,
    brand: row.brand ?? "",
    buildYear: row.build_year ?? 0,
    refitYear: row.refit_year ?? undefined,
    baseHarbour: t?.base_harbour ?? row.base_harbour ?? undefined,
    cruiseKnots: row.cruise_knots ?? undefined,
    maxKnots: row.max_knots ?? undefined,
    engines: row.engines ?? undefined,
    stabilizers: row.stabilizers ?? undefined,
    consumption: row.consumption ?? undefined,
    priceFrom: row.price_from ?? 0,
    priceHigh: row.price_high ?? undefined,
    currency: (row.currency ?? "EUR") as "EUR",
    whatIncluded: t?.what_included ?? row.what_included ?? [],
    specs: t?.specs ?? row.specs ?? [],
    gallery: t?.gallery ?? row.gallery ?? [],
    highlights: (t?.highlights ?? row.highlights ?? []) as Boat["highlights"],
    heroImage: row.hero_image ?? "",
    cardImage: row.card_image ?? undefined,
    pdfUrl: row.pdf_url,
    featured: row.featured,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    metaTitle: t?.meta_title ?? row.meta_title ?? row.name,
    metaDescription: t?.meta_description ?? row.meta_description ?? row.tagline ?? "",
  };
}

export async function getBoats(locale: Locale = "en"): Promise<Boat[]> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("boats")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .returns<BoatRow[]>();
  if (error) throw error;
  return (data ?? []).map((r) => mapBoat(r, locale));
}

export async function getBoatBySlug(
  slug: string,
  locale: Locale = "en",
): Promise<Boat | null> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("boats")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .returns<BoatRow[]>()
    .maybeSingle();
  if (error) throw error;
  return data ? mapBoat(data, locale) : null;
}

export async function getFeaturedBoats(
  limit = 6,
  locale: Locale = "en",
): Promise<Boat[]> {
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
  return (data ?? []).map((r) => mapBoat(r, locale));
}

function mapExperience(r: ExperienceRow, locale: Locale = "en"): Experience {
  type ExpI18n = Partial<{
    title: string;
    intro: string;
    body: string;
    long_description: string;
    meta_title: string;
    meta_description: string;
    gallery: Array<{ src: string; alt: string }>;
  }>;
  const i18n = (r as ExperienceRow & { i18n?: Partial<Record<string, ExpI18n>> }).i18n;
  const t: ExpI18n | undefined = locale !== "en" ? i18n?.[locale] : undefined;
  return {
    id: r.id,
    slug: r.slug,
    title: t?.title ?? r.title,
    intro: t?.intro ?? r.intro ?? "",
    body: t?.body ?? r.body ?? "",
    longDescription: t?.long_description ?? r.long_description ?? "",
    gallery: (t?.gallery ?? r.gallery ?? []).map((g) => ({ src: g.src, alt: g.alt })),
    duration: r.duration ?? undefined,
    groupSize: r.group_size ?? undefined,
    priceFrom: r.price_from ?? undefined,
    metaTitle: t?.meta_title ?? r.meta_title ?? undefined,
    metaDescription: t?.meta_description ?? r.meta_description ?? undefined,
    content: resolveBlocks(r.content, locale),
    heroImage: r.hero_image ?? "",
    sortOrder: r.sort_order,
    isPublished: r.is_published,
  };
}

/**
 * Published experiences (default), or all experiences incl. drafts when
 * `includeDrafts` is true. Drafts read via the service-role client — only
 * pass includeDrafts after an admin gate (see isAdminView).
 */
export async function getExperiences(locale: Locale = "en", includeDrafts = false): Promise<Experience[]> {
  const supabase = includeDrafts ? createSupabaseAdminClient() : createSupabaseStaticClient();
  let query = supabase.from("experiences").select("*").order("sort_order", { ascending: true });
  if (!includeDrafts) query = query.eq("is_published", true);
  const { data, error } = await query.returns<ExperienceRow[]>();
  if (error) throw error;
  return (data ?? []).map((r) => mapExperience(r, locale));
}

// Admin-only: service role so drafts are visible/editable in the admin.
export async function getAllExperiences(): Promise<Experience[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true })
    .returns<ExperienceRow[]>();
  if (error) throw error;
  return (data ?? []).map((r) => mapExperience(r));
}

// Admin-only: service role so a draft experience can be opened for editing.
export async function getExperienceById(id: string): Promise<Experience | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", id)
    .returns<ExperienceRow[]>()
    .maybeSingle();
  if (error) throw error;
  return data ? mapExperience(data) : null;
}

/** Admin-only: raw stored content blocks (all locales) for the block editor. */
export async function getExperienceContentRaw(id: string): Promise<ExperienceBlockStored[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("content")
    .eq("id", id)
    .returns<{ content: ExperienceBlockStored[] | null }[]>()
    .maybeSingle();
  if (error || !data) return [];
  return data.content ?? [];
}

export async function getExperienceBySlug(
  slug: string,
  locale: Locale = "en",
  includeDrafts = false,
): Promise<Experience | null> {
  const supabase = includeDrafts ? createSupabaseAdminClient() : createSupabaseStaticClient();
  let query = supabase.from("experiences").select("*").eq("slug", slug);
  if (!includeDrafts) query = query.eq("is_published", true);
  const { data, error } = await query.returns<ExperienceRow[]>().maybeSingle();
  if (error || !data) return null;
  return mapExperience(data, locale);
}

function mapDestination(r: DestinationRow, locale: Locale = "en"): Destination {
  type DestI18n = Partial<{
    title: string;
    intro: string;
    body: string;
    highlights: string[];
    gallery: Array<{ src: string; alt: string }>;
  }>;
  const i18n = (r as DestinationRow & { i18n?: Partial<Record<string, DestI18n>> }).i18n;
  const t: DestI18n | undefined = locale !== "en" ? i18n?.[locale] : undefined;
  return {
    id: r.id,
    slug: r.slug,
    title: t?.title ?? r.title,
    intro: t?.intro ?? r.intro ?? "",
    body: t?.body ?? r.body ?? "",
    heroImage: r.hero_image ?? "",
    gallery: t?.gallery ?? r.gallery ?? [],
    highlights: t?.highlights ?? r.highlights ?? [],
    isPublished: r.is_published,
  };
}

export async function getDestinations(locale: Locale = "en"): Promise<Destination[]> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("is_published", true)
    .returns<DestinationRow[]>();
  if (error) throw error;
  return (data ?? []).map((r) => mapDestination(r, locale));
}

export async function getAllDestinations(): Promise<Destination[]> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .returns<DestinationRow[]>();
  if (error) throw error;
  return (data ?? []).map((r) => mapDestination(r));
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

export async function getFaqs(locale: Locale = "en"): Promise<Faq[]> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .returns<FaqRow[]>();
  if (error) throw error;
  return (data ?? []).map((r) => {
    const t = locale !== "en" ? r.i18n?.[locale] : undefined;
    return {
      id: r.id,
      question: t?.question ?? r.question,
      answer: t?.answer ?? r.answer,
      category: r.category ?? "",
      sortOrder: r.sort_order,
      isPublished: r.is_published,
    };
  });
}

interface PageSeoRow {
  page_key: string;
  meta_title: string | null;
  meta_description: string | null;
  i18n: Partial<Record<string, { meta_title?: string; meta_description?: string }>> | null;
}

/**
 * Editable meta override for a top-level page. Returns only the fields that
 * are actually set (English column, or the locale's i18n override); the
 * caller falls back to the page's built-in copy.ts default for anything
 * missing. Returns null when there's no row / nothing set.
 */
export async function getPageSeo(
  pageKey: string,
  locale: Locale = "en",
): Promise<{ title?: string; description?: string } | null> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase
    .from("page_seo")
    .select("*")
    .eq("page_key", pageKey)
    .maybeSingle()
    .returns<PageSeoRow>();
  if (error || !data) return null;
  const t = locale !== "en" ? data.i18n?.[locale] : undefined;
  const title = (t?.meta_title ?? data.meta_title) || undefined;
  const description = (t?.meta_description ?? data.meta_description) || undefined;
  if (!title && !description) return null;
  return { title, description };
}

/** Raw page_seo rows keyed by page_key — for the admin editor to prefill. */
export async function getAllPageSeo(): Promise<Record<string, PageSeoRecord>> {
  const supabase = createSupabaseStaticClient();
  const { data, error } = await supabase.from("page_seo").select("*").returns<PageSeoRow[]>();
  if (error || !data) return {};
  const out: Record<string, PageSeoRecord> = {};
  for (const r of data) {
    out[r.page_key] = { metaTitle: r.meta_title, metaDescription: r.meta_description, i18n: r.i18n ?? {} };
  }
  return out;
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
      data.whatsapp_default_message ??
      "Hi Sea Society, I'd like to enquire about a charter.\nNumber of guests: \nDate(s): \nYacht type or budget: ",
    instagramUrl: data.instagram_url ?? "",
    instagramHandle: data.instagram_handle ?? "",
    facebookUrl: data.facebook_url ?? undefined,
    tiktokUrl: data.tiktok_url ?? undefined,
    googleRating: data.google_rating ?? undefined,
    googleReviewCount: data.google_review_count ?? undefined,
    googleReviewsUrl: data.google_reviews_url ?? undefined,
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
