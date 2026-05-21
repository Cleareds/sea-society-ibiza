#!/usr/bin/env node
/**
 * Seed the Supabase project with the 19 dummy boats + experiences +
 * destinations + faqs + site_settings. Idempotent: uses upsert on the
 * unique `slug` (or id=1 for site_settings) so re-running is safe.
 *
 *   node scripts/supabase-seed.mjs
 *
 * Requires SUPABASE_SECRET_KEY in .env.local (server-only "secret" or
 * legacy "service_role" key — bypasses RLS).
 */
import { config } from "dotenv";
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import WebSocket from "ws";

if (!globalThis.WebSocket) globalThis.WebSocket = WebSocket;

const { createClient } = await import("@supabase/supabase-js");

config({ path: ".env.local" });

// Allow importing TypeScript modules without a build step.
register("@swc-node/register/esm", pathToFileURL("./"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "✗ Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local.\n" +
      "  Get the secret key from Supabase → Project Settings → API → 'secret' key.",
  );
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const { boats } = await import("../lib/data/dummy/boats.ts");
const { experiences } = await import("../lib/data/dummy/experiences.ts");
const { destinations } = await import("../lib/data/dummy/destinations.ts");
const { faqs } = await import("../lib/data/dummy/faqs.ts");
const { settings } = await import("../lib/data/dummy/settings.ts");

function snakeBoat(b) {
  return {
    slug: b.slug,
    name: b.name,
    tagline: b.tagline,
    description: b.description,
    long_description: b.longDescription,
    length_m: b.lengthM,
    guests: b.guests,
    cabins: b.cabins,
    type: b.type,
    brand: b.brand,
    build_year: b.buildYear,
    price_from: b.priceFrom,
    currency: b.currency,
    what_included: b.whatIncluded,
    specs: b.specs,
    gallery: b.gallery,
    hero_image: b.heroImage,
    pdf_url: b.pdfUrl,
    featured: b.featured,
    sort_order: b.sortOrder,
    is_published: b.isPublished,
    meta_title: b.metaTitle,
    meta_description: b.metaDescription,
  };
}

async function upsert(table, rows, conflictCol) {
  const { error, count } = await supabase
    .from(table)
    .upsert(rows, { onConflict: conflictCol, count: "exact" });
  if (error) {
    console.error(`✗ ${table}: ${error.message}`);
    process.exit(1);
  }
  console.log(`✓ ${table}: upserted ${count ?? rows.length} rows`);
}

console.log(`Seeding ${url}\n`);

await upsert("boats", boats.map(snakeBoat), "slug");

await upsert(
  "experiences",
  experiences.map((x) => ({
    slug: x.slug,
    title: x.title,
    intro: x.intro,
    body: x.body,
    hero_image: x.heroImage,
    sort_order: x.sortOrder,
    is_published: x.isPublished,
  })),
  "slug",
);

await upsert(
  "destinations",
  destinations.map((d) => ({
    slug: d.slug,
    title: d.title,
    intro: d.intro,
    body: d.body,
    hero_image: d.heroImage,
    gallery: d.gallery,
    highlights: d.highlights,
    is_published: d.isPublished,
  })),
  "slug",
);

await upsert(
  "faqs",
  faqs.map((f) => ({
    // Insert-only — faqs has no natural unique key. Use question for upsert idempotency.
    question: f.question,
    answer: f.answer,
    category: f.category,
    sort_order: f.sortOrder,
    is_published: f.isPublished,
  })),
  "question",
);

// site_settings is single-row, id=1
await upsert(
  "site_settings",
  [
    {
      id: 1,
      whatsapp_number: settings.whatsappNumber,
      whatsapp_default_message: settings.whatsappDefaultMessage,
      instagram_url: settings.instagramUrl,
      instagram_handle: settings.instagramHandle,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
      stats: settings.stats,
      hero_headline: settings.heroHeadline,
      hero_sub: settings.heroSub,
      testimonials: settings.testimonials,
    },
  ],
  "id",
);

console.log("\nDone. Set USE_SUPABASE=true and restart the dev server.");
