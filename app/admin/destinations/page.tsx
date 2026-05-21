import Link from "next/link";
import type { Metadata } from "next";
import { getAllDestinations } from "@/lib/data";
import { deleteDestination, toggleDestinationPublished } from "../actions";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Destinations — Admin",
  robots: { index: false, follow: false },
};

export default async function DestinationsAdminList() {
  const items = await getAllDestinations();
  const editable = isSupabaseConfigured();

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
            Content
          </p>
          <h1 className="mt-2 font-serif text-4xl">Destinations</h1>
        </div>
        <Link
          href="/admin/destinations/new"
          className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white"
        >
          + New destination
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-[var(--color-surface)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--color-outline-variant)]/40 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Pub.</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-outline-variant)]/30">
            {items.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-3">
                  <Link className="font-medium hover:text-[var(--color-primary)]" href={`/admin/destinations/${d.id}`}>
                    {d.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[var(--color-on-surface-variant)]">/{d.slug}</td>
                <td className="px-4 py-3">
                  {editable ? (
                    <form action={toggleDestinationPublished}>
                      <input type="hidden" name="id" value={d.id} />
                      <input type="hidden" name="next" value={String(!d.isPublished)} />
                      <button
                        type="submit"
                        className={`rounded-full px-3 py-1 text-xs ${
                          d.isPublished
                            ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                            : "bg-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]"
                        }`}
                      >
                        {d.isPublished ? "Live" : "Draft"}
                      </button>
                    </form>
                  ) : (
                    <span className="text-xs">{d.isPublished ? "Live" : "Draft"}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link className="text-xs underline" href={`/admin/destinations/${d.id}`}>
                    Edit
                  </Link>
                  {editable && (
                    <form action={deleteDestination} className="ml-2 inline">
                      <input type="hidden" name="id" value={d.id} />
                      <button type="submit" className="text-xs text-[var(--color-secondary)] underline">
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
