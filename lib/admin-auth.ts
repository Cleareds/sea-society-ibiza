/**
 * Shared admin authentication check for API routes under /api/admin.
 *
 * Returns null on success (request is from an authenticated admin),
 * or a NextResponse with the appropriate 401/403 to short-circuit
 * the handler.
 *
 * The middleware (proxy.ts) gates the /admin UI but does NOT cover
 * /api/admin/* — each route must check itself.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "./supabase/server";

const ADMIN_EMAILS = () =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

/**
 * Boolean admin check usable from public server components — used to decide
 * whether to reveal unpublished content (e.g. draft blog posts) on the live
 * site. True for an authenticated whitelisted admin, or (non-production only)
 * the dev-mock cookie. Never throws.
 */
export async function isAdminView(): Promise<boolean> {
  try {
    if (process.env.NODE_ENV !== "production") {
      const c = await cookies();
      if (c.get("ssi-dev-admin")?.value === "1") return true;
    }
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const email = data.user?.email?.toLowerCase();
    if (!email) return false;
    const allowed = ADMIN_EMAILS();
    return allowed.length === 0 || allowed.includes(email);
  } catch {
    return false;
  }
}

export async function requireAdminRequest(): Promise<NextResponse | null> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  const email = auth.user?.email?.toLowerCase();
  if (!email) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const allowed = ADMIN_EMAILS();
  if (allowed.length > 0 && !allowed.includes(email)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  return null;
}
