import type { Metadata } from "next";
import { PageBlockForm } from "@/components/admin/PageBlockForm";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "New destination — Admin",
  robots: { index: false, follow: false },
};

export default function NewDestinationPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
          Destinations
        </p>
        <h1 className="mt-2 font-serif text-4xl">New destination</h1>
      </div>
      <PageBlockForm block={{ kind: "destination" }} editable={isSupabaseConfigured()} />
    </div>
  );
}
