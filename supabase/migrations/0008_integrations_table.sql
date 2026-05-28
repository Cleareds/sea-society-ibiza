-- Generic key-value table for third-party integration credentials.
-- First inhabitant: Instagram (id = 'instagram'), which stores the
-- access token, user id, username, and token expiry returned by the
-- Meta OAuth flow. Future integrations (TikTok, Pinterest, etc) can
-- reuse this table with their own id keys.
--
-- RLS: anon has no access. The public-facing IG feed fetcher uses the
-- service-role key (SUPABASE_SECRET_KEY) to read tokens — never the
-- anon client. Authenticated admin users can read + write.

create table if not exists public.integrations (
  id text primary key,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.integrations enable row level security;

create policy "no public read integrations"
  on public.integrations for select
  to anon
  using (false);

create policy "auth read integrations"
  on public.integrations for select
  to authenticated
  using (true);

create policy "auth write integrations"
  on public.integrations for all
  to authenticated
  using (true)
  with check (true);

insert into public.integrations (id, config)
  values ('instagram', '{}'::jsonb)
  on conflict (id) do nothing;
