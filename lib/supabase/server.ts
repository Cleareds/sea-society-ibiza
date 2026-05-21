import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { requireSupabaseCreds, supabaseConfigured } from "./env";

export async function createSupabaseServerClient() {
  const { url, key } = requireSupabaseCreds();
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (entries) => {
        try {
          entries.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // ignored when called from a Server Component
        }
      },
    },
  });
}

export function isSupabaseConfigured() {
  return supabaseConfigured();
}
