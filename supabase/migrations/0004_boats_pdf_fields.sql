-- 0004_boats_pdf_fields.sql
-- Add the richer brochure-derived fields to the boats table and the
-- top-5 hero-stats highlights array used by the new single-boat page.

-- Widen length_m so 32.92 etc. round-trip without losing the second decimal
-- (original schema was numeric(4,1) i.e. one decimal place).
alter table public.boats
  alter column length_m type numeric(5,2);

alter table public.boats
  add column if not exists model_name text,
  add column if not exists beam_m numeric(4,2),
  add column if not exists guests_night integer,
  add column if not exists refit_year integer,
  add column if not exists base_harbour text,
  add column if not exists cruise_knots integer,
  add column if not exists max_knots integer,
  add column if not exists engines text,
  add column if not exists stabilizers text,
  add column if not exists consumption text,
  add column if not exists price_high integer,
  add column if not exists highlights jsonb default '[]'::jsonb;
