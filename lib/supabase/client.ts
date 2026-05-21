import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseCreds } from "./env";

export function createSupabaseBrowserClient() {
  const { url, key } = requireSupabaseCreds();
  return createBrowserClient(url, key);
}
