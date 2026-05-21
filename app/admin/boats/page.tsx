import Link from "next/link";
import type { Metadata } from "next";
import { getBoats } from "@/lib/data";
import { deleteBoat, toggleBoatPublished } from "../actions";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Boats — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminBoatsList() {
  const boats = await getBoats();
  const editable = isSupabaseConfigured();

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

      <div className="overflow-x-auto rounded-2xl bg-[var(--color-surface)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--color-outline-variant)]/40 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Brand</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">€/day</th>
              <th className="px-4 py-3 font-medium">Pub.</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-outline-variant)]/30">
            {boats.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3">
                  <Link className="font-medium hover:text-[var(--color-primary)]" href={`/admin/boats/${b.id}`}>
                    {b.name}
                  </Link>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">/{b.slug}</p>
                </td>
                <td className="px-4 py-3">{b.brand}</td>
                <td className="px-4 py-3 capitalize">{b.type.replace("_", " ")}</td>
                <td className="px-4 py-3">€{b.priceFrom.toLocaleString("en-GB")}</td>
                <td className="px-4 py-3">
                  {editable ? (
                    <form action={toggleBoatPublished}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="next" value={String(!b.isPublished)} />
                      <button
                        type="submit"
                        className={`rounded-full px-3 py-1 text-xs ${
                          b.isPublished
                            ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                            : "bg-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]"
                        }`}
                      >
                        {b.isPublished ? "Live" : "Draft"}
                      </button>
                    </form>
                  ) : (
                    <span className="text-xs">{b.isPublished ? "Live" : "Draft"}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link className="text-xs underline" href={`/admin/boats/${b.id}`}>
                    Edit
                  </Link>
                  {editable && (
                    <form action={deleteBoat} className="ml-2 inline">
                      <input type="hidden" name="id" value={b.id} />
                      <button
                        type="submit"
                        className="text-xs text-[var(--color-secondary)] underline"
                        formNoValidate
                      >
                        Delete
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
