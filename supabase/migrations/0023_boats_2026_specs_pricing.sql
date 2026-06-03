-- Canonical 2026 specs + pricing for all 21 yachts, taken verbatim from
-- Ibimar's commercial spec sheet (YACHTS DETAILS 2026.pdf) and
-- the pricing list (IBIMAR PRICES - SEASON 2026.pdf). Source documents
-- live in sea-society/FLOTA IBIMAR CHARTER/.
--
-- Updates per row:
--   price_from, price_high
--   length_m, beam_m, build_year, refit_year,
--   cruise_knots, max_knots, guests, guests_night, cabins,
--   engines, consumption, base_harbour
--   specs jsonb (rebuilt — this is what the fleet/[slug] page renders)
--
-- High season window: 20 June – 31 August (rendered via the
-- fleet.highSeasonNote translation key on the detail page).
--
-- Translations (es / fr / nl) for tagline / description / what_included
-- live on the boats.i18n column and are not touched here — the spec
-- LABELS in non-en locales fall back to English via the i18n merger,
-- which is acceptable for a launch since they are short technical
-- terms. Localising the spec labels is a follow-up.

-- =========================================================================
-- belisa-mangusta-108
-- =========================================================================
update public.boats set
  price_from = 11000,
  price_high = 13750,
  length_m = 32.9,
  beam_m = 7.15,
  build_year = 2001,
  refit_year = 2023,
  cruise_knots = 28,
  max_knots = 36,
  guests = 12,
  guests_night = 10,
  cabins = 4,
  engines = '2 × MTU, 2.800 hp',
  consumption = '990 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Mangusta'),
    jsonb_build_object('label','Model','value','108'),
    jsonb_build_object('label','Year','value','2001 — Refit 2023 (engines overhaul 2022)'),
    jsonb_build_object('label','Flag','value','Maltese'),
    jsonb_build_object('label','Length','value','32.92 m'),
    jsonb_build_object('label','Beam','value','7.15 m'),
    jsonb_build_object('label','Engines','value','2 × MTU — 2.800 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','28 / 36 knots'),
    jsonb_build_object('label','Capacity','value','12 day / 10 night'),
    jsonb_build_object('label','Cabins','value','4 (1 Master, 2 VIP, 1 Quadruple)'),
    jsonb_build_object('label','Bathrooms','value','4 + 1 guest toilet'),
    jsonb_build_object('label','Fuel consumption','value','990 L/H'),
    jsonb_build_object('label','Crew','value','Captain, mechanical engineer, cook, 2 sailors')
  )
where slug = 'belisa-mangusta-108';

-- =========================================================================
-- ella-riva-argo-90
-- =========================================================================
update public.boats set
  price_from = 12950,
  price_high = 14950,
  length_m = 28.7,
  beam_m = 6.50,
  build_year = 2020,
  refit_year = null,
  cruise_knots = 22,
  max_knots = 28,
  guests = 12,
  guests_night = 8,
  cabins = 4,
  engines = '2 × MTU, 2.650 hp',
  consumption = '760 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Riva'),
    jsonb_build_object('label','Model','value','Argo 90'),
    jsonb_build_object('label','Year','value','2020'),
    jsonb_build_object('label','Flag','value','Maltese'),
    jsonb_build_object('label','Length','value','28.70 m'),
    jsonb_build_object('label','Beam','value','6.50 m'),
    jsonb_build_object('label','Engines','value','2 × MTU — 2.650 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','22 / 28 knots'),
    jsonb_build_object('label','Capacity','value','12 day / 8 night'),
    jsonb_build_object('label','Cabins','value','4 (1 Master, 2 VIP, 1 Twin)'),
    jsonb_build_object('label','Bathrooms','value','4 + 1 guest toilet'),
    jsonb_build_object('label','Fuel consumption','value','760 L/H'),
    jsonb_build_object('label','Crew','value','Captain, chef, 2 sailors')
  )
where slug = 'ella-riva-argo-90';

-- =========================================================================
-- inspiration-pershing-90
-- =========================================================================
update public.boats set
  price_from = 10000,
  price_high = 12000,
  length_m = 27.4,
  beam_m = 6.23,
  build_year = 2006,
  refit_year = 2025,
  cruise_knots = 30,
  max_knots = 42,
  guests = 12,
  guests_night = 8,
  cabins = 4,
  engines = '2 × MTU, 2.450 hp',
  consumption = '900 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Pershing'),
    jsonb_build_object('label','Model','value','90'),
    jsonb_build_object('label','Year','value','2006 — Refit 2025 (engines overhaul 2023)'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','27.42 m'),
    jsonb_build_object('label','Beam','value','6.23 m'),
    jsonb_build_object('label','Engines','value','2 × MTU — 2.450 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','30 / 42 knots'),
    jsonb_build_object('label','Capacity','value','12 day / 8 night'),
    jsonb_build_object('label','Cabins','value','4 (1 Master, 1 VIP, 2 Twins)'),
    jsonb_build_object('label','Bathrooms','value','4 + 1 guest toilet'),
    jsonb_build_object('label','Fuel consumption','value','900 L/H'),
    jsonb_build_object('label','Crew','value','Captain + 2 sailors')
  )
