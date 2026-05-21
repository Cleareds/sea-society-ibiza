import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Settings — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
          Site
        </p>
        <h1 className="mt-2 font-serif text-4xl">Settings & page copy</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--color-on-surface-variant)]">
          Brand contact details + the editable text on the About and Contact pages. The body
          fields render markdown — headings (##, ###), bold (**), italic (*), bullet lists
          (-) and links ([text](url)) all work.
        </p>
      </div>
      <SettingsForm settings={settings} editable={isSupabaseConfigured()} />
    </div>
  );
}
