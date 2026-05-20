import type { Boat, BoatType, Destination, EnquiryInput, Experience, Faq, Settings } from "../types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Row shapes (snake_case as stored in Supabase).
interface BoatRow {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  long_description: string | null;
  length_m: number | null;
  guests: number | null;
  cabins: number | null;
  type: BoatType | null;
  brand: string | null;
  build_year: number | null;
  price_from: number | null;
  currency: string | null;
  what_included: string[] | null;
  specs: Array<{ label: string; value: string }> | null;
  gallery: Array<{ src: string; alt: string }> | null;
  hero_image: string | null;
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
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    longDescription: row.long_description ?? "",
    lengthM: Number(row.length_m ?? 0),
    guests: row.guests ?? 0,
    cabins: row.cabins,
    type: (row.type ?? "motor_yacht") as BoatType,
    brand: row.brand ?? "",
    buildYear: row.build_year ?? 0,
    priceFrom: row.price_from ?? 0,
    currency: (row.currency ?? "EUR") as "EUR",
    whatIncluded: row.what_included ?? [],
    specs: row.specs ?? [],
    gallery: row.gallery ?? [],
    heroImage: row.hero_image ?? "",
    pdfUrl: row.pdf_url,
    featured: row.featured,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    metaTitle: row.meta_title ?? row.name,
    metaDescription: row.meta_description ?? row.tagline ?? "",
  };
}

export async function getBoats(): Promise<Boat[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("boats")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapBoat);
}

export async function getBoatBySlug(slug: string): Promise<Boat | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("boats")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw error;
  return data ? mapBoat(data) : null;
}

export async function getFeaturedBoats(limit = 6): Promise<Boat[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("boats")
    .select("*")
    .eq("is_published", true)
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapBoat);
}

export async function getExperiences(): Promise<Experience[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    intro: r.intro ?? "",
    body: r.body ?? "",
    heroImage: r.hero_image ?? "",
    sortOrder: r.sort_order,
    isPublished: r.is_published,
  }));
}

export async function getDestinations(): Promise<Destination[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("is_published", true);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    intro: r.intro ?? "",
    body: r.body ?? "",
    heroImage: r.hero_image ?? "",
    gallery: r.gallery ?? [],
    highlights: r.highlights ?? [],
    isPublished: r.is_published,
  }));
}

export async function getFaqs(): Promise<Faq[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
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
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
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
