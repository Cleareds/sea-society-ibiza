-- Footer socials + sharper WhatsApp pre-filled message.
--
-- 1. site_settings gains optional facebook_url + tiktok_url columns.
--    Footer renders the icon link only when the URL is present, so old
--    rows without these columns degrade gracefully.
-- 2. The default whatsapp_default_message gains qualifying prompts
--    (guests / dates / yacht type) so incoming enquiries arrive with
--    enough context to be triaged without a back-and-forth.

alter table public.site_settings
  add column if not exists facebook_url text,
  add column if not exists tiktok_url text;

comment on column public.site_settings.facebook_url is
  'Optional Facebook page URL — rendered in the site footer when present.';
comment on column public.site_settings.tiktok_url is
  'Optional TikTok profile URL — rendered in the site footer when present.';

update public.site_settings
set
  facebook_url = 'https://www.facebook.com/profile.php?id=61590214507668',
  tiktok_url   = 'https://www.tiktok.com/@sea.society.ibiza',
  whatsapp_default_message =
    'Hi Sea Society, I''d like to enquire about a charter.' || E'\n' ||
    'Number of guests: ' || E'\n' ||
    'Date(s): ' || E'\n' ||
    'Yacht type or budget: '
where id = 1;
