/**
 * Instagram Graph API fetcher for the @seasociety.ibiza feed.
 *
 * REQUIREMENTS (one-time setup on Meta side):
 *   1. Convert @seasociety.ibiza to a Business or Creator account.
 *   2. Create a Meta Developer App, add the Instagram Graph API product.
 *   3. Generate a long-lived User Access Token (60-day TTL).
 *   4. Set the env vars below in Vercel (or .env.local for dev):
 *
 *        INSTAGRAM_ACCESS_TOKEN  =  IGQVJX… (long-lived token)
 *        INSTAGRAM_USER_ID       =  the IG Business user id (17841…)
 *
 *   Token refresh: hit the /refresh_access_token endpoint at least
 *   monthly. The simplest pattern is a Vercel cron that calls
 *   /api/admin/refresh-instagram (out of scope for this commit).
 *
 * WITHOUT the env vars set, fetchInstagramFeed() returns `null` and
 * callers should fall back to the static <InstagramGrid /> tiles —
 * keeps the preview page rendering until the token is wired up.
 *
 * CACHING: fetch() uses Next's data cache with `revalidate: 3600`, so
 * the API is hit at most once an hour per build. The IG CDN URLs we
 * receive are short-lived (signed); 1h is well inside their TTL.
 */

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
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
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
