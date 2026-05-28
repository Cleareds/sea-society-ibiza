"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  authorizeUrl,
  oauthConfigured,
  refreshLongLivedToken,
  isoExpiryFromSeconds,
} from "@/lib/instagram-oauth";
import {
  clearInstagramConfig,
  getInstagramConfig,
  setInstagramConfig,
} from "@/lib/integrations";

const STATE_COOKIE = "ssi-ig-oauth-state";

// Gated server-side: Connect / Reconnect / Disconnect require a
// DEVELOPER_EMAILS match. Refresh is safe and stays open to any
// admin so the client can keep the token healthy without us.
async function requireDeveloper() {
  const allowed = (process.env.DEVELOPER_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (!email || !allowed.includes(email)) {
    redirect("/admin/integrations?status=error&detail=developer_only");
  }
}

export async function startInstagramConnect() {
  await requireDeveloper();
  if (!oauthConfigured()) {
    redirect("/admin/integrations?status=error&detail=oauth_env_missing");
  }
  const state = randomBytes(16).toString("hex");
  const jar = await cookies();
  jar.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/admin/instagram/callback",
    maxAge: 600,
  });
  redirect(authorizeUrl(state));
}

export async function refreshInstagramToken() {
  const cfg = await getInstagramConfig();
  if (!cfg?.accessToken) {
    redirect("/admin/integrations?status=error&detail=not_connected");
  }
  try {
    const next = await refreshLongLivedToken(cfg.accessToken);
    await setInstagramConfig({
      accessToken: next.access_token,
      expiresAt: isoExpiryFromSeconds(next.expires_in),
      refreshedAt: new Date().toISOString(),
    });
    revalidatePath("/admin/integrations");
    redirect("/admin/integrations?status=refreshed");
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error";
    redirect(`/admin/integrations?status=error&detail=${encodeURIComponent(msg)}`);
  }
}

export async function disconnectInstagram() {
  await requireDeveloper();
  await clearInstagramConfig();
  revalidatePath("/admin/integrations");
  revalidatePath("/");
  redirect("/admin/integrations?status=disconnected");
}
