/**
 * Helpers for the Instagram OAuth dance (the "Instagram API with
 * Instagram Login" flow, not the older Facebook-Login variant).
 *
 *   1. authorizeUrl()              → URL the client opens to grant access
 *   2. exchangeCodeForToken()      → swaps the auth code for a short-lived token
 *   3. exchangeForLongLivedToken() → swaps short-lived (1h) for long-lived (60d)
 *   4. refreshLongLivedToken()     → renews a long-lived token before expiry
 *   5. fetchMe()                   → returns the IG user id + username
 *
 * Required env (server-side):
 *   INSTAGRAM_APP_ID
 *   INSTAGRAM_APP_SECRET
 *   INSTAGRAM_REDIRECT_URI   (e.g. https://seasocietyibiza.com/api/admin/instagram/callback)
 */

const AUTH_HOST = "https://www.instagram.com";
const API_HOST = "https://api.instagram.com";
const GRAPH_HOST = "https://graph.instagram.com";

// Scope set needed to read media + likes/comments counts. The "_basic"
// scope returns id, username, account_type, media count. The /media
// endpoint then returns like_count and comments_count under the same
// scope — no extra grant needed for read-only counts.
const SCOPE = "instagram_business_basic";

export function getOauthEnv() {
  const appId = process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
  return { appId, appSecret, redirectUri };
}

export function oauthConfigured(): boolean {
  const { appId, appSecret, redirectUri } = getOauthEnv();
  return Boolean(appId && appSecret && redirectUri);
}

export function authorizeUrl(state: string): string {
  const { appId, redirectUri } = getOauthEnv();
  if (!appId || !redirectUri) {
    throw new Error("INSTAGRAM_APP_ID + INSTAGRAM_REDIRECT_URI must be set.");
  }
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPE,
    state,
  });
  return `${AUTH_HOST}/oauth/authorize?${params.toString()}`;
}

interface ShortLivedToken {
  access_token: string;
  user_id: string | number;
  permissions?: string[];
}

export async function exchangeCodeForToken(code: string): Promise<ShortLivedToken> {
  const { appId, appSecret, redirectUri } = getOauthEnv();
  if (!appId || !appSecret || !redirectUri) {
    throw new Error("Instagram OAuth env not fully configured.");
  }
  const body = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code,
  });
  const res = await fetch(`${API_HOST}/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Token exchange failed (${res.status}): ${text}`);
  }
  return JSON.parse(text) as ShortLivedToken;
}

interface LongLivedToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function exchangeForLongLivedToken(
  shortLivedToken: string,
): Promise<LongLivedToken> {
  const { appSecret } = getOauthEnv();
  if (!appSecret) throw new Error("INSTAGRAM_APP_SECRET missing.");
  const params = new URLSearchParams({
    grant_type: "ig_exchange_token",
    client_secret: appSecret,
    access_token: shortLivedToken,
  });
  const res = await fetch(`${GRAPH_HOST}/access_token?${params.toString()}`);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Long-lived exchange failed (${res.status}): ${text}`);
  }
  return JSON.parse(text) as LongLivedToken;
}

export async function refreshLongLivedToken(
  currentToken: string,
): Promise<LongLivedToken> {
  const params = new URLSearchParams({
    grant_type: "ig_refresh_token",
    access_token: currentToken,
  });
  const res = await fetch(`${GRAPH_HOST}/refresh_access_token?${params.toString()}`);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Refresh failed (${res.status}): ${text}`);
  }
  return JSON.parse(text) as LongLivedToken;
}

export interface IgProfile {
  id: string;
  username: string;
  account_type?: string;
}

export async function fetchMe(accessToken: string): Promise<IgProfile> {
  const params = new URLSearchParams({
    fields: "id,username,account_type",
    access_token: accessToken,
  });
  const res = await fetch(`${GRAPH_HOST}/me?${params.toString()}`);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`/me failed (${res.status}): ${text}`);
  }
  return JSON.parse(text) as IgProfile;
}

/** Convenience: seconds-from-now → ISO string. */
export function isoExpiryFromSeconds(seconds: number): string {
  return new Date(Date.now() + seconds * 1000).toISOString();
}