where slug = 'inspiration-pershing-90';

-- =========================================================================
-- yolo-sunreef-70
-- =========================================================================
update public.boats set
  price_from = 9350,
  price_high = 10500,
  length_m = 23.6,
  beam_m = 11.00,
  build_year = 2022,
  refit_year = 2024,
  cruise_knots = null,
  max_knots = null,
  guests = 12,
  guests_night = 8,
  cabins = 4,
  engines = '2 × John Deere, 225 hp',
  consumption = '200 L/H',
  base_harbour = 'Ibiza & Balearic / Caribbean (berth not included)',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Sunreef'),
    jsonb_build_object('label','Model','value','70+'),
    jsonb_build_object('label','Year','value','2022 — Refit 2024'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','23.60 m'),
    jsonb_build_object('label','Beam','value','11.00 m'),
    jsonb_build_object('label','Engines','value','2 × John Deere — 225 hp'),
    jsonb_build_object('label','Capacity','value','12 day / 8 night'),
    jsonb_build_object('label','Cabins','value','4 doubles'),
    jsonb_build_object('label','Bathrooms','value','4'),
    jsonb_build_object('label','Fuel consumption','value','200 L/H'),
    jsonb_build_object('label','Crew','value','Captain, chef, 2 sailors'),
    jsonb_build_object('label','Notable','value','Flybridge 50 m² lounge, Starlink, hydraulic platform')
  )
where slug = 'yolo-sunreef-70';

-- =========================================================================
-- eternity-44-arcadia-85
-- =========================================================================
update public.boats set
  price_from = 8500,
  price_high = 9500,
  length_m = 27.0,
  beam_m = 7.10,
  build_year = 2010,
  refit_year = null,
  cruise_knots = 13,
  max_knots = 17,
  guests = 12,
  guests_night = 8,
  cabins = 4,
  engines = '2 × MAN, 730 hp',
  consumption = '200 L/H',
  base_harbour = 'IGY Ibiza Marina',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Arcadia'),
    jsonb_build_object('label','Model','value','85'),
    jsonb_build_object('label','Year','value','2010'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','27 m'),
    jsonb_build_object('label','Beam','value','7.10 m'),
    jsonb_build_object('label','Material','value','GRP + aluminium'),
    jsonb_build_object('label','Engines','value','2 × MAN — 730 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','13 / 17 knots'),
    jsonb_build_object('label','Capacity','value','12 day / 8 night'),
    jsonb_build_object('label','Cabins','value','4 (1 Master, 1 VIP, 2 Twins)'),
    jsonb_build_object('label','Bathrooms','value','4'),
    jsonb_build_object('label','Fuel consumption','value','200 L/H'),
    jsonb_build_object('label','Crew','value','Captain, chef, 2 sailors'),
    jsonb_build_object('label','Notable','value','Solar panels, zero-speed fin stabilizers')
  )
where slug = 'eternity-44-arcadia-85';

-- =========================================================================
-- ariyas-sunseeker-predator-84
-- =========================================================================
update public.boats set
  price_from = 7650,
  price_high = 8750,
  length_m = 27.4,
  beam_m = 6.50,
  build_year = 2010,
  refit_year = 2024,
  cruise_knots = 25,
  max_knots = 34,
  guests = 12,
  guests_night = 8,
  cabins = 4,
  engines = '2 × MTU, 2.434 hp',
  consumption = '600 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Sunseeker'),
    jsonb_build_object('label','Model','value','Predator 84'),
    jsonb_build_object('label','Year','value','2010 — Refit 2024'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','27.45 m'),
    jsonb_build_object('label','Beam','value','6.50 m'),
    jsonb_build_object('label','Engines','value','2 × MTU — 2.434 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','25 / 34 knots'),
    jsonb_build_object('label','Capacity','value','12 day / 8 night'),
    jsonb_build_object('label','Cabins','value','4 (1 Master, 1 VIP, 2 Twins)'),
    jsonb_build_object('label','Bathrooms','value','4'),
    jsonb_build_object('label','Fuel consumption','value','600 L/H'),
    jsonb_build_object('label','Crew','value','Captain + 2 sailors'),
    jsonb_build_object('label','Notable','value','ABT Vinu stabilizers, hydraulic platform')
  )
where slug = 'ariyas-sunseeker-predator-84';

