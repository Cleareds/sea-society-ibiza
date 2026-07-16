import Link from "next/link";
import type { Metadata } from "next";
import { getBoats } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { BoatsSortable, type BoatRow } from "./BoatsSortable";

export const metadata: Metadata = {
  title: "Boats — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminBoatsList() {
  const boats = await getBoats();
  const editable = isSupabaseConfigured();
  const rows: BoatRow[] = boats.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    brand: b.brand,
    type: b.type,
    priceFrom: b.priceFrom,
    isPublished: b.isPublished,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
            Fleet
          </p>
          <h1 className="mt-2 font-serif text-4xl">Boats</h1>
        </div>
        <Link
          href="/admin/boats/new"
          className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white"
        >
          + New boat
        </Link>
      </div>

      <BoatsSortable boats={rows} editable={editable} />
    </div>
  );
}
