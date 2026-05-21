import type { Metadata } from "next";
import { markEnquiryHandled } from "../actions";
import { isSupabaseConfigured, createSupabaseServerClient } from "@/lib/supabase/server";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const metadata: Metadata = {
  title: "Enquiries — Admin",
  robots: { index: false, follow: false },
};

interface EnquiryRow {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  dates?: string | null;
  group_size?: number | null;
  message?: string | null;
  handled: boolean;
  created_at: string;
}

async function loadEnquiries(filter: "all" | "new" | "handled"): Promise<EnquiryRow[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    let q = supabase.from("enquiries").select("*").order("created_at", { ascending: false });
    if (filter === "new") q = q.eq("handled", false);
    if (filter === "handled") q = q.eq("handled", true);
    const { data } = await q;
    return (data ?? []) as EnquiryRow[];
  }

  // Dummy: read /tmp/ssi-enquiries.json
  try {
    const raw = await fs.readFile(join(tmpdir(), "ssi-enquiries.json"), "utf8");
    const items = JSON.parse(raw) as Array<{
      name: string;
      email: string;
      phone?: string;
      dates?: string;
      groupSize?: number;
      message?: string;
      receivedAt: string;
    }>;
    return items.map((it, i) => ({
      id: `dummy-${i}`,
      name: it.name,
      email: it.email,
      phone: it.phone ?? null,
      dates: it.dates ?? null,
      group_size: it.groupSize ?? null,
      message: it.message ?? null,
      handled: false,
      created_at: it.receivedAt,
    }));
  } catch {
    return [];
  }
}

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: "new" | "handled" | "all" }>;
}) {
  const sp = await searchParams;
  const filter = sp.filter ?? "all";
  const items = await loadEnquiries(filter);

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
            Inbox
          </p>
          <h1 className="mt-2 font-serif text-4xl">Enquiries</h1>
        </div>
        <nav aria-label="Filter" className="flex gap-2 text-xs">
          {(["all", "new", "handled"] as const).map((f) => (
            <a
              key={f}
              href={f === "all" ? "/admin/enquiries" : `/admin/enquiries?filter=${f}`}
              className={`rounded-full px-3 py-1 ${
                filter === f
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]"
              }`}
            >
              {f}
            </a>
          ))}
        </nav>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-on-surface-variant)]">No enquiries yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((e) => (
            <li
              key={e.id}
              className="rounded-2xl bg-[var(--color-surface)] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{e.name}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">{e.email}</p>
                  <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
                    {new Date(e.created_at).toLocaleString("en-GB")}
                    {e.dates ? ` · ${e.dates}` : ""}
                    {e.group_size ? ` · ${e.group_size} guests` : ""}
                  </p>
                </div>
                {isSupabaseConfigured() && (
                  <form action={markEnquiryHandled}>
                    <input type="hidden" name="id" value={e.id} />
                    <input type="hidden" name="handled" value={String(!e.handled)} />
                    <button
                      type="submit"
                      className={`rounded-full px-3 py-1 text-xs ${
                        e.handled
                          ? "bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]"
                          : "bg-[var(--color-primary)] text-white"
                      }`}
                    >
                      {e.handled ? "Mark new" : "Mark handled"}
                    </button>
                  </form>
                )}
              </div>
              {e.message && (
                <p className="mt-3 whitespace-pre-line text-sm text-[var(--color-on-surface)]">
                  {e.message}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
