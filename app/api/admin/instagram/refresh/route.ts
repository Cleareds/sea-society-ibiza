/**
 * Refresh the long-lived Instagram access token.
 *
 * Two ways to call this route:
 *   1. From the admin UI — authenticated admin user (cookie-based).
 *   2. From Vercel cron — call with `?secret=$CRON_SECRET` (the secret
 *      lives only in Vercel env, never in the codebase).
 *
 * Returns 200 with the new expiry on success, or 4xx/5xx with a
 * machine-readable error code on failure.
 */
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import {
  refreshLongLivedToken,
  isoExpiryFromSeconds,
} from "@/lib/instagram-oauth";
import { getInstagramConfig, setInstagramConfig } from "@/lib/integrations";

async function handle(req: NextRequest) {
  // Auth: cron secret OR authenticated admin.
  const secret = req.nextUrl.searchParams.get("secret");
  const cronSecret = process.env.CRON_SECRET;
  const fromCron = Boolean(cronSecret && secret === cronSecret);
  if (!fromCron) {
    const blocked = await requireAdminRequest();
    if (blocked) return blocked;
  }

  const cfg = await getInstagramConfig();
  if (!cfg?.accessToken) {
    return NextResponse.json(
      { error: "not_connected", detail: "No access token stored." },
      { status: 400 },
    );
  }

  try {
    const next = await refreshLongLivedToken(cfg.accessToken);
    const expiresAt = isoExpiryFromSeconds(next.expires_in);
    await setInstagramConfig({
      accessToken: next.access_token,
      expiresAt,
      refreshedAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, expiresAt });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ error: "refresh_failed", detail: msg }, { status: 502 });
  }
}

export const GET = handle;
export const POST = handle;
