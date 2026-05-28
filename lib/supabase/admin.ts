/**
 * Service-role Supabase client. Bypasses RLS — only use from server
 * code that has already gated access with its own auth check (admin
 * server actions, cron-secret-protected API routes).
 *
 * Never expose the returned client to a request handler that runs
 * with anonymous trust (no auth gate). The service-role key reads
 * everything, including columns RLS would otherwise hide.
 */
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseSecretKey } from "./env";

let cached: ReturnType<typeof createClient> | null = null;

export function createSupabaseAdminClient() {
  if (cached) return cached;
  const url = supabaseUrl();
  const secret = supabaseSecretKey();
  if (!url || !secret) {
    throw new Error(
      "Supabase admin client needs NEXT_PUBLIC_SUPABASE_URL + " +
        "SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY).",
    );
  }
  cached = createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-client-info": "ssi-admin" } },
  });
  return cached;
}

export function adminClientAvailable(): boolean {
  return Boolean(supabaseUrl() && supabaseSecretKey());
}
