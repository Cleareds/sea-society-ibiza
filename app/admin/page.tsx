import { getBoats } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboard() {
  const boats = await getBoats();

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
          Overview
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[var(--color-on-surface)]">Dashboard</h1>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <Stat label="Yachts published" value={String(boats.length)} />
        <Stat label="Featured" value={String(boats.filter((b) => b.featured).length)} />
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
