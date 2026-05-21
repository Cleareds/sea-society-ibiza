import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageBlockForm } from "@/components/admin/PageBlockForm";
import { getDestinationById } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit destination — Admin",
  robots: { index: false, follow: false },
};

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = await getDestinationById(id);
  if (!destination) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
          Edit
        </p>
        <h1 className="mt-2 font-serif text-4xl">{destination.title}</h1>
      </div>
      <PageBlockForm block={{ kind: "destination", data: destination }} editable={isSupabaseConfigured()} />
    </div>
  );
}
