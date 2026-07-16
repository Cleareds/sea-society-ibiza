-- 0025_boats_capacity_wording.sql
--
-- Client alignment (2026-07-05) + Lincia's screenshot note: the
-- "12 day / 8 night" capacity value read ambiguously — it could be
-- misread as "12 people for 8 nights". Reword so it clearly means guest
-- counts: N during the day, M sleeping overnight.
--
-- The value is derived from the guests / guests_night columns (not the
-- old free-text string), which also repairs highlights that went stale
-- after 0023 changed guests_night for some boats without updating them.
--
-- Note: specs.Capacity and highlights[icon=guests] are English-only —
-- they are NOT part of the per-locale i18n overrides (0015/0019/0020
-- translate only tagline/description/meta/what_included), so this single
-- value is what every locale renders today. If per-locale wording is
-- wanted later, add specs/highlights to the i18n JSONB.

-- Full-day + overnight boats -> "N daytime · M overnight"
-- Day-only boats (guests_night null/0) -> "N daytime"

-- specs grid: the row labelled 'Capacity'
update public.boats b set specs = (
  select jsonb_agg(
    case when e->>'label' = 'Capacity'
      then jsonb_set(e, '{value}', to_jsonb(
        b.guests::text || ' daytime'
        || case when coalesce(b.guests_night, 0) > 0
                then ' · ' || b.guests_night::text || ' overnight'
                else '' end))
      else e end)
  from jsonb_array_elements(b.specs) e)
where b.specs @> '[{"label":"Capacity"}]'::jsonb;

-- highlight tiles: the tile with icon 'guests'
update public.boats b set highlights = (
  select jsonb_agg(
    case when e->>'icon' = 'guests'
      then jsonb_set(e, '{value}', to_jsonb(
        b.guests::text || ' daytime'
        || case when coalesce(b.guests_night, 0) > 0
                then ' · ' || b.guests_night::text || ' overnight'
                else '' end))
      else e end)
  from jsonb_array_elements(b.highlights) e)
where b.highlights @> '[{"icon":"guests"}]'::jsonb;
