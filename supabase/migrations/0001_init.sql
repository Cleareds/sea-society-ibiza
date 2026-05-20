-- Sea Society Ibiza — initial schema
-- Run with the Supabase CLI: `supabase db push`
-- Or paste into the SQL editor of a fresh project.

create extension if not exists "pgcrypto";

-- =========================================================================
-- boats
-- =========================================================================
create table if not exists public.boats (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  long_description text,
  length_m numeric(4,1),
  guests integer,
  cabins integer,
  type text check (type in ('motor_yacht','sailing_yacht','catamaran','day_boat','sport_yacht')),
  brand text,
  build_year integer,
  price_from integer,
  currency text default 'EUR',
  what_included jsonb default '[]'::jsonb,
  specs jsonb default '[]'::jsonb,
  gallery jsonb default '[]'::jsonb,
  hero_image text,
  pdf_url text,
  featured boolean default false,
  sort_order integer default 0,
  is_published boolean default true,
  meta_title text,
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists boats_published_idx on public.boats (is_published, sort_order);
create index if not exists boats_featured_idx on public.boats (featured, sort_order) where is_published;

-- =========================================================================
-- experiences
-- =========================================================================
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  intro text,
  body text,
  hero_image text,
  sort_order integer default 0,
  is_published boolean default true,
  created_at timestamptz default now()
);

-- =========================================================================
-- destinations
-- =========================================================================
create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  intro text,
  body text,
  hero_image text,
  gallery jsonb default '[]'::jsonb,
  highlights jsonb default '[]'::jsonb,
  is_published boolean default true,
  created_at timestamptz default now()
);

-- =========================================================================
-- faqs
-- =========================================================================
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  sort_order integer default 0,
  is_published boolean default true
);

-- =========================================================================
-- enquiries
-- =========================================================================
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  dates text,
  group_size integer,
  boat_id uuid references public.boats(id) on delete set null,
  message text,
  source_page text,
  utm jsonb,
  handled boolean default false,
  created_at timestamptz default now()
);

create index if not exists enquiries_handled_idx on public.enquiries (handled, created_at desc);

-- =========================================================================
-- site_settings (single-row)
-- =========================================================================
create table if not exists public.site_settings (
  id integer primary key default 1,
  whatsapp_number text,
  whatsapp_default_message text,
  instagram_url text,
  instagram_handle text,
  email text,
  phone text,
  address text,
  stats jsonb default '[]'::jsonb,
  hero_headline text,
  hero_sub text,
  testimonials jsonb default '[]'::jsonb,
  constraint single_row check (id = 1)
);

-- =========================================================================
-- updated_at trigger for boats
-- =========================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists boats_updated_at on public.boats;
create trigger boats_updated_at before update on public.boats
  for each row execute procedure public.set_updated_at();

-- =========================================================================
-- Row Level Security
-- =========================================================================
alter table public.boats enable row level security;
alter table public.experiences enable row level security;
alter table public.destinations enable row level security;
alter table public.faqs enable row level security;
alter table public.enquiries enable row level security;
alter table public.site_settings enable row level security;

-- Public can read PUBLISHED rows from content tables.
create policy "public read published boats"
  on public.boats for select to anon, authenticated
  using (is_published = true);

create policy "public read published experiences"
  on public.experiences for select to anon, authenticated
  using (is_published = true);

create policy "public read published destinations"
  on public.destinations for select to anon, authenticated
  using (is_published = true);

create policy "public read published faqs"
  on public.faqs for select to anon, authenticated
  using (is_published = true);

create policy "public read site_settings"
  on public.site_settings for select to anon, authenticated
  using (true);

-- Public can INSERT enquiries; only authenticated users can read.
create policy "public insert enquiries"
  on public.enquiries for insert to anon, authenticated
  with check (true);

create policy "authenticated read enquiries"
  on public.enquiries for select to authenticated
  using (true);

create policy "authenticated update enquiries"
  on public.enquiries for update to authenticated
  using (true);

-- Authenticated users (whitelisted admin emails enforced in app middleware)
-- get full content control. Admin-only writes — tighten with a JWT claim if
-- the team grows.
create policy "authenticated write boats"
  on public.boats for all to authenticated
  using (true) with check (true);

create policy "authenticated write experiences"
  on public.experiences for all to authenticated
  using (true) with check (true);

create policy "authenticated write destinations"
  on public.destinations for all to authenticated
  using (true) with check (true);

create policy "authenticated write faqs"
  on public.faqs for all to authenticated
  using (true) with check (true);

create policy "authenticated write site_settings"
  on public.site_settings for all to authenticated
  using (true) with check (true);
