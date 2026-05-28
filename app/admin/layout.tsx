import Link from "next/link";
import { cookies } from "next/headers";
import { logout } from "./actions";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { Logo } from "@/components/site/Logo";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/boats", label: "Boats" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/experiences", label: "Experiences" },
  { href: "/admin/destinations", label: "Destinations" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/integrations", label: "Integrations" },
  { href: "/admin/settings", label: "Settings" },
];

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabaseOn = isSupabaseConfigured();
  const isDevMock = (await cookies()).get("ssi-dev-admin")?.value === "1";

  return (
    <div className="min-h-screen bg-[var(--color-surface-container-low)]">
      {!supabaseOn && (
        <div className="bg-[var(--color-secondary)] px-4 py-2 text-center text-xs uppercase tracking-[0.15em] text-white">
          Read-only — Supabase is not configured. Set USE_SUPABASE=true + supabase env vars to enable writes.
        </div>
      )}
      <div className="mx-auto flex max-w-(--spacing-container-max)">
        <aside className="hidden w-60 shrink-0 border-r border-[var(--color-outline-variant)] bg-[var(--color-surface)] md:block">
          <div className="border-b border-[var(--color-outline-variant)]/40 px-5 py-5">
            <Link href="/admin" className="block" aria-label="Sea Society Ibiza — admin home">
              <Logo variant="dark" height={22} alt="Sea Society Ibiza" />
            </Link>
            <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
              Admin
            </p>
          </div>
          <nav aria-label="Admin">
            <ul className="px-2 py-3 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="block rounded-md px-3 py-2 hover:bg-[var(--color-surface-container)]"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[var(--color-outline-variant)]/40 bg-[var(--color-surface)] px-5 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
              {supabaseOn ? "Supabase" : isDevMock ? "Dev mock" : "—"}
            </p>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-[var(--color-outline)] px-4 py-1 text-xs uppercase tracking-[0.15em] hover:bg-[var(--color-surface-container)]"
              >
                Sign out
              </button>
            </form>
          </header>
          <main className="flex-1 p-5 md:p-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
