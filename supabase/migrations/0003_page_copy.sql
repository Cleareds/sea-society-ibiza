-- Editable copy for the About + Contact pages, stored on the single-row
-- site_settings table. Each blob holds { heroEyebrow, heroTitle, heroSub, body }
-- — body is markdown rendered with react-markdown on the public pages.
alter table public.site_settings
  add column if not exists about jsonb default '{}'::jsonb,
  add column if not exists contact jsonb default '{}'::jsonb;