-- =========================================================================
-- georgia-sunseeker-predator-82
-- =========================================================================
update public.boats set
  price_from = 6050,
  price_high = 7400,
  length_m = 24.0,
  beam_m = 6.00,
  build_year = 2007,
  refit_year = 2025,
  cruise_knots = 22,
  max_knots = 35,
  guests = 12,
  guests_night = 8,
  cabins = 4,
  engines = '2 × MTU, 1.820 hp',
  consumption = '500 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Sunseeker'),
    jsonb_build_object('label','Model','value','Predator 82'),
    jsonb_build_object('label','Year','value','2007 — Refit 2025 (engines overhaul 2021)'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','24.00 m'),
    jsonb_build_object('label','Beam','value','6.00 m'),
    jsonb_build_object('label','Engines','value','2 × MTU — 1.820 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','22 / 35 knots'),
    jsonb_build_object('label','Capacity','value','12 day / 8 night'),
    jsonb_build_object('label','Cabins','value','4 (1 Master, 1 VIP, 1 Twin, 1 Bunk)'),
    jsonb_build_object('label','Bathrooms','value','4'),
    jsonb_build_object('label','Fuel consumption','value','500 L/H'),
    jsonb_build_object('label','Crew','value','Captain + 2 sailors'),
    jsonb_build_object('label','Notable','value','Hydraulic platform')
  )
where slug = 'georgia-sunseeker-predator-82';

-- =========================================================================
-- sensation-pershing-72
-- =========================================================================
update public.boats set
  price_from = 5900,
  price_high = 7100,
  length_m = 22.3,
  beam_m = 5.50,
  build_year = 2008,
  refit_year = 2023,
  cruise_knots = 35,
  max_knots = 40,
  guests = 12,
  guests_night = 6,
  cabins = 3,
  engines = '2 × MTU, 2.000 hp',
  consumption = '600 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Pershing'),
    jsonb_build_object('label','Model','value','72'),
    jsonb_build_object('label','Year','value','2008 — Refit 2023'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','22.26 m'),
    jsonb_build_object('label','Beam','value','5.50 m'),
    jsonb_build_object('label','Engines','value','2 × MTU — 2.000 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','35 / 40 knots'),
    jsonb_build_object('label','Capacity','value','12 day / 6 night'),
    jsonb_build_object('label','Cabins','value','3 (1 Master, 1 VIP, 1 Twin)'),
    jsonb_build_object('label','Bathrooms','value','3'),
    jsonb_build_object('label','Fuel consumption','value','600 L/H'),
    jsonb_build_object('label','Crew','value','Captain + sailor'),
    jsonb_build_object('label','Notable','value','Water maker')
  )
where slug = 'sensation-pershing-72';

-- =========================================================================
-- ruby-tuesday-princess-v72
-- =========================================================================
update public.boats set
  price_from = 5450,
  price_high = 6800,
  length_m = 22.0,
  beam_m = 5.20,
  build_year = 2013,
  refit_year = 2022,
  cruise_knots = 23,
  max_knots = 39,
  guests = 12,
  guests_night = 6,
  cabins = 3,
  engines = '2 × Caterpillar, 1.800 hp',
  consumption = '400 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Princess'),
    jsonb_build_object('label','Model','value','V72'),
    jsonb_build_object('label','Year','value','2013 — Refit 2022'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','22.00 m'),
    jsonb_build_object('label','Beam','value','5.20 m'),
    jsonb_build_object('label','Engines','value','2 × Caterpillar — 1.800 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','23 / 39 knots'),
    jsonb_build_object('label','Capacity','value','12 day / 6 night'),
    jsonb_build_object('label','Cabins','value','3 (1 Master, 1 VIP, 1 Twin)'),
    jsonb_build_object('label','Bathrooms','value','3'),
    jsonb_build_object('label','Fuel consumption','value','400 L/H'),
    jsonb_build_object('label','Crew','value','Captain + sailor'),
    jsonb_build_object('label','Notable','value','Water maker, hydraulic platform')
  )
where slug = 'ruby-tuesday-princess-v72';

-- =========================================================================
-- black-jax-sunseeker-predator-74
-- =========================================================================
update public.boats set
  price_from = 5250,
  price_high = 6600,
  length_m = 22.4,
  beam_m = 5.40,
  build_year = 2009,
  refit_year = 2023,
  cruise_knots = 22,
  max_knots = 39,
  guests = 12,
  guests_night = 6,
  cabins = 3,
  engines = '2 × MAN, 1.850 hp',
  consumption = '400 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Sunseeker'),
    jsonb_build_object('label','Model','value','Predator 74'),
    jsonb_build_object('label','Year','value','2009 — Refit 2023'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','22.38 m'),
    jsonb_build_object('label','Beam','value','5.40 m'),
    jsonb_build_object('label','Engines','value','2 × MAN — 1.850 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','22 / 39 knots'),
    jsonb_build_object('label','Capacity','value','12 day / 6 night'),
    jsonb_build_object('label','Cabins','value','3 (1 Master, 1 VIP, 1 Twin)'),
    jsonb_build_object('label','Bathrooms','value','3'),
    jsonb_build_object('label','Fuel consumption','value','400 L/H'),
    jsonb_build_object('label','Crew','value','Captain + sailor'),
    jsonb_build_object('label','Notable','value','Hydraulic platform')
  )
