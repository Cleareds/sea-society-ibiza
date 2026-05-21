#!/usr/bin/env tsx
/**
 * Idempotent seed of the Supabase project with the dummy data the site
 * already serves in dummy mode. Run after the migration is applied.
 *
 *   pnpm tsx scripts/supabase-seed.ts
 *
 * Requires SUPABASE_SECRET_KEY in .env.local (bypasses RLS).
 */
import { config } from "dotenv";
import WebSocket from "ws";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { boats } from "../lib/data/dummy/boats";
import { experiences } from "../lib/data/dummy/experiences";
import { destinations } from "../lib/data/dummy/destinations";
import { faqs } from "../lib/data/dummy/faqs";
import { settings } from "../lib/data/dummy/settings";

if (!globalThis.WebSocket) {
  (globalThis as unknown as { WebSocket: typeof WebSocket }).WebSocket = WebSocket;
}

config({ path: ".env.local" });

async function upsert(
  supabase: SupabaseClient,
  table: string,
  rows: Record<string, unknown>[],
  conflictCol: string,
) {
  const { error, count } = await supabase
    .from(table)
    .upsert(rows, { onConflict: conflictCol, count: "exact" });
  if (error) {
    console.error(`✗ ${table}: ${error.message}`);
    process.exit(1);
  }
  console.log(`✓ ${table}: upserted ${count ?? rows.length} rows`);
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !secret) {
    console.error("✗ Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local.");
    process.exit(1);
  }

  const supabase = createClient(url, secret, { auth: { persistSession: false } });

  console.log(`Seeding ${url}\n`);

  await upsert(
    supabase,
    "boats",
    boats.map((b) => ({
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
    })),
    "slug",
  );

  await upsert(
    supabase,
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
    supabase,
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

  // faqs has no natural unique key. Wipe + reinsert for idempotency.
  {
    const { error: delErr } = await supabase
      .from("faqs")
      .delete()
      .gte("sort_order", -1); // matches every row
    if (delErr) {
      console.error(`✗ faqs (delete): ${delErr.message}`);
      process.exit(1);
    }
    const rows = faqs.map((f) => ({
      question: f.question,
      answer: f.answer,
      category: f.category,
      sort_order: f.sortOrder,
      is_published: f.isPublished,
    }));
    const { error: insErr, count } = await supabase
      .from("faqs")
      .insert(rows, { count: "exact" });
    if (insErr) {
      console.error(`✗ faqs (insert): ${insErr.message}`);
      process.exit(1);
    }
    console.log(`✓ faqs: inserted ${count ?? rows.length} rows`);
  }

  await upsert(
    supabase,
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

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
