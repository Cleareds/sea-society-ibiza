import Image from "next/image";
import { Heart, MessageCircle, Play } from "lucide-react";
import { fetchInstagramFeed, type IgMedia } from "@/lib/instagram";
import { InstagramGrid } from "./InstagramGrid";

interface Props {
  handle: string;
  href: string;
  /** "light" renders dark title on light bg; "dark" renders white over canvas. */
  tone?: "light" | "dark";
}

/**
 * Live "Follow the journey" feed pulled from the Instagram Graph API.
 *
 * Falls back to the static <InstagramGrid /> tiles when the IG env vars
 * aren't configured or the API call fails. Same visual layout as the
 * static grid — full-bleed wall, 2 cols on mobile / 6 cols on desktop,
 * 18 tiles, no gap, no rounded corners — with a like/comment overlay
 * fading in on hover for desktop pointers.
 *
 * Cached via fetchInstagramFeed (Next data cache, revalidate 1h).
 */
export async function InstagramFeed({ handle, href, tone = "light" }: Props) {
  const media = await fetchInstagramFeed(18);
  if (!media || media.length === 0) {
    return <InstagramGrid handle={handle} href={href} tone={tone} />;
  }

  const headlineCls =
    tone === "dark"
      ? "brand-headline text-3xl text-white md:text-5xl"
      : "font-serif text-3xl text-[var(--color-on-surface)] md:text-4xl";
  const handleCls =
    tone === "dark"
      ? "text-sm font-medium text-white/85 hover:text-white"
      : "text-sm font-medium text-[var(--color-primary)] hover:underline";

  return (
    <section aria-labelledby="ig-h" className="w-full">
      <div className="mx-auto mb-8 flex w-full max-w-(--spacing-container-max) flex-col items-baseline justify-between gap-2 px-5 md:flex-row md:px-10">
        <h2 id="ig-h" className={headlineCls}>
          Follow the journey
        </h2>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={handleCls}
        >
          {handle}
        </a>
      </div>
      <ul className="grid w-full grid-cols-2 md:grid-cols-6">
        {media.map((m, i) => (
          <Tile key={m.id} media={m} hideOnMobile={i >= 6} eager={i < 6} />
        ))}
      </ul>
    </section>
  );
}

function Tile({
  media,
  hideOnMobile,
  eager,
}: {
  media: IgMedia;
  hideOnMobile: boolean;
  eager: boolean;
}) {
  // For VIDEO posts the media_url is the .mp4; we always want the still
  // for the grid. thumbnail_url is provided by Graph for videos. For
  // images and carousels media_url is itself the image.
  const src =
    media.mediaType === "VIDEO" && media.thumbnailUrl
      ? media.thumbnailUrl
      : media.mediaUrl;
  const isVideo = media.mediaType === "VIDEO";
  const isCarousel = media.mediaType === "CAROUSEL_ALBUM";

  return (
    <li
      className={`brand-img-hover relative aspect-square overflow-hidden ${
        hideOnMobile ? "hidden md:block" : ""
      }`}
    >
      <a
        href={media.permalink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={media.caption?.slice(0, 80) ?? "Open on Instagram"}
        className="group block h-full w-full"
      >
        <Image
          src={src}
          alt={media.caption?.slice(0, 120) ?? ""}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(min-width: 768px) 17vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          // IG CDN URLs are external; rely on next.config images.unoptimized=true.
          unoptimized
        />
        {/* Media-type badge — small Play icon on videos, stacked-squares
            on carousels. Visible without hover so the user knows what
            they're clicking into. */}
        {(isVideo || isCarousel) && (
          <span
            aria-hidden
            className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/45 p-1.5 text-white backdrop-blur-sm"
          >
            {isVideo ? (
              <Play className="h-3.5 w-3.5 fill-white" />
            ) : (
              <CarouselIcon />
            )}
          </span>
        )}
        {/* Hover overlay — likes + comments, fades in on pointer:fine
            devices so the grid stays clean on touch. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-5 bg-black/45 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 [@media(pointer:coarse)]:hidden">
          <span className="inline-flex items-center gap-1.5">
            <Heart className="h-4 w-4 fill-white" />
            {formatCount(media.likeCount)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4" />
            {formatCount(media.commentsCount)}
          </span>
        </div>
      </a>
    </li>
  );
}

function CarouselIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-3.5 w-3.5"
      aria-hidden
    >
      <rect x="3" y="3" width="10" height="10" rx="1.5" />
      <path d="M5.5 1.5 H 13.5 A 1 1 0 0 1 14.5 2.5 V 10.5" />
    </svg>
  );
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
