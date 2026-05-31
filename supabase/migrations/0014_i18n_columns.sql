-- Add locale-keyed translation columns to the three content tables.
-- Stored as JSONB: { "es": { tagline: "…", description: "…", … } }.
-- English columns are untouched; supabase mapper merges
-- `row.i18n?.[locale]` on top of the English fields per-field, so
-- partial translations fall back gracefully.

alter table boats         add column if not exists i18n jsonb;
alter table destinations  add column if not exists i18n jsonb;
alter table experiences   add column if not exists i18n jsonb;

comment on column boats.i18n is
  'Locale-keyed overrides for translatable boat fields (tagline, description, what_included, meta_*, etc.). Read by lib/data/supabase mapBoat when locale != en.';
comment on column destinations.i18n is
  'Locale-keyed overrides for translatable destination fields.';
comment on column experiences.i18n is
  'Locale-keyed overrides for translatable experience fields.';
