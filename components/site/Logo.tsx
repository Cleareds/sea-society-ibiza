import { cn } from "@/lib/utils";

interface Props {
  /** Use the white wordmark for transparent-over-hero, the dark one elsewhere. */
  variant?: "light" | "dark";
  /** "wordmark" = full Sea Society wordmark, "icon" = SS-mark only. */
  kind?: "wordmark" | "icon";
  /** Rendered height in pixels (the source assets are responsive). */
  height?: number;
  className?: string;
  alt?: string;
  /** LCP-priority hint — only set on the header logo when it's above the fold. */
  priority?: boolean;
}

/**
 * Brand mark. Source PNGs were huge (11k+ pixels) so the build pipeline
 * (`scripts/make-brand-assets.mjs`) emits sharp-sized webp variants we
 * pick from here.
 *
 * Uses a plain <img> intentionally — with `images.unoptimized: true` in
 * next.config.ts, next/image doesn't emit a srcset, so it can't pick the
 * right size. A direct <img> with srcSet hits the same CDN cache and
 * lets the browser pick the appropriate variant. ESLint warns about
 * `<img>` (favouring next/image) — that warning is the cost of avoiding
 * Vercel's image-optimization billing for a static brand asset.
 */
export function Logo({
  variant = "dark",
  kind = "wordmark",
  height = 28,
  className,
  alt = "Sea Society Ibiza",
  priority = false,
}: Props) {
  if (kind === "icon") {
    const src = variant === "light" ? "/brand/icon-light-256.webp" : "/brand/icon-dark-256.webp";
    const w = Math.round(height * 0.76);
    return (
      // eslint-disable-next-line @next/next/no-img-element -- intentional, see Logo.tsx header
      <img
        src={src}
        alt={alt}
        width={w}
        height={height}
        className={cn("inline-block", className)}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    );
  }

  // Wordmark — source aspect 11415:2943.
  const ratio = 11415 / 2943;
  const width = Math.round(height * ratio);
  const base = variant === "light" ? "wordmark-light" : "wordmark-dark";
  const srcSet = [320, 640, 1200].map((w) => `/brand/${base}-${w}.webp ${w}w`).join(", ");

  return (
    // eslint-disable-next-line @next/next/no-img-element -- intentional, see Logo.tsx header
    <img
      src={`/brand/${base}-640.webp`}
      srcSet={srcSet}
      sizes={`${width}px`}
      alt={alt}
      width={width}
      height={height}
      className={cn("block select-none", className)}
      style={{ height, width }}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
