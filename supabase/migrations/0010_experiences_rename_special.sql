-- Rename the "Special occasions" experience tile to
-- "Sea Society Experiences" per the brand-side copy update.
-- Slug stays `special-occasions` so existing URLs + Google
-- indexing don't break; only the title + meta_title change.

update experiences set
  title = 'Sea Society Experiences',
  meta_title = 'Sea Society Experiences — Ibiza yacht charter'
  where slug = 'special-occasions';
