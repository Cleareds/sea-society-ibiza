import type { Metadata } from "next";
import Link from "next/link";
import { devMockSignIn, sendMagicLink } from "../actions";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const sp = await searchParams;
  const supabaseOn = isSupabaseConfigured();

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--color-surface-container-low)] px-5">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-outline-variant)]/40 bg-[var(--color-surface)] p-8">
        <Link href="/" className="block">
          <p className="font-serif text-2xl text-[var(--color-primary)]">Sea Society Ibiza</p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
            Admin
          </p>
        </Link>

        {sp.error && (
          <p role="alert" className="mt-4 rounded-md bg-[var(--color-error)]/10 px-3 py-2 text-sm text-[var(--color-error)]">
            {sp.error === "supabase_not_configured"
              ? "Supabase is not configured. Use the dev sign-in below."
              : sp.error === "mock_disabled"
                ? "Dev mock sign-in is only available in development."
                : sp.error === "unauthorized"
                  ? "That email is not on the ADMIN_EMAILS whitelist."
                  : sp.error}
          </p>
        )}
        {sp.sent && (
          <p role="status" className="mt-4 rounded-md bg-[var(--color-primary)]/10 px-3 py-2 text-sm text-[var(--color-primary)]">
            Magic link sent. Check your inbox.
          </p>
        )}

        {supabaseOn ? (
          <form action={sendMagicLink} className="mt-6 space-y-4">
            <label className="block text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
              Email
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="mt-2 h-11 w-full rounded-full border border-[var(--color-outline)] bg-transparent px-4 text-sm focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
              />
            </label>
            <button
              type="submit"
              className="h-11 w-full rounded-full bg-[var(--color-primary)] text-sm font-medium text-white"
            >
              Send magic link
            </button>
          </form>
        ) : (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              Supabase is not configured. In development you can sign in with the dev mock.
            </p>
            <form action={devMockSignIn}>
              <button
                type="submit"
                className="h-11 w-full rounded-full bg-[var(--color-primary)] text-sm font-medium text-white"
              >
                Dev sign-in
              </button>
            </form>
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              In production this falls through to the unauthenticated redirect.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
