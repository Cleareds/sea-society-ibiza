/**
 * Instagram Graph API fetcher for the @seasociety.ibiza feed.
 *
 * Token source order:
 *   1. The `integrations` table (id='instagram') — written by the
 *      admin OAuth flow at /admin/integrations.
 *   2. INSTAGRAM_ACCESS_TOKEN + INSTAGRAM_USER_ID env vars — fallback
 *      for dev / one-off manual setups.
 *
 * Without either available, fetchInstagramFeed() returns `null` and
 * callers should render the static <InstagramGrid /> fallback.
 *
 * CACHING: fetch() uses Next's data cache with `revalidate: 3600`, so
 * the API is hit at most once an hour per build. IG CDN URLs are
 * short-lived (signed); 1h is well inside their TTL.
 */
import { getInstagramConfig } from "./integrations";

export type IgMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

export interface IgMedia {
  id: string;
  permalink: string;
  /** Direct CDN URL — for VIDEO this is the .mp4; use thumbnailUrl for the still. */
  mediaUrl: string;
  /** Only populated for VIDEO posts. */
  thumbnailUrl?: string;
  mediaType: IgMediaType;
  caption?: string;
  timestamp: string;
  likeCount: number;
  commentsCount: number;
}

interface RawMedia {
  id: string;
  permalink: string;
  media_url: string;
  thumbnail_url?: string;
  media_type: IgMediaType;
  caption?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

/**
 * Fetch the most recent N posts for the configured IG Business account.
 * Returns null when the env vars are missing or the API call fails —
 * callers should treat that as "render the static fallback".
 */
export async function fetchInstagramFeed(limit = 18): Promise<IgMedia[] | null> {
  // Prefer DB credentials (admin-managed). Fall back to env for dev.
  let token: string | undefined;
  let userId: string | undefined;
  try {
    const cfg = await getInstagramConfig();
    token = cfg?.accessToken;
    userId = cfg?.userId;
  } catch {
    // DB unreachable — fall through to env.
  }
  token ??= process.env.INSTAGRAM_ACCESS_TOKEN;
  userId ??= process.env.INSTAGRAM_USER_ID;
  if (!token || !userId) return null;

  const fields = [
    "id",
    "caption",
    "media_type",
    "media_url",
    "thumbnail_url",
    "permalink",
    "timestamp",
    "like_count",
    "comments_count",
  ].join(",");

  const url =
    `https://graph.instagram.com/v21.0/${userId}/media` +
    `?fields=${fields}&limit=${limit}&access_token=${token}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.warn("[instagram] fetch failed:", res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as { data?: RawMedia[] };
    if (!json.data) return null;
    return json.data.map((d) => ({
      id: d.id,
      permalink: d.permalink,
      mediaUrl: d.media_url,
      thumbnailUrl: d.thumbnail_url,
      mediaType: d.media_type,
      caption: d.caption,
      timestamp: d.timestamp,
      likeCount: d.like_count ?? 0,
      commentsCount: d.comments_count ?? 0,
    }));
  } catch (err) {
    console.warn("[instagram] fetch error:", err);
    return null;
  }
}
