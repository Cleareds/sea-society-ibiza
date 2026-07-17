-- 0029_experiences_content.sql
--
-- Experiences CMS: a block-based `content` body editors compose in the admin.
-- Ordered array of blocks; each block's text fields are localized inline
-- ({ en, es, fr, nl }) so a block keeps its translations when reordered.
-- Empty array = the detail page falls back to the classic body/longDescription
-- layout, so existing experiences are unchanged until content is added.
--
-- Block shape (stored):
--   { "id": "...", "type": "heading|paragraph|image|quote",
--     "text": {"en":"…","es":"…"}, "src": "...",
--     "alt": {...}, "caption": {...}, "attribution": {...} }

alter table public.experiences
  add column if not exists content jsonb not null default '[]'::jsonb;

comment on column public.experiences.content is
  'Block-based page body (ordered). Inline-localized text fields. Empty = use the classic body layout.';
