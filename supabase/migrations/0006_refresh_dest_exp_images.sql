-- Refresh destination + experience imagery to the may-26 shoot.
--
-- Updates by slug (idempotent — if the row exists it's updated, otherwise
-- the corresponding dummy-data row will seed it from the application).
-- Boats and other tables intentionally untouched.

-- Experiences ----------------------------------------------------------------
update public.experiences set hero_image = '/sea-society/site/exp-day-trips.webp'
  where slug = 'day-trips';

update public.experiences set hero_image = '/sea-society/site/exp-sunset.webp'
  where slug = 'sunset-cruises';

update public.experiences set hero_image = '/sea-society/site/exp-multi-day.webp'
  where slug = 'multi-day-balearic';

update public.experiences set hero_image = '/sea-society/site/exp-special.webp'
  where slug = 'special-occasions';

-- Destinations ---------------------------------------------------------------
update public.destinations
   set hero_image = '/sea-society/site/dest-ibiza.webp',
       gallery = jsonb_build_array(
         jsonb_build_object('src', '/sea-society/site/dest-ibiza.webp',   'alt', 'Es Vedra rock from the water at golden hour'),
         jsonb_build_object('src', '/sea-society/site/dest-ibiza-2.webp', 'alt', 'Ibiza coastline approach'),
         jsonb_build_object('src', '/sea-society/site/dest-ibiza-3.webp', 'alt', 'Swimming with Es Vedra in the distance')
       )
 where slug = 'ibiza';

update public.destinations
   set hero_image = '/sea-society/site/dest-formentera.webp',
       gallery = jsonb_build_array(
         jsonb_build_object('src', '/sea-society/site/dest-formentera.webp',   'alt', 'Yacht anchored off a Formentera sandbank'),
         jsonb_build_object('src', '/sea-society/site/dest-formentera-2.webp', 'alt', 'Swim stop under Formentera cliffs')
       )
 where slug = 'formentera';

update public.destinations
   set hero_image = '/sea-society/site/dest-mallorca.webp',
       gallery = jsonb_build_array(
         jsonb_build_object('src', '/sea-society/site/dest-mallorca.webp',   'alt', 'Yacht running parallel to Mallorca cliffs'),
         jsonb_build_object('src', '/sea-society/site/dest-mallorca-2.webp', 'alt', 'Open water crossing from Ibiza to Mallorca')
       )
 where slug = 'mallorca';
