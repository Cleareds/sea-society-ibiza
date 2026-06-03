"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  SaveBoatState,
  SavePageBlockState,
  SaveSettingsState,
  SaveJourneyImagesState,
} from "./actions-state";

const ADMIN_COOKIE = "ssi-dev-admin";

export async function devMockSignIn() {
  if (process.env.NODE_ENV === "production") {
    redirect("/admin/login?error=mock_disabled");
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export async function signInWithPassword(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?error=supabase_not_configured");
  }
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) redirect("/admin/login?error=credentials_required");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  redirect("/admin");
}

export async function sendMagicLink(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?error=supabase_not_configured");
  }
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) redirect("/admin/login?error=email_required");

  const supabase = await createSupabaseServerClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/admin` },
  });
  if (error) redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  redirect("/admin/login?sent=1");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
  redirect("/admin/login");
}

export async function markEnquiryHandled(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const id = String(formData.get("id") ?? "");
  const handled = formData.get("handled") === "true";
  const supabase = await createSupabaseServerClient();
  await supabase.from("enquiries").update({ handled }).eq("id", id);
  revalidatePath("/admin/enquiries");
}

export async function toggleBoatPublished(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const id = String(formData.get("id") ?? "");
  const next = formData.get("next") === "true";
  const supabase = await createSupabaseServerClient();
  await supabase.from("boats").update({ is_published: next }).eq("id", id);
  revalidatePath("/admin/boats");
  revalidatePath("/fleet");
  revalidatePath("/");
}

// ---------- Experiences ----------

interface PageBlockRow {
  slug: string;
  title: string;
  intro: string | null;
  body: string | null;
  hero_image: string | null;
  is_published: boolean;
  sort_order: number;
}

function readPageBlock(formData: FormData): PageBlockRow {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    intro: String(formData.get("intro") ?? "") || null,
    body: String(formData.get("body") ?? "") || null,
    hero_image: String(formData.get("heroImage") ?? "") || null,
    is_published: formData.get("isPublished") === "on",
    sort_order: Number(formData.get("sortOrder") ?? 0) || 0,
  };
}

async function savePageBlock(
  table: "experiences" | "destinations",
  publicPath: string,
  extra: Record<string, unknown> | undefined,
  prev: SavePageBlockState,
  formData: FormData,
): Promise<SavePageBlockState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Supabase is not configured." };
  }
  const id = (formData.get("id") as string) || null;
  const row: Record<string, unknown> = { ...readPageBlock(formData), ...(extra ?? {}) };
  if (!row.slug || !row.title) {
    return { status: "error", message: "Title and slug are required." };
  }
  const supabase = await createSupabaseServerClient();
  if (id) {
    const { error } = await supabase.from(table).update(row).eq("id", id);
    if (error) return { status: "error", message: error.message };
  } else {
    const { data, error } = await supabase
      .from(table)
      .insert(row)
      .select("id")
      .single();
    if (error) return { status: "error", message: error.message };
    return {
      status: "ok",
      message: `Created ${row.title as string}.`,
      savedAt: Date.now(),
      id: (data?.id as string) ?? null,
    };
  }
  revalidatePath(`/admin/${table}`);
  revalidatePath(publicPath);
  revalidatePath("/");
  void prev;
  return {
    status: "ok",
    message: `Saved changes to ${row.title as string}.`,
    savedAt: Date.now(),
    id,
  };
}

export async function saveExperience(
  prev: SavePageBlockState,
  formData: FormData,
): Promise<SavePageBlockState> {
  const longDescription = String(formData.get("longDescription") ?? "");
  const duration = String(formData.get("duration") ?? "").trim();
  const groupSize = String(formData.get("groupSize") ?? "").trim();
  const priceFromRaw = String(formData.get("priceFrom") ?? "").trim();
  const metaTitle = String(formData.get("metaTitle") ?? "").trim();
  const metaDescription = String(formData.get("metaDescription") ?? "").trim();
  const galleryRaw = String(formData.get("gallery") ?? "").trim();

  // Gallery is a textarea, one image per line as `path :: alt-text`.
  // Lines without `::` are accepted with empty alt — keeps the editor
  // forgiving while letting power users supply alt text.
  const gallery = galleryRaw
    ? galleryRaw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [src, ...rest] = line.split("::");
          return { src: (src ?? "").trim(), alt: rest.join("::").trim() };
        })
        .filter((g) => g.src)
    : [];

  return savePageBlock(
    "experiences",
    "/experiences",
    {
      long_description: longDescription || null,
      duration: duration || null,
      group_size: groupSize || null,
      price_from: priceFromRaw ? Number(priceFromRaw) : null,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      gallery,
    },
    prev,
    formData,
  );
}

export async function deleteExperience(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();
  await supabase.from("experiences").delete().eq("id", id);
  revalidatePath("/admin/experiences");
  revalidatePath("/experiences");
  redirect("/admin/experiences");
}

export async function toggleExperiencePublished(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const id = String(formData.get("id") ?? "");
  const next = formData.get("next") === "true";
  const supabase = await createSupabaseServerClient();
  await supabase.from("experiences").update({ is_published: next }).eq("id", id);
  revalidatePath("/admin/experiences");
  revalidatePath("/experiences");
}

// ---------- Destinations ----------

export async function saveDestination(
  prev: SavePageBlockState,
  formData: FormData,
): Promise<SavePageBlockState> {
  // Highlights come in as a newline-separated text field
  const highlightsRaw = String(formData.get("highlights") ?? "");
  const highlights = highlightsRaw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  return savePageBlock("destinations", "/destinations", { highlights }, prev, formData);
}

export async function deleteDestination(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();
  await supabase.from("destinations").delete().eq("id", id);
  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  redirect("/admin/destinations");
}

export async function toggleDestinationPublished(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const id = String(formData.get("id") ?? "");
  const next = formData.get("next") === "true";
  const supabase = await createSupabaseServerClient();
  await supabase.from("destinations").update({ is_published: next }).eq("id", id);
  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
}

// ---------- Site settings + page copy (About / Contact) ----------

// Locales that get an override block. Mirrors lib/i18n/config (kept inline so
// this "use server" file has no JSON/object exports beyond async functions).
const OVERRIDE_LOCALES = ["nl", "fr", "de", "es"] as const;

function readCopy(formData: FormData, prefix: string) {
  return {
    heroEyebrow: String(formData.get(`${prefix}Eyebrow`) ?? ""),
    heroTitle: String(formData.get(`${prefix}Title`) ?? ""),
    heroSub: String(formData.get(`${prefix}Sub`) ?? ""),
    body: String(formData.get(`${prefix}Body`) ?? ""),
  };
}

function readI18nOverrides(formData: FormData, basePrefix: "about" | "contact") {
  const out: Record<string, Record<string, string>> = {};
  for (const lc of OVERRIDE_LOCALES) {
    const localePrefix = `${basePrefix}_${lc}`;
    const block = readCopy(formData, localePrefix);
    // Persist only locales that have at least one non-empty field so the
    // public page's mergeI18n() correctly falls back to EN otherwise.
    if (Object.values(block).some((v) => v && v.trim().length > 0)) {
      out[lc] = block;
    }
  }
  return out;
}

export async function saveSettings(
  _prev: SaveSettingsState,
  formData: FormData,
): Promise<SaveSettingsState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Supabase is not configured." };
  }

  // Partial update — only touch columns whose form keys are actually
  // present. This means trimming the SettingsForm (e.g. dropping the
  // zombie About/Contact PageCopy sections) cannot silently null-out
  // the underlying DB columns: absent key → unchanged column.
  const row: Record<string, unknown> = {};
  const text = (key: string, col: string) => {
    if (formData.has(key)) row[col] = String(formData.get(key) ?? "") || null;
  };

  text("whatsappNumber", "whatsapp_number");
  text("whatsappDefaultMessage", "whatsapp_default_message");
  text("instagramUrl", "instagram_url");
  text("instagramHandle", "instagram_handle");
  text("facebookUrl", "facebook_url");
  text("tiktokUrl", "tiktok_url");
  text("email", "email");
  text("phone", "phone");
  text("address", "address");
  text("heroHeadline", "hero_headline");
  text("heroSub", "hero_sub");

  // Page-copy blocks: only re-write the JSON column if the form
  // includes the canonical EN field for that block. Otherwise the
  // existing column stays untouched.
  if (formData.has("aboutTitle")) row.about = readCopy(formData, "about");
  if (formData.has("contactTitle")) row.contact = readCopy(formData, "contact");
  if (formData.has("about_es" + "Title") || formData.has("about_fr" + "Title") || formData.has("about_nl" + "Title")) {
    row.about_i18n = readI18nOverrides(formData, "about");
  }
  if (formData.has("contact_es" + "Title") || formData.has("contact_fr" + "Title") || formData.has("contact_nl" + "Title")) {
    row.contact_i18n = readI18nOverrides(formData, "contact");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, ...row }, { onConflict: "id" });
  if (error) return { status: "error", message: error.message };
  revalidatePath("/admin/settings");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/");
  // Each locale variant of about/contact lives at its own URL — invalidate
  // them too so editors see translations immediately.
  for (const lc of OVERRIDE_LOCALES) {
    revalidatePath(`/${lc}/about`);
    revalidatePath(`/${lc}/contact`);
  }
  return { status: "ok", message: "Settings saved.", savedAt: Date.now() };
}

export async function saveJourneyImages(
  _prev: SaveJourneyImagesState,
  formData: FormData,
): Promise<SaveJourneyImagesState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Supabase is not configured." };
  }
  // 18 slots — empty strings are filtered out so admins can clear a
  // tile and the component falls back to its default for that index.
  const tiles: Array<{ src: string }> = [];
  for (let i = 0; i < 18; i++) {
    const src = String(formData.get(`tile_${i}`) ?? "").trim();
    if (src) tiles.push({ src });
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, journey_images: tiles }, { onConflict: "id" });
  if (error) return { status: "error", message: error.message };
  revalidatePath("/admin/journey");
  revalidatePath("/");
  revalidatePath("/about");
  return { status: "ok", message: "Journey tiles saved.", savedAt: Date.now() };
}

export async function deleteBoat(formData: FormData) {
  if (!isSupabaseConfigured()) return;
  const id = String(formData.get("id") ?? "");
  const supabase = await createSupabaseServerClient();
  await supabase.from("boats").delete().eq("id", id);
  revalidatePath("/admin/boats");
  revalidatePath("/fleet");
  redirect("/admin/boats");
}

export async function saveBoat(
  _prev: SaveBoatState,
  formData: FormData,
): Promise<SaveBoatState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Supabase is not configured." };
  }
  const supabase = await createSupabaseServerClient();
  const id = (formData.get("id") as string) || null;

  // Parse JSONB textareas defensively — a bad paste shouldn't wipe the
  // row, it should bounce back as an "error" state so the editor can fix it.
  let specsParsed: unknown = [];
  let highlightsParsed: unknown = [];
  let galleryParsed: unknown = [];
  try {
    specsParsed = JSON.parse(String(formData.get("specsRaw") ?? "[]") || "[]");
  } catch {
    return { status: "error", message: "Specs JSON is invalid — fix and resave." };
  }
  try {
    highlightsParsed = JSON.parse(String(formData.get("highlightsRaw") ?? "[]") || "[]");
  } catch {
    return { status: "error", message: "Highlights JSON is invalid — fix and resave." };
  }
  try {
    galleryParsed = JSON.parse(String(formData.get("gallery") ?? "[]") || "[]");
  } catch {
    return { status: "error", message: "Gallery payload is malformed — refresh and try again." };
  }

  const whatIncluded = String(formData.get("whatIncludedRaw") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const row = {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "") || null,
    description: String(formData.get("description") ?? "") || null,
    long_description: String(formData.get("longDescription") ?? "") || null,
    length_m: Number(formData.get("lengthM") ?? 0) || null,
    beam_m: Number(formData.get("beamM") ?? 0) || null,
    guests: Number(formData.get("guests") ?? 0) || null,
    guests_night: Number(formData.get("guestsNight") ?? 0) || null,
    cabins: Number(formData.get("cabins") ?? 0) || null,
    type: String(formData.get("type") ?? "motor_yacht"),
    brand: String(formData.get("brand") ?? "") || null,
    model_name: String(formData.get("modelName") ?? "") || null,
    base_harbour: String(formData.get("baseHarbour") ?? "") || null,
    build_year: Number(formData.get("buildYear") ?? 0) || null,
    refit_year: Number(formData.get("refitYear") ?? 0) || null,
    cruise_knots: Number(formData.get("cruiseKnots") ?? 0) || null,
    max_knots: Number(formData.get("maxKnots") ?? 0) || null,
    engines: String(formData.get("engines") ?? "") || null,
    consumption: String(formData.get("consumption") ?? "") || null,
    price_from: Number(formData.get("priceFrom") ?? 0) || null,
    price_high: Number(formData.get("priceHigh") ?? 0) || null,
    hero_image: String(formData.get("heroImage") ?? "") || null,
    what_included: whatIncluded,
    specs: specsParsed,
    highlights: highlightsParsed,
    gallery: galleryParsed,
    meta_title: String(formData.get("metaTitle") ?? "") || null,
    meta_description: String(formData.get("metaDescription") ?? "") || null,
    featured: formData.get("featured") === "on",
    is_published: formData.get("isPublished") === "on",
    sort_order: Number(formData.get("sortOrder") ?? 0) || 0,
  };

  if (!row.slug || !row.name) {
    return { status: "error", message: "Name and slug are required." };
  }

  if (id) {
    const { error } = await supabase.from("boats").update(row).eq("id", id);
    if (error) return { status: "error", message: error.message };
  } else {
    const { data, error } = await supabase
      .from("boats")
      .insert(row)
      .select("id")
      .single();
    if (error) return { status: "error", message: error.message };
    return {
      status: "ok",
      message: `Created ${row.name}.`,
      savedAt: Date.now(),
      boatId: (data?.id as string) ?? null,
    };
  }

  revalidatePath("/admin/boats");
  revalidatePath("/fleet");
  revalidatePath(`/fleet/${row.slug}`);
  revalidatePath("/");
  return {
    status: "ok",
    message: `Saved changes to ${row.name}.`,
    savedAt: Date.now(),
    boatId: id,
  };
}
