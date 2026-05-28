/**
 * Refresh the long-lived Instagram access token.
 *
 * Two ways to call this route:
 *   1. From the admin UI — authenticated admin user (cookie-based).
 *   2. From Vercel cron — Vercel automatically injects
 *      `Authorization: Bearer $CRON_SECRET` on each invocation when the
 *      env var is set. We also accept `?secret=` as a manual escape
 *      hatch for one-off curl tests.
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
  // Auth: Vercel cron bearer header, manual `?secret=`, or authenticated admin.
  const cronSecret = process.env.CRON_SECRET;
  const headerAuth = req.headers.get("authorization");
  const querySecret = req.nextUrl.searchParams.get("secret");
  const fromCron = Boolean(
    cronSecret &&
      (headerAuth === `Bearer ${cronSecret}` || querySecret === cronSecret),
  );
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
