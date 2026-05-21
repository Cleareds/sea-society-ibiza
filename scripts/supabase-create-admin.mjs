#!/usr/bin/env node
/**
 * Idempotently create (or update the password of) an admin user in
 * Supabase Auth. Uses the secret key.
 *
 *   node scripts/supabase-create-admin.mjs <email> <password>
 *   # or pulls from $ADMIN_EMAIL / $ADMIN_PASSWORD env vars
 *
 * Requires SUPABASE_SECRET_KEY in .env.local.
 */
import { config } from "dotenv";
import WebSocket from "ws";

if (!globalThis.WebSocket) globalThis.WebSocket = WebSocket;

const { createClient } = await import("@supabase/supabase-js");

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2] ?? process.env.ADMIN_EMAIL;
const password = process.argv[3] ?? process.env.ADMIN_PASSWORD;

if (!url || !secret) {
  console.error("✗ Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local.");
  process.exit(1);
}
if (!email || !password) {
  console.error("✗ Usage: node scripts/supabase-create-admin.mjs <email> <password>");
  process.exit(1);
}

const supabase = createClient(url, secret, { auth: { persistSession: false } });

// Look up by email (paginate through the admin list).
let existing = null;
let page = 1;
const perPage = 200;
while (true) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
  if (error) {
    console.error("✗ listUsers:", error.message);
    process.exit(1);
  }
  existing = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (existing) break;
  if (data.users.length < perPage) break;
  page += 1;
}

if (existing) {
  const { error } = await supabase.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("✗ updateUserById:", error.message);
    process.exit(1);
  }
  console.log(`✓ updated existing user (${existing.id}) — ${email}`);
} else {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("✗ createUser:", error.message);
    process.exit(1);
  }
  console.log(`✓ created user (${data.user.id}) — ${email}`);
}

console.log("\nMake sure this email is in ADMIN_EMAILS in .env.local + Vercel env.");
