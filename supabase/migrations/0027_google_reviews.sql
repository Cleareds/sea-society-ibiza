-- 0027_google_reviews.sql
--
-- Google reviews: editable aggregate rating for the organisation, surfaced
-- on-site and in the Organization/LocalBusiness JSON-LD as AggregateRating.
-- Values are entered/maintained from /admin/settings (a live Google Places
-- API sync can replace the manual values later). Left null until the client
-- fills in their real numbers — the markup + badge only render when set.

alter table public.site_settings
  add column if not exists google_rating       numeric(2,1),
  add column if not exists google_review_count integer,
  add column if not exists google_reviews_url  text;

comment on column public.site_settings.google_rating is
  'Average Google rating, e.g. 4.9 (1 decimal). Null hides the rating + AggregateRating markup.';
comment on column public.site_settings.google_review_count is
  'Number of Google reviews behind the rating.';
comment on column public.site_settings.google_reviews_url is
  'Link to the Google reviews / business profile.';
