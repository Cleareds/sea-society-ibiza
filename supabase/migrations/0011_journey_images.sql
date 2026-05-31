-- "Follow our society" Instagram tile wall — make the 18 image URLs
-- editable via the admin panel instead of hardcoded in
-- components/site/InstagramGrid.tsx. Stored as a JSONB array on the
-- single-row site_settings table:
--
--   journey_images : [{ "src": "/sea-society/site/journey-1.webp" }, …]
--
-- Component reads from settings, falls back to the same defaults if
-- the column is null or empty.

alter table site_settings
  add column if not exists journey_images jsonb;

update site_settings set journey_images = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/site/journey-1.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-2.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-3.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-4.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-5.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-6.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-7.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-8.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-9.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-10.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-11.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-12.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-13.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-14.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-15.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-16.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-17.webp'),
  jsonb_build_object('src', '/sea-society/site/journey-18.webp')
) where journey_images is null;
