/**
 * Slug → card-image override for tile/list contexts (homepage featured,
 * /fleet grid, related-boats blocks). Lives outside the boat data
 * source so it applies whether boats come from the dummy file or
 * Supabase — neither has to carry a `card_image` column.
 *
 * Detail-page hero banners are not affected; they use boat.heroImage.
 */
const OVERRIDES: Record<string, string> = {
  "ariyas-sunseeker-predator-84": "/images/boats/cards/ariyas-card.webp",
  "chloe-princess-v58": "/images/boats/cards/chloe-card.webp",
  "dr-no-pershing-6x": "/images/boats/cards/dr-no-card.webp",
  "ella-riva-argo-90": "/images/boats/cards/ella-card.webp",
  "inspiration-pershing-90": "/images/boats/cards/inspiration-card.webp",
  "manbero-ii-princess-v53": "/images/boats/cards/manbero-card.webp",
  "mazu-astondoa-80": "/images/boats/cards/mazu-card.webp",
  "sensation-pershing-72": "/images/boats/cards/sensation-card.webp",
};

export function cardImageForSlug(slug: string): string | undefined {
  return OVERRIDES[slug];
}
