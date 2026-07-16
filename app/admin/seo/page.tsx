import type { Metadata } from "next";
import { getAllPageSeo } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { savePageSeo } from "../actions";

export const metadata: Metadata = {
  title: "SEO — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Top-level pages whose meta title/description are editable here.
 *  Detail pages (boats, experiences, destinations) have their own per-record
 *  meta on their edit screens. */
const PAGES: Array<{ key: string; label: string; path: string }> = [
  { key: "home", label: "Home", path: "/" },
  { key: "fleet", label: "The Fleet", path: "/fleet" },
  { key: "destinations", label: "Destinations", path: "/destinations" },
  { key: "experiences", label: "Experiences", path: "/experiences" },
  { key: "about", label: "About", path: "/about" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "faq", label: "FAQ", path: "/faq" },
  { key: "journey", label: "Journey", path: "/journey" },
  { key: "privacy", label: "Privacy", path: "/privacy" },
  { key: "terms", label: "Terms", path: "/terms" },
];

const LOCALES: Array<{ code: string; label: string }> = [
  { code: "en", label: "English (default)" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "nl", label: "Nederlands" },
];

const inputCls =
  "mt-1 w-full rounded-xl border border-[var(--color-outline)] bg-transparent px-3 py-2 text-sm normal-case tracking-normal text-[var(--color-on-surface)] focus-visible:border-[var(--color-primary)] focus-visible:outline-none";

export default async function AdminSeo() {
  const editable = isSupabaseConfigured();
  const all = await getAllPageSeo();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
          Search
        </p>
        <h1 className="mt-2 font-serif text-4xl">Page SEO</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--color-on-surface-variant)]">
          Meta title &amp; description for the main pages, per language. Leave a
          field blank to use the page&rsquo;s built-in default. Boat, experience
          and destination pages have their own meta on each edit screen.
        </p>
      </div>

      {!editable && (
        <p className="rounded-xl bg-[var(--color-secondary)]/10 px-4 py-3 text-sm text-[var(--color-secondary)]">
          Editing is available once Supabase is connected.
        </p>
      )}

      <div className="space-y-3">
        {PAGES.map((page) => {
          const rec = all[page.key];
          const val = (lc: string, field: "title" | "description") => {
            if (lc === "en") {
              return field === "title" ? rec?.metaTitle ?? "" : rec?.metaDescription ?? "";
            }
            const o = rec?.i18n?.[lc];
            return (field === "title" ? o?.meta_title : o?.meta_description) ?? "";
          };
          const hasAny = Boolean(
            rec && (rec.metaTitle || rec.metaDescription || Object.keys(rec.i18n ?? {}).length),
          );
          return (
            <details
              key={page.key}
              className="overflow-hidden rounded-2xl bg-[var(--color-surface)]"
            >
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm">
                <span className="font-medium">
                  {page.label}
                  <span className="ml-2 text-xs text-[var(--color-on-surface-variant)]">
                    {page.path}
                  </span>
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    hasAny
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      : "bg-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]"
                  }`}
                >
                  {hasAny ? "Custom" : "Default"}
                </span>
              </summary>
              <form
                action={savePageSeo}
                className="space-y-5 border-t border-[var(--color-outline-variant)]/40 px-5 py-5"
              >
                <input type="hidden" name="pageKey" value={page.key} />
                {LOCALES.map((lc) => (
                  <div key={lc.code} className="space-y-2">
                    <p className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
                      {lc.label}
                    </p>
                    <label className="block">
                      <span className="text-xs text-[var(--color-on-surface-variant)]">
                        Meta title
                      </span>
                      <input
                        type="text"
                        name={`${lc.code}_title`}
                        defaultValue={val(lc.code, "title")}
                        maxLength={70}
                        disabled={!editable}
                        className={inputCls}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-[var(--color-on-surface-variant)]">
                        Meta description
                      </span>
                      <textarea
                        name={`${lc.code}_description`}
                        defaultValue={val(lc.code, "description")}
                        maxLength={180}
                        rows={2}
                        disabled={!editable}
                        className={inputCls}
                      />
                    </label>
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={!editable}
                  className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white disabled:opacity-40"
                >
                  Save {page.label}
                </button>
              </form>
            </details>
          );
        })}
      </div>
    </div>
  );
}
