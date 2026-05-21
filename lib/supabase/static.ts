/**
 * A Supabase client that doesn't touch cookies — safe to use from
 * `generateStaticParams`, sitemap.ts, and any other build-time context
 * where the request-scoped cookie store is unavailable.
 *
 * Uses the publishable (anon) key. RLS still applies. Suitable only
 * for reading published public data.
 */
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseCreds } from "./env";

let cached: ReturnType<typeof createClient> | null = null;

export function createSupabaseStaticClient() {
  if (cached) return cached;
  const { url, key } = requireSupabaseCreds();
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-client-info": "ssi-static" } },
  });
  return cached;
}
