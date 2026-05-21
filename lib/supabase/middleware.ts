import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseUrl, supabasePublishableKey } from "./env";

/**
 * Used by /proxy.ts to attach a refreshed Supabase session to incoming
 * requests. No-op when Supabase isn't configured.
 */
export async function updateSession(request: NextRequest) {
  const url = supabaseUrl();
  const key = supabasePublishableKey();
  if (!url || !key) {
    return { response: NextResponse.next({ request }), user: null };
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (entries) => {
        entries.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        entries.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  return { response, user: data.user };
}
