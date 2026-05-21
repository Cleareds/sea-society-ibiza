"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

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

export async function saveBoat(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/boats?error=supabase_required");
  }
  const supabase = await createSupabaseServerClient();
  const id = (formData.get("id") as string) || null;
  const row = {
    slug: String(formData.get("slug") ?? ""),
    name: String(formData.get("name") ?? ""),
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

  if (id) {
    await supabase.from("boats").update(row).eq("id", id);
  } else {
    await supabase.from("boats").insert(row);
  }
  revalidatePath("/admin/boats");
  revalidatePath("/fleet");
  redirect("/admin/boats");
}