where slug = 'black-jax-sunseeker-predator-74';

-- =========================================================================
-- dr-no-pershing-6x
-- =========================================================================
update public.boats set
  price_from = 5400,
  price_high = 6400,
  length_m = 18.9,
  beam_m = 4.80,
  build_year = 2025,
  refit_year = null,
  cruise_knots = 40,
  max_knots = 48,
  guests = 12,
  guests_night = 6,
  cabins = 3,
  engines = '2 × MAN, 1.550 hp',
  consumption = '490 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Pershing'),
    jsonb_build_object('label','Model','value','6X'),
    jsonb_build_object('label','Year','value','2025'),
    jsonb_build_object('label','Flag','value','Belgian'),
    jsonb_build_object('label','Length','value','18.94 m'),
    jsonb_build_object('label','Beam','value','4.80 m'),
    jsonb_build_object('label','Engines','value','2 × MAN — 1.550 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','40 / 48 knots'),
    jsonb_build_object('label','Capacity','value','12 day / 6 night'),
    jsonb_build_object('label','Cabins','value','3 (1 Master, 1 VIP, 1 Twin)'),
    jsonb_build_object('label','Bathrooms','value','3'),
    jsonb_build_object('label','Fuel consumption','value','490 L/H'),
    jsonb_build_object('label','Crew','value','Captain + sailor'),
    jsonb_build_object('label','Notable','value','Seakeeper stabilizer, water maker')
  )
where slug = 'dr-no-pershing-6x';

-- =========================================================================
-- number-9-sunseeker-predator-72
-- =========================================================================
update public.boats set
  price_from = 4700,
  price_high = 6000,
  length_m = 22.3,
  beam_m = 5.40,
  build_year = 2007,
  refit_year = 2025,
  cruise_knots = 22,
  max_knots = 35,
  guests = 12,
  guests_night = 6,
  cabins = 3,
  engines = '2 × MAN, 1.550 hp',
  consumption = '350 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Sunseeker'),
    jsonb_build_object('label','Model','value','Predator 72'),
    jsonb_build_object('label','Year','value','2007 — Refit 2025'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','22.25 m'),
    jsonb_build_object('label','Beam','value','5.40 m'),
    jsonb_build_object('label','Engines','value','2 × MAN — 1.550 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','22 / 35 knots'),
    jsonb_build_object('label','Capacity','value','12 day / 6 night'),
    jsonb_build_object('label','Cabins','value','3 (1 Master, 1 VIP, 1 Twin)'),
    jsonb_build_object('label','Bathrooms','value','3'),
    jsonb_build_object('label','Fuel consumption','value','350 L/H'),
    jsonb_build_object('label','Crew','value','Captain + sailor'),
    jsonb_build_object('label','Notable','value','Water maker, hydraulic platform')
  )
where slug = 'number-9-sunseeker-predator-72';

-- =========================================================================
-- tranquility-iii-sunseeker-predator-68
-- =========================================================================
update public.boats set
  price_from = 4150,
  price_high = 5500,
  length_m = 21.6,
  beam_m = 5.21,
  build_year = 2005,
  refit_year = 2022,
  cruise_knots = 22,
  max_knots = 38,
  guests = 12,
  guests_night = 4,
  cabins = 4,
  engines = '2 × MAN, 1.300 hp',
  consumption = '300 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Sunseeker'),
    jsonb_build_object('label','Model','value','Predator 68'),
    jsonb_build_object('label','Year','value','2005 — Refit 2022 (engines overhaul 2022)'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','21.60 m'),
    jsonb_build_object('label','Beam','value','5.21 m'),
    jsonb_build_object('label','Engines','value','2 × MAN — 1.300 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','22 / 38 knots'),
    jsonb_build_object('label','Capacity','value','12 day / 4 night'),
    jsonb_build_object('label','Cabins','value','4 (1 Master, 1 VIP)'),
    jsonb_build_object('label','Bathrooms','value','2'),
    jsonb_build_object('label','Fuel consumption','value','300 L/H'),
    jsonb_build_object('label','Crew','value','Captain + sailor'),
    jsonb_build_object('label','Notable','value','Hydraulic platform')
  )
where slug = 'tranquility-iii-sunseeker-predator-68';

-- =========================================================================
-- mazu-astondoa-80
-- =========================================================================
update public.boats set
  price_from = 3950,
  price_high = 5300,
  length_m = 24.5,
  beam_m = 5.40,
  refit_year = 2025,
  cruise_knots = 18,
  max_knots = 24,
  guests = 12,
  guests_night = 8,
  cabins = 4,
  engines = '2 × MAN, 1.300 hp',
  consumption = '300 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Astondoa'),
    jsonb_build_object('label','Model','value','80'),
    jsonb_build_object('label','Year','value','Complete refit 2025 (engines overhaul 2023)'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','24.50 m'),
    jsonb_build_object('label','Beam','value','5.40 m'),
    jsonb_build_object('label','Engines','value','2 × MAN — 1.300 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','18 / 24 knots'),
    jsonb_build_object('label','Capacity','value','12 day / 8 night'),
    jsonb_build_object('label','Cabins','value','4 (1 Master, 1 VIP, 2 Twin)'),
    jsonb_build_object('label','Bathrooms','value','4'),
    jsonb_build_object('label','Fuel consumption','value','300 L/H'),
    jsonb_build_object('label','Crew','value','Captain + sailor'),
    jsonb_build_object('label','Notable','value','Flybridge, water maker, hydraulic platform')
  )
