-- Replace site_settings.journey_images with the 18 new Sea Society
-- photo tiles, in the order shown on the brand's "feed website" mood
-- board (apppas.jpeg). Files live in public/sea-society/site/instagram/
-- as /journey-{1..18}.webp at 800w / WebP q72 (~30-90 KB each).
-- The InstagramGrid component reads from this column on the homepage
-- and /about; admins can still swap individual tiles via /admin/journey.

update site_settings set journey_images = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/site/instagram/journey-1.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-2.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-3.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-4.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-5.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-6.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-7.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-8.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-9.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-10.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-11.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-12.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-13.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-14.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-15.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-16.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-17.webp'),
  jsonb_build_object('src', '/sea-society/site/instagram/journey-18.webp')
);
