/**
 * Slug → detail-page hero image override. Same idea as
 * boat-card-images.ts but for the detail-page banner instead of the
 * tile contexts.
 *
 * Used to force the correct image when the Supabase row points at a
 * stale Supabase-storage URL we can't overwrite locally. Once the
 * corresponding migration (supabase/migrations/0009_boats_card_image)
 * has been applied, this override becomes inert and can be deleted.
 */
const OVERRIDES: Record<string, string> = {
  "majestic-vandutch-40": "/images/boats/majestic-hero.webp",
};

export function heroImageForSlug(slug: string): string | undefined {
  return OVERRIDES[slug];
}