where slug = 'mazu-astondoa-80';

-- =========================================================================
-- chloe-princess-v58
-- =========================================================================
update public.boats set
  price_from = 3600,
  price_high = 4200,
  length_m = 18.4,
  beam_m = 4.65,
  build_year = 2018,
  refit_year = null,
  cruise_knots = 23,
  max_knots = 36,
  guests = 12,
  guests_night = 6,
  cabins = 3,
  engines = '2 × Volvo, 900 hp',
  consumption = '220 L/H',
  base_harbour = 'Marina Santa Eulalia',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Princess'),
    jsonb_build_object('label','Model','value','V58'),
    jsonb_build_object('label','Year','value','2018'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','18.42 m'),
    jsonb_build_object('label','Beam','value','4.65 m'),
    jsonb_build_object('label','Engines','value','2 × Volvo — 900 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','23 / 36 knots'),
    jsonb_build_object('label','Capacity','value','12 day / 6 night'),
    jsonb_build_object('label','Cabins','value','3 (1 Master, 1 VIP, 1 Bunk)'),
    jsonb_build_object('label','Bathrooms','value','2'),
    jsonb_build_object('label','Fuel consumption','value','220 L/H'),
    jsonb_build_object('label','Crew','value','Captain + sailor')
  )
where slug = 'chloe-princess-v58';

-- =========================================================================
-- shaka-laka-princess-v58
-- =========================================================================
update public.boats set
  price_from = 3100,
  price_high = 3650,
  length_m = 18.2,
  beam_m = 4.62,
  build_year = 2009,
  refit_year = 2023,
  cruise_knots = 23,
  max_knots = 38,
  guests = 12,
  guests_night = 6,
  cabins = 3,
  engines = '2 × CAT, 1.070 hp',
  consumption = '250 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Princess'),
    jsonb_build_object('label','Model','value','V58'),
    jsonb_build_object('label','Year','value','2009 — Refit 2023'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','18.20 m'),
    jsonb_build_object('label','Beam','value','4.62 m'),
    jsonb_build_object('label','Engines','value','2 × CAT — 1.070 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','23 / 38 knots'),
    jsonb_build_object('label','Capacity','value','12 day / 6 night'),
    jsonb_build_object('label','Cabins','value','3 (1 Master, 1 Twin, 1 Bunk)'),
    jsonb_build_object('label','Bathrooms','value','2'),
    jsonb_build_object('label','Fuel consumption','value','250 L/H'),
    jsonb_build_object('label','Crew','value','Captain + sailor'),
    jsonb_build_object('label','Notable','value','Water maker')
  )
where slug = 'shaka-laka-princess-v58';

-- =========================================================================
-- invictus-riva-rivale-52
-- =========================================================================
update public.boats set
  price_from = 2750,
  price_high = 3200,
  length_m = 16.1,
  beam_m = 4.61,
  build_year = 2005,
  refit_year = 2025,
  cruise_knots = 24,
  max_knots = 37,
  guests = 9,
  guests_night = 4,
  cabins = 2,
  engines = '2 × MAN, 900 hp',
  consumption = '250 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Riva'),
    jsonb_build_object('label','Model','value','Rivale 52'),
    jsonb_build_object('label','Year','value','2005 — Refit 2025'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','16.12 m'),
    jsonb_build_object('label','Beam','value','4.61 m'),
    jsonb_build_object('label','Engines','value','2 × MAN — 900 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','24 / 37 knots'),
    jsonb_build_object('label','Capacity','value','9 day / 4 night'),
    jsonb_build_object('label','Cabins','value','2 (1 Master, 1 Twin)'),
    jsonb_build_object('label','Bathrooms','value','2'),
    jsonb_build_object('label','Fuel consumption','value','250 L/H'),
    jsonb_build_object('label','Crew','value','Captain')
  )
where slug = 'invictus-riva-rivale-52';

