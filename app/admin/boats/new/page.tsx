import type { Metadata } from "next";
import { BoatForm } from "../BoatForm";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "New boat — Admin",
  robots: { index: false, follow: false },
};

export default function NewBoatPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
          Boats
        </p>
        <h1 className="mt-2 font-serif text-4xl">New boat</h1>
      </div>
      <BoatForm editable={isSupabaseConfigured()} />
    </div>
  );
}
