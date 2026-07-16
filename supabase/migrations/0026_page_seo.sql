-- 0026_page_seo.sql
--
-- Editable meta title / description for the non-boat, top-level pages
-- (home, fleet, destinations, experiences, about, contact, faq, privacy,
-- terms, journey). Boats/experiences/destinations detail pages already
-- carry their own per-record meta.
--
-- One row per page_key. English lives in the top-level columns; es/fr/nl
-- overrides live in i18n, shaped:
--   { "es": {"meta_title": "...", "meta_description": "..."}, "fr": {...}, "nl": {...} }
-- Any missing field (or missing row) falls back to the page's built-in
-- copy.ts default at read time — so this table only holds overrides.

create table if not exists public.page_seo (
  page_key         text primary key,
  meta_title       text,
  meta_description text,
  i18n             jsonb not null default '{}'::jsonb,
  updated_at       timestamptz not null default now()
);

alter table public.page_seo enable row level security;

create policy "public read page_seo"
  on public.page_seo for select to anon, authenticated
  using (true);

create policy "authenticated write page_seo"
  on public.page_seo for all to authenticated
  using (true) with check (true);