-- =========================================================================
-- manbero-ii-princess-v53
-- =========================================================================
update public.boats set
  price_from = 2500,
  price_high = 3000,
  length_m = 16.1,
  beam_m = 4.47,
  build_year = 2010,
  refit_year = 2024,
  cruise_knots = 22,
  max_knots = 36,
  guests = 12,
  guests_night = 6,
  cabins = 3,
  engines = '2 × Volvo Penta, 800 hp',
  consumption = '200 L/H',
  base_harbour = 'Marina Ibiza',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Princess'),
    jsonb_build_object('label','Model','value','V53'),
    jsonb_build_object('label','Year','value','2010 — Refit 2024'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','16.12 m'),
    jsonb_build_object('label','Beam','value','4.47 m'),
    jsonb_build_object('label','Engines','value','2 × Volvo Penta — 800 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','22 / 36 knots'),
    jsonb_build_object('label','Capacity','value','12 day / 6 night'),
    jsonb_build_object('label','Cabins','value','3 (1 Master, 1 Twin, 1 Bunk)'),
    jsonb_build_object('label','Bathrooms','value','2'),
    jsonb_build_object('label','Fuel consumption','value','200 L/H'),
    jsonb_build_object('label','Crew','value','Captain')
  )
where slug = 'manbero-ii-princess-v53';

-- =========================================================================
-- majestic-vandutch-40
-- =========================================================================
update public.boats set
  price_from = 1600,
  price_high = 1750,
  length_m = 12.0,
  beam_m = 3.50,
  build_year = 2010,
  refit_year = 2022,
  cruise_knots = 22,
  max_knots = 34,
  guests = 9,
  guests_night = null,
  cabins = 1,
  engines = '2 × Yanmar, 480 hp',
  consumption = '100 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','VanDutch'),
    jsonb_build_object('label','Model','value','40'),
    jsonb_build_object('label','Year','value','2010 — Refit 2022'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','11.98 m'),
    jsonb_build_object('label','Beam','value','3.50 m'),
    jsonb_build_object('label','Engines','value','2 × Yanmar — 480 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','22 / 34 knots'),
    jsonb_build_object('label','Capacity','value','9 day'),
    jsonb_build_object('label','Layout','value','Open day boat with sofa'),
    jsonb_build_object('label','Bathrooms','value','1'),
    jsonb_build_object('label','Fuel consumption','value','100 L/H'),
    jsonb_build_object('label','Crew','value','Captain')
  )
where slug = 'majestic-vandutch-40';

-- =========================================================================
-- floppy-sacs-stratos-42
-- =========================================================================
update public.boats set
  price_from = 1200,
  price_high = 1300,
  length_m = 12.4,
  beam_m = 3.62,
  refit_year = 2022,
  cruise_knots = 24,
  max_knots = 37,
  guests = 11,
  guests_night = null,
  cabins = 1,
  engines = '2 × Cummins, 220 hp',
  consumption = '90 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','SACS'),
    jsonb_build_object('label','Model','value','Stratos 42'),
    jsonb_build_object('label','Year','value','Refit 2022'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','12.40 m'),
    jsonb_build_object('label','Beam','value','3.62 m'),
    jsonb_build_object('label','Engines','value','2 × Cummins — 220 hp'),
    jsonb_build_object('label','Speed (cruising/max)','value','24 / 37 knots'),
    jsonb_build_object('label','Capacity','value','11 day'),
    jsonb_build_object('label','Layout','value','Open RIB with double bed'),
    jsonb_build_object('label','Bathrooms','value','1 WC'),
    jsonb_build_object('label','Fuel consumption','value','90 L/H'),
    jsonb_build_object('label','Crew','value','Captain')
  )
where slug = 'floppy-sacs-stratos-42';

-- =========================================================================
-- django-noah-29fb
-- =========================================================================
update public.boats set
  price_from = 950,
  price_high = 1050,
  length_m = 9.4,
  beam_m = 3.24,
  build_year = 2016,
  refit_year = 2022,
  cruise_knots = 22,
  max_knots = 34,
  guests = 9,
  guests_night = null,
  cabins = 0,
  engines = '2 × Volvo, 168 hp',
  consumption = '90 L/H',
  base_harbour = 'Marina Botafoc',
  specs = jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Noah'),
    jsonb_build_object('label','Model','value','RIB SRL 29'),
    jsonb_build_object('label','Year','value','2016 — Refit 2022'),
    jsonb_build_object('label','Flag','value','Spanish'),
    jsonb_build_object('label','Length','value','9.40 m'),
    jsonb_build_object('label','Beam','value','3.24 m'),
    jsonb_build_object('label','Engines','value','2 × Volvo — 168 hp (petrol)'),
    jsonb_build_object('label','Speed (cruising/max)','value','22 / 34 knots'),
    jsonb_build_object('label','Capacity','value','9 day'),
    jsonb_build_object('label','Bathrooms','value','1'),
    jsonb_build_object('label','Fuel consumption','value','90 L/H'),
    jsonb_build_object('label','Crew','value','Captain')
  )
where slug = 'django-noah-29fb';

