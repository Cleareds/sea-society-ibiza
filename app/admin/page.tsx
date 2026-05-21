import Link from "next/link";
import { getBoats } from "@/lib/data";
import { isSupabaseConfigured, createSupabaseServerClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Admin",
  robots: { index: false, follow: false },
};

async function recentEnquiries() {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("enquiries")
      .select("id,name,email,boat_id,handled,created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function AdminDashboard() {
  const [boats, enquiries] = await Promise.all([getBoats(), recentEnquiries()]);

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
          Overview
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[var(--color-on-surface)]">Dashboard</h1>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Boats published" value={String(boats.length)} />
        <Stat label="Featured" value={String(boats.filter((b) => b.featured).length)} />
        <Stat label="Recent enquiries" value={String(enquiries.length)} />
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl">Recent enquiries</h2>
          <Link href="/admin/enquiries" className="text-sm text-[var(--color-primary)] hover:underline">
            All enquiries →
          </Link>
        </div>
        {enquiries.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-on-surface-variant)]">
            None yet — or Supabase not configured.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--color-outline-variant)]/40 rounded-2xl bg-[var(--color-surface)]">
            {enquiries.map((e) => (
              <li key={e.id as string} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{e.name as string}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{e.email as string}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
                  {e.handled ? "Handled" : "New"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--color-surface)] p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
        {label}
      </p>
      <p className="mt-2 font-serif text-4xl text-[var(--color-on-surface)]">{value}</p>
    </div>
  );
}
