import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BoatForm } from "../BoatForm";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getBoats } from "@/lib/data";

export const metadata: Metadata = {
  title: "Edit boat — Admin",
  robots: { index: false, follow: false },
};

export default async function EditBoatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const boats = await getBoats();
  const boat = boats.find((b) => b.id === id);
  if (!boat) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
          Edit
        </p>
        <h1 className="mt-2 font-serif text-4xl">{boat.name}</h1>
      </div>
      <BoatForm boat={boat} editable={isSupabaseConfigured()} />
    </div>
  );
}
