/**
 * Instagram OAuth callback.
 *
 * Meta redirects the admin here after they click "Allow" on the IG
 * consent screen. We:
 *   1. Verify the state cookie matches the returned ?state.
 *   2. Exchange ?code for a short-lived access token.
 *   3. Exchange that for a long-lived (60-day) token.
 *   4. Fetch /me to grab the IG user id + username.
 *   5. Store everything in the `integrations` table.
 *   6. Redirect back to /admin/integrations with a flash message.
 *
 * The route is NOT gated by middleware — the OAuth provider (Meta)
 * is the caller, not a logged-in admin. We instead validate the
 * single-use `state` value that was set by the admin's "Connect"
 * click, which only the original initiator could know.
 */
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  exchangeCodeForToken,
  exchangeForLongLivedToken,
  fetchMe,
  isoExpiryFromSeconds,
} from "@/lib/instagram-oauth";
import { setInstagramConfig } from "@/lib/integrations";

const STATE_COOKIE = "ssi-ig-oauth-state";

function redirectTo(req: NextRequest, status: string, detail?: string) {
  const url = new URL("/admin/integrations", req.url);
  url.searchParams.set("status", status);
  if (detail) url.searchParams.set("detail", detail);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const code = params.get("code");
  const returnedState = params.get("state");
  const error = params.get("error");
  const errorDescription = params.get("error_description");

  if (error) {
    return redirectTo(req, "error", errorDescription ?? error);
  }
  if (!code || !returnedState) {
    return redirectTo(req, "error", "missing_code_or_state");
  }

  const jar = await cookies();
  const expectedState = jar.get(STATE_COOKIE)?.value;
  jar.delete(STATE_COOKIE);
  if (!expectedState || expectedState !== returnedState) {
    return redirectTo(req, "error", "state_mismatch");
  }

  try {
    const shortLived = await exchangeCodeForToken(code);
    const longLived = await exchangeForLongLivedToken(shortLived.access_token);
    const me = await fetchMe(longLived.access_token);
    await setInstagramConfig({
      accessToken: longLived.access_token,
      userId: me.id,
      username: me.username,
      expiresAt: isoExpiryFromSeconds(longLived.expires_in),
      refreshedAt: new Date().toISOString(),
    });
    return redirectTo(req, "connected", me.username);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown_error";
    return redirectTo(req, "error", msg);
  }
}