-- =========================================================================
-- SEANFINITY T4 — new addition (22nd yacht). Pricing per
-- IBIMAR PRICES - SEASON 2026.pdf; full spec sheet not in
-- YACHTS DETAILS 2026.pdf yet, so this row carries placeholder zero
-- values for the numeric spec columns. Anton to complete specs +
-- copy in a follow-up.
-- =========================================================================
insert into public.boats (
  slug, name, model_name, brand, type,
  tagline, description,
  length_m, beam_m, guests, cabins,
  price_from, price_high, currency,
  base_harbour, what_included,
  specs, gallery, highlights,
  hero_image, is_published, featured, sort_order,
  meta_title, meta_description
) values (
  'seanfinity-t4',
  'Seanfinity',
  'T4',
  'Seanfinity',
  'motor_yacht',
  'A balanced day cruiser for groups who want speed, comfort and a clean Mediterranean silhouette.',
  'Seanfinity T4 — Ibimar''s newest 2026 addition to the Sea Society line-up. Full spec sheet to follow; pricing is final at €2.250 (low season) / €2.600 (high season) per day, both excluding VAT, fuel, APA and crew gratuity.',
  null, null, 12, null,
  2250, 2600, 'EUR',
  'Marina Botafoc',
  jsonb_build_array(
    'Professional captain and crew',
    'Marina Botafoc base',
    'Snorkel gear',
    'Towels and sun loungers',
    'Bose / premium audio system',
    'Wifi on board'
  ),
  jsonb_build_array(
    jsonb_build_object('label','Shipyard','value','Seanfinity'),
    jsonb_build_object('label','Model','value','T4'),
    jsonb_build_object('label','Capacity','value','12 day'),
    jsonb_build_object('label','Berth','value','Marina Botafoc')
  ),
  '[]'::jsonb,
  '[]'::jsonb,
  null,
  true,
  false,
  999,  -- sort to end until full specs land
  'Charter Seanfinity T4 in Ibiza — Sea Society',
  'Charter Seanfinity T4 from Marina Botafoc — Ibimar''s 2026 addition to the Sea Society fleet. From €2.250 / day + VAT.'
)
on conflict (slug) do nothing;

