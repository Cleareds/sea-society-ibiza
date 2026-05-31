-- The 8 boats with shipped new photography (sourced from
-- /sea-society/images/ at higher resolution) get:
--   1. hero_image + gallery flipped to /images/boats/{stem}-hero.webp
--      (those files have just been re-encoded from the new sources at
--      1800w, replacing the old smaller crops).
--   2. sort_order = 1..8 so they appear first on /fleet, with all
--      other boats bumped past them while keeping their relative order.
-- Admin /boats grid reads hero_image, so this also fixes the
-- "old images in admin" issue.

-- First push every boat past slot 8 so 1..8 are free for the new
-- ordering. +100 keeps existing relative order intact.
update boats set sort_order = sort_order + 100;

-- Then assign the 8 boats with new photography to lead.
update boats set sort_order = 1,
  hero_image = '/images/boats/ariyas-hero.webp',
  card_image = '/images/boats/cards/ariyas-card.webp',
  gallery = '[{"src":"/images/boats/ariyas-hero.webp","alt":"Ariyas — Sunseeker Predator 84"}]'::jsonb
  where slug = 'ariyas-sunseeker-predator-84';

update boats set sort_order = 2,
  hero_image = '/images/boats/chloe-hero.webp',
  card_image = '/images/boats/cards/chloe-card.webp',
  gallery = '[{"src":"/images/boats/chloe-hero.webp","alt":"Chloe — Princess V58"}]'::jsonb
  where slug = 'chloe-princess-v58';

update boats set sort_order = 3,
  hero_image = '/images/boats/dr-no-hero.webp',
  card_image = '/images/boats/cards/dr-no-card.webp',
  gallery = '[{"src":"/images/boats/dr-no-hero.webp","alt":"Dr. No — Pershing 6X"}]'::jsonb
  where slug = 'dr-no-pershing-6x';

update boats set sort_order = 4,
  hero_image = '/images/boats/ella-hero.webp',
  card_image = '/images/boats/cards/ella-card.webp',
  gallery = '[{"src":"/images/boats/ella-hero.webp","alt":"Ella — Riva Argo 90"}]'::jsonb
  where slug = 'ella-riva-argo-90';

update boats set sort_order = 5,
  hero_image = '/images/boats/inspiration-hero.webp',
  card_image = '/images/boats/cards/inspiration-card.webp',
  gallery = '[{"src":"/images/boats/inspiration-hero.webp","alt":"Inspiration — Pershing 90"}]'::jsonb
  where slug = 'inspiration-pershing-90';

update boats set sort_order = 6,
  hero_image = '/images/boats/manbero-hero.webp',
  card_image = '/images/boats/cards/manbero-card.webp',
  gallery = '[{"src":"/images/boats/manbero-hero.webp","alt":"Manbero II — Princess V53"}]'::jsonb
  where slug = 'manbero-ii-princess-v53';

update boats set sort_order = 7,
  hero_image = '/images/boats/mazu-hero.webp',
  card_image = '/images/boats/cards/mazu-card.webp',
  gallery = '[{"src":"/images/boats/mazu-hero.webp","alt":"Mazu — Astondoa 80"}]'::jsonb
  where slug = 'mazu-astondoa-80';

update boats set sort_order = 8,
  hero_image = '/images/boats/sensation-hero.webp',
  card_image = '/images/boats/cards/sensation-card.webp',
  gallery = '[{"src":"/images/boats/sensation-hero.webp","alt":"Sensation — Pershing 72"}]'::jsonb
  where slug = 'sensation-pershing-72';
