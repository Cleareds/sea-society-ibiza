"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  SaveBoatState,
  SavePageBlockState,
  SaveSettingsState,
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
  const row = {
    whatsapp_number: String(formData.get("whatsappNumber") ?? "") || null,
    whatsapp_default_message: String(formData.get("whatsappDefaultMessage") ?? "") || null,
    instagram_url: String(formData.get("instagramUrl") ?? "") || null,
    instagram_handle: String(formData.get("instagramHandle") ?? "") || null,
    email: String(formData.get("email") ?? "") || null,
    phone: String(formData.get("phone") ?? "") || null,
    address: String(formData.get("address") ?? "") || null,
    hero_headline: String(formData.get("heroHeadline") ?? "") || null,
    hero_sub: String(formData.get("heroSub") ?? "") || null,
    about: readCopy(formData, "about"),
    contact: readCopy(formData, "contact"),
    about_i18n: readI18nOverrides(formData, "about"),
    contact_i18n: readI18nOverrides(formData, "contact"),
  };
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
  const row = {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "") || null,
    description: String(formData.get("description") ?? "") || null,
    long_description: String(formData.get("longDescription") ?? "") || null,
    length_m: Number(formData.get("lengthM") ?? 0) || null,
    guests: Number(formData.get("guests") ?? 0) || null,
    cabins: Number(formData.get("cabins") ?? 0) || null,
    type: String(formData.get("type") ?? "motor_yacht"),
    brand: String(formData.get("brand") ?? "") || null,
    build_year: Number(formData.get("buildYear") ?? 0) || null,
    price_from: Number(formData.get("priceFrom") ?? 0) || null,
    hero_image: String(formData.get("heroImage") ?? "") || null,
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
