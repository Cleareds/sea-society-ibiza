# Sea Society Ibiza

Luxury yacht charter **marketing** site for Sea Society Ibiza
(operated by Ibimar). No bookings are concluded on-site — the contract
is handled separately by Ibimar; the site exists to surface the fleet
+ experiences + destinations and funnel enquiries to WhatsApp / the
contact form.

## Stack

- Next.js 16 App Router (Turbopack, React Compiler)
- Supabase (Postgres + Storage) — project ref `shubsfjvqgipjnyauyab`
- Vercel hosting (`cleareds/sea-society-ibiza`)
- TypeScript strict; LSP-based code intelligence
- GA4 + Meta Pixel via GTM container (`GTM-KTN8M8RB`) —
  consent-gated via the cookie banner (`components/site/Analytics.tsx`);
  GTM loads once analytics-or-marketing consent is granted. The site
  no longer loads a Meta Pixel directly — both pixel tags live inside
  the GTM container itself (manage/remove them at
  tagmanager.google.com, not in this repo).

## i18n — four locales, translation parity is non-negotiable

The site ships **four locales**: `en` (default, no URL prefix),
`es` (`/es/…`), `fr` (`/fr/…`), `nl` (`/nl/…`).

**Hard rule:** any content fix, change, or new copy lands in **all
four locales in the same PR**. Shipping EN-only — or EN + ES while
leaving FR + NL untouched — counts as incomplete work. The
LocaleSwitcher makes the gap visible to every visitor, and "I'll do
the other locales later" never happens.

Surface area to touch on every content change:

1. **UI strings**: `messages/{en,es,fr,nl}.json` — keep in lockstep.
2. **Static page copy**: `app/(site)/[locale]/<page>/copy.ts` —
   each defines locale-keyed branches and a `getXxxCopy(locale)`
   selector. The `about` page keeps its `aboutCopy` inline in
   `page.tsx`; same pattern (`{ en, es, fr, nl }`).
3. **DB-backed content** (boats / experiences / destinations): the
   English columns are canonical. Translations live in an `i18n`
   JSONB column shaped `{ es: {…}, fr: {…}, nl: {…} }`. When a
   migration adds or rewrites a translatable field, populate the
   non-EN keys in the same migration via
   `jsonb_set(coalesce(i18n,'{}'),'{es}', …)` etc.
4. **SEO**: `lib/seo/metadata.ts` has an OG locale entry per
   supported locale; `pageMetadata` generates `hreflang` for all
   locales automatically by iterating `locales` from
   `lib/i18n/config.ts`.

The single source of truth for which locales exist is
`lib/i18n/config.ts` — to add a fifth locale later, extend the
`locales` tuple there, add its message bundle, add it to
`OG_LOCALE_MAP`, and populate the JSONB columns + each static
`copy.ts`.

## Conventions

- Brand black `#000` for all CTAs (invert-on-hover white pill).
- Myanmar MN as primary sans font, Inter fallback.
- WhatsApp / phone canonical number: `+32 479 38 80 46` (single
  source: `site_settings.whatsapp_number` / `.phone`).
- `MAINTENANCE_MODE` env var on Vercel — `proxy.ts` gates traffic
  when `true`. Production is currently `false` (live).
- Never use destructive git ops (`reset --hard`, force push, etc.)
  without explicit ask.
- Don't run `supabase db push` against production without checking
  in first.

## Working with this repo

- Run `npx tsc --noEmit` after edits — there's no separate lint step
  the user cares about, but type errors must be clean before commit.
- Commits use conventional prefixes: `feat`, `fix`, `chore`,
  `refactor`. Always include the Claude co-author trailer.
- The user prefers terse responses + tight commit bodies.
