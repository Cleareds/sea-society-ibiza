/**
 * Resolves Supabase credentials from the environment, accepting both the
 * legacy key names (anon / service_role) and Supabase's new 2025+ key names
 * (publishable / secret). Either set works.
 */

export function supabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function supabasePublishableKey(): string | undefined {
  // Prefer the new name; fall back to the legacy anon key.
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function supabaseSecretKey(): string | undefined {
  // Server-only. Used for seeding + admin writes.
  return process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function supabaseConfigured(): boolean {
  return Boolean(supabaseUrl() && supabasePublishableKey());
}

export function requireSupabaseCreds(): { url: string; key: string } {
  const url = supabaseUrl();
  const key = supabasePublishableKey();
  if (!url || !key) {
    throw new Error(
      "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or the legacy " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY), or run with USE_SUPABASE=false.",
    );
  }
  return { url, key };
}
