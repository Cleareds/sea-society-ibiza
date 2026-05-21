#!/usr/bin/env node
/**
 * Quick connectivity check against the configured Supabase project.
 *   node scripts/supabase-check.mjs
 *
 * Reads from .env.local. Reports URL, key fingerprint, whether the
 * `boats` table exists, how many rows it sees. Useful right after
 * running the migration to confirm everything is reachable.
 */
import { config } from "dotenv";
import WebSocket from "ws";

// supabase-js 2.x's RealtimeClient touches globalThis.WebSocket at import
// time even though we never use realtime here. Node 21 lacks a native
// WebSocket; polyfill before the supabase import.
if (!globalThis.WebSocket) globalThis.WebSocket = WebSocket;

const { createClient } = await import("@supabase/supabase-js");

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("✗ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

console.log("URL:    ", url);
console.log("Key:    ", key.slice(0, 14) + "…" + key.slice(-6));

const supabase = createClient(url, key);

const TABLES = ["boats", "experiences", "destinations", "faqs", "enquiries", "site_settings"];

let allOk = true;
for (const t of TABLES) {
  // Use a regular GET (no head:true) so PGRST205 surfaces as a real error
  // instead of being swallowed by the count path.
  const { data, count, error } = await supabase
    .from(t)
    .select("*", { count: "exact" })
    .limit(1);
  if (error) {
    allOk = false;
    console.log(`✗ ${t.padEnd(15)} ${error.code ?? ""} ${error.message}`);
  } else {
    console.log(`✓ ${t.padEnd(15)} ${count ?? data?.length ?? 0} rows`);
  }
}

if (!allOk) {
  console.log(
    "\nIf you see 'relation does not exist' errors, apply the migration first:\n" +
      "  → Supabase Dashboard → SQL Editor → paste supabase/migrations/0001_init.sql → Run\n",
  );
  process.exit(1);
}