-- =========================================================================
-- Gallery (interior + deck shots) — paths reference WebP renditions
-- produced from sea-society/FLOTA IBIMAR CHARTER/<n>. MODEL-NAME/ by
-- scripts/import-fleet-gallery.sh. Stored as { src: "/..." } objects
-- to match the existing journey_images shape and the destinations
-- gallery shape.
-- =========================================================================

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/belisa-mangusta-108/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/belisa-mangusta-108/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/belisa-mangusta-108/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/belisa-mangusta-108/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/belisa-mangusta-108/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/belisa-mangusta-108/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/belisa-mangusta-108/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/belisa-mangusta-108/8.webp')
) where slug = 'belisa-mangusta-108';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/ella-riva-argo-90/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ella-riva-argo-90/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ella-riva-argo-90/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ella-riva-argo-90/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ella-riva-argo-90/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ella-riva-argo-90/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ella-riva-argo-90/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ella-riva-argo-90/8.webp')
) where slug = 'ella-riva-argo-90';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/inspiration-pershing-90/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/inspiration-pershing-90/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/inspiration-pershing-90/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/inspiration-pershing-90/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/inspiration-pershing-90/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/inspiration-pershing-90/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/inspiration-pershing-90/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/inspiration-pershing-90/8.webp')
) where slug = 'inspiration-pershing-90';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/yolo-sunreef-70/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/yolo-sunreef-70/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/yolo-sunreef-70/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/yolo-sunreef-70/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/yolo-sunreef-70/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/yolo-sunreef-70/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/yolo-sunreef-70/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/yolo-sunreef-70/8.webp')
) where slug = 'yolo-sunreef-70';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/eternity-44-arcadia-85/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/eternity-44-arcadia-85/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/eternity-44-arcadia-85/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/eternity-44-arcadia-85/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/eternity-44-arcadia-85/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/eternity-44-arcadia-85/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/eternity-44-arcadia-85/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/eternity-44-arcadia-85/8.webp')
) where slug = 'eternity-44-arcadia-85';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/ariyas-sunseeker-predator-84/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ariyas-sunseeker-predator-84/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ariyas-sunseeker-predator-84/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ariyas-sunseeker-predator-84/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ariyas-sunseeker-predator-84/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ariyas-sunseeker-predator-84/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ariyas-sunseeker-predator-84/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ariyas-sunseeker-predator-84/8.webp')
) where slug = 'ariyas-sunseeker-predator-84';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/georgia-sunseeker-predator-82/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/georgia-sunseeker-predator-82/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/georgia-sunseeker-predator-82/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/georgia-sunseeker-predator-82/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/georgia-sunseeker-predator-82/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/georgia-sunseeker-predator-82/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/georgia-sunseeker-predator-82/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/georgia-sunseeker-predator-82/8.webp')
) where slug = 'georgia-sunseeker-predator-82';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/sensation-pershing-72/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/sensation-pershing-72/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/sensation-pershing-72/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/sensation-pershing-72/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/sensation-pershing-72/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/sensation-pershing-72/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/sensation-pershing-72/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/sensation-pershing-72/8.webp')
) where slug = 'sensation-pershing-72';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/ruby-tuesday-princess-v72/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ruby-tuesday-princess-v72/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ruby-tuesday-princess-v72/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ruby-tuesday-princess-v72/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ruby-tuesday-princess-v72/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ruby-tuesday-princess-v72/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ruby-tuesday-princess-v72/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/ruby-tuesday-princess-v72/8.webp')
) where slug = 'ruby-tuesday-princess-v72';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/black-jax-sunseeker-predator-74/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/black-jax-sunseeker-predator-74/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/black-jax-sunseeker-predator-74/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/black-jax-sunseeker-predator-74/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/black-jax-sunseeker-predator-74/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/black-jax-sunseeker-predator-74/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/black-jax-sunseeker-predator-74/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/black-jax-sunseeker-predator-74/8.webp')
) where slug = 'black-jax-sunseeker-predator-74';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/dr-no-pershing-6x/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/dr-no-pershing-6x/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/dr-no-pershing-6x/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/dr-no-pershing-6x/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/dr-no-pershing-6x/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/dr-no-pershing-6x/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/dr-no-pershing-6x/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/dr-no-pershing-6x/8.webp')
) where slug = 'dr-no-pershing-6x';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/number-9-sunseeker-predator-72/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/number-9-sunseeker-predator-72/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/number-9-sunseeker-predator-72/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/number-9-sunseeker-predator-72/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/number-9-sunseeker-predator-72/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/number-9-sunseeker-predator-72/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/number-9-sunseeker-predator-72/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/number-9-sunseeker-predator-72/8.webp')
) where slug = 'number-9-sunseeker-predator-72';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/tranquility-iii-sunseeker-predator-68/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/tranquility-iii-sunseeker-predator-68/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/tranquility-iii-sunseeker-predator-68/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/tranquility-iii-sunseeker-predator-68/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/tranquility-iii-sunseeker-predator-68/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/tranquility-iii-sunseeker-predator-68/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/tranquility-iii-sunseeker-predator-68/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/tranquility-iii-sunseeker-predator-68/8.webp')
) where slug = 'tranquility-iii-sunseeker-predator-68';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/mazu-astondoa-80/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/mazu-astondoa-80/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/mazu-astondoa-80/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/mazu-astondoa-80/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/mazu-astondoa-80/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/mazu-astondoa-80/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/mazu-astondoa-80/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/mazu-astondoa-80/8.webp')
) where slug = 'mazu-astondoa-80';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/chloe-princess-v58/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/chloe-princess-v58/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/chloe-princess-v58/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/chloe-princess-v58/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/chloe-princess-v58/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/chloe-princess-v58/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/chloe-princess-v58/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/chloe-princess-v58/8.webp')
) where slug = 'chloe-princess-v58';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/shaka-laka-princess-v58/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/shaka-laka-princess-v58/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/shaka-laka-princess-v58/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/shaka-laka-princess-v58/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/shaka-laka-princess-v58/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/shaka-laka-princess-v58/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/shaka-laka-princess-v58/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/shaka-laka-princess-v58/8.webp')
) where slug = 'shaka-laka-princess-v58';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/invictus-riva-rivale-52/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/invictus-riva-rivale-52/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/invictus-riva-rivale-52/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/invictus-riva-rivale-52/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/invictus-riva-rivale-52/5.webp')
) where slug = 'invictus-riva-rivale-52';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/manbero-ii-princess-v53/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/manbero-ii-princess-v53/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/manbero-ii-princess-v53/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/manbero-ii-princess-v53/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/manbero-ii-princess-v53/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/manbero-ii-princess-v53/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/manbero-ii-princess-v53/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/manbero-ii-princess-v53/8.webp')
) where slug = 'manbero-ii-princess-v53';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/majestic-vandutch-40/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/majestic-vandutch-40/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/majestic-vandutch-40/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/majestic-vandutch-40/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/majestic-vandutch-40/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/majestic-vandutch-40/6.webp')
) where slug = 'majestic-vandutch-40';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/floppy-sacs-stratos-42/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/floppy-sacs-stratos-42/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/floppy-sacs-stratos-42/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/floppy-sacs-stratos-42/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/floppy-sacs-stratos-42/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/floppy-sacs-stratos-42/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/floppy-sacs-stratos-42/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/floppy-sacs-stratos-42/8.webp')
) where slug = 'floppy-sacs-stratos-42';

update public.boats set gallery = jsonb_build_array(
  jsonb_build_object('src', '/sea-society/fleet-gallery/django-noah-29fb/1.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/django-noah-29fb/2.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/django-noah-29fb/3.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/django-noah-29fb/4.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/django-noah-29fb/5.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/django-noah-29fb/6.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/django-noah-29fb/7.webp'),
  jsonb_build_object('src', '/sea-society/fleet-gallery/django-noah-29fb/8.webp')
) where slug = 'django-noah-29fb';
