/**
 * Resize an image URL on the fly without going through Vercel's image
 * optimisation proxy (we run `images.unoptimized: true`).
 *
 *   - Unsplash CDN URLs accept `?w=` and `?q=` — rewritten here.
 *   - Supabase Storage URLs have a paired `-thumb.webp` file pre-generated
 *     by the admin upload pipeline (full @ 2400w, thumb @ 900w). When the
 *     caller asks for a width <= 1100 we swap to the thumb.
 *   - Local /images/boats/*-hero.webp have a paired *-hero-thumb.webp at
 *     900w sitting next to the full 1800w file; same width gate as above.
 *   - Everything else is returned unchanged.
 *
 * Used by BoatCard, the experiences/destinations teaser cards and the
 * Instagram grid — anywhere we render at a width significantly smaller
 * than the canonical source.
 */
export function imageVariant(src: string, width: number): string {
  if (!src) return src;

  // Local /images/boats/*-hero.webp — relative path, can't be parsed by
  // URL(). Swap to the 900w thumb when the caller's slot is small.
  if (
    src.startsWith("/images/boats/") &&
    src.endsWith("-hero.webp") &&
    width <= 1100
  ) {
    return src.replace(/-hero\.webp$/, "-hero-thumb.webp");
  }

  // Local /images/boats/cards/*-card.webp — same gate, swap to thumb.
  if (
    src.startsWith("/images/boats/cards/") &&
    src.endsWith("-card.webp") &&
    width <= 1100
  ) {
    return src.replace(/-card\.webp$/, "-card-thumb.webp");
  }

  try {
    const u = new URL(src);
    // Unsplash CDN — set w + ensure auto-format + sensible quality
    if (u.hostname === "images.unsplash.com") {
      u.searchParams.set("w", String(width));
      u.searchParams.set("q", width >= 1600 ? "82" : "78");
      if (!u.searchParams.has("auto")) u.searchParams.set("auto", "format");
      if (!u.searchParams.has("fit")) u.searchParams.set("fit", "crop");
      return u.toString();
    }
    // Supabase Storage — swap to the pre-sized thumb for small slots
    if (
      u.hostname.endsWith(".supabase.co") &&
      u.pathname.includes("/storage/v1/object/public/") &&
      width <= 1100 &&
      u.pathname.endsWith(".webp") &&
      !u.pathname.endsWith("-thumb.webp")
    ) {
      u.pathname = u.pathname.replace(/\.webp$/, "-thumb.webp");
      return u.toString();
    }
  } catch {
    /* not a parseable URL — fall through */
  }
  return src;
}
