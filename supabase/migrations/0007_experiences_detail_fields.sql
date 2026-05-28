-- Experiences become blog-post-style detail pages with their own
-- /experiences/[slug] route, similar to boats. Extra fields support
-- a longer body, image gallery, top-of-page facts (duration, group
-- size, starting price), and SEO metadata.
--
-- All additions are nullable / defaulted so existing rows keep working.

alter table public.experiences
  add column if not exists long_description text,
  add column if not exists gallery jsonb default '[]'::jsonb,
  add column if not exists duration text,
  add column if not exists group_size text,
  add column if not exists price_from numeric,
  add column if not exists meta_title text,
  add column if not exists meta_description text;
