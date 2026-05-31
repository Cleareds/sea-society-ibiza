-- Add a card_image column to boats so tile/list contexts (homepage
-- featured grid, /fleet card grid, related-boats block) can use a
-- different photo than the detail-page hero banner.
--
-- Frontend (lib/data/supabase/index.ts mapBoat) reads this into
-- boat.cardImage; BoatCard + HomeWater3DScene + HomeImmersiveScene
-- prefer cardImage over heroImage when present. Detail page banner
-- still uses heroImage.
--
-- Initial values populate the 8 boats with shipped landscape crops
-- at /images/boats/cards/{stem}-card.webp (Next/public). Other boats
-- keep card_image NULL and fall back to hero_image.

alter table boats
  add column if not exists card_image text;

update boats set card_image = '/images/boats/cards/ariyas-card.webp'
  where slug = 'ariyas-sunseeker-predator-84';

update boats set card_image = '/images/boats/cards/chloe-card.webp'
  where slug = 'chloe-princess-v58';

update boats set card_image = '/images/boats/cards/dr-no-card.webp'
  where slug = 'dr-no-pershing-6x';

update boats set card_image = '/images/boats/cards/ella-card.webp'
  where slug = 'ella-riva-argo-90';

update boats set card_image = '/images/boats/cards/inspiration-card.webp'
  where slug = 'inspiration-pershing-90';

update boats set card_image = '/images/boats/cards/manbero-card.webp'
  where slug = 'manbero-ii-princess-v53';

update boats set card_image = '/images/boats/cards/mazu-card.webp'
  where slug = 'mazu-astondoa-80';

update boats set card_image = '/images/boats/cards/sensation-card.webp'
  where slug = 'sensation-pershing-72';

update boats set card_image = '/images/boats/cards/majestic-card.webp'
  where slug = 'majestic-vandutch-40';

-- Majestic — the previous DB row pointed hero_image + gallery at a
-- deck-with-fruits photo; replace with the boat-exterior shot
-- sourced from ibimarcharter.com (now in /public/images/boats/).
update boats set
  hero_image = '/images/boats/majestic-hero.webp',
  card_image = '/images/boats/cards/majestic-card.webp',
  gallery = '[{"src":"/images/boats/majestic-hero.webp","alt":"Majestic — VanDutch 40"}]'::jsonb
  where slug = 'majestic-vandutch-40';

-- Instagram URL canonicalisation — point the "Follow our society"
-- block at the real account: https://www.instagram.com/seasociety.ibiza/
update site_settings set
  instagram_url = 'https://www.instagram.com/seasociety.ibiza/',
  instagram_handle = '@seasociety.ibiza';

comment on column boats.card_image is
  'Optional URL for tile/list contexts. Falls back to hero_image when null. Detail page banner always uses hero_image.';

-- Homepage swap: Chloe in, Belisa out. getFeaturedBoats(3) returns
-- featured-true boats ordered by sort_order; Belisa was sort_order 2
-- and Chloe sort_order 3, so flipping their `featured` flag puts
-- Chloe in the top-3 instead of Belisa without changing the order
-- of the remaining featured boats.
update boats set featured = false where slug = 'belisa-mangusta-108';
update boats set featured = true  where slug = 'chloe-princess-v58';
