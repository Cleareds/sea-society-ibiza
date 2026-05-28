"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { saveDestination, saveExperience } from "@/app/admin/actions";
import { initialPageBlockState, type SavePageBlockState } from "@/app/admin/actions-state";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MarkdownField } from "@/components/admin/MarkdownField";
import type { Destination, Experience } from "@/lib/data/types";

const FLASH_MS = 2000;

type Block =
  | { kind: "experience"; data?: Experience | null }
  | { kind: "destination"; data?: Destination | null };

interface Props {
  block: Block;
  editable: boolean;
}

export function PageBlockForm({ block, editable }: Props) {
  const router = useRouter();
  const action = block.kind === "experience" ? saveExperience : saveDestination;
  const [state, formAction] = useActionState<SavePageBlockState, FormData>(
    action,
    initialPageBlockState,
  );

  const initial = block.data;
  const [heroImage, setHeroImage] = React.useState<string>(initial?.heroImage ?? "");
  const [justSavedTick, setJustSavedTick] = React.useState(0);

  React.useEffect(() => {
    if (state.status !== "ok" || !state.savedAt) return;
    queueMicrotask(() => setJustSavedTick(state.savedAt!));
    const t = setTimeout(() => {
      setJustSavedTick(0);
      router.refresh();
    }, FLASH_MS);
    return () => clearTimeout(t);
  }, [state.status, state.savedAt, router]);

  const highlightsDefault =
    block.kind === "destination"
      ? ((initial as Destination | null | undefined)?.highlights ?? []).join("\n")
      : "";

  const exp = block.kind === "experience"
    ? (initial as Experience | null | undefined)
    : undefined;
  const galleryDefault = exp?.gallery
    ?.map((g) => (g.alt ? `${g.src} :: ${g.alt}` : g.src))
    .join("\n") ?? "";

  return (
    <form action={formAction} className="space-y-6">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="heroImage" value={heroImage} />

      <ImageUpload
        boatSlug={initial?.slug ?? block.kind}
        value={heroImage}
        onChange={setHeroImage}
        disabled={!editable}
        label="Hero image"
        previewClassName="aspect-[4/3]"
      />

      <fieldset className="grid gap-4 md:grid-cols-2" disabled={!editable}>
        <Field label="Title" name="title" defaultValue={initial?.title ?? ""} required />
        <Field label="Slug" name="slug" defaultValue={initial?.slug ?? ""} required />
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={(initial as Experience | null | undefined)?.sortOrder ?? 0} />
      </fieldset>

      <fieldset className="space-y-3" disabled={!editable}>
        <label className="block text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
          Intro (one or two sentences)
          <input
            name="intro"
            defaultValue={initial?.intro ?? ""}
            className="mt-2 h-11 w-full rounded-full border border-[var(--color-outline)] bg-transparent px-4 text-sm normal-case tracking-normal text-[var(--color-on-surface)] focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
          />
        </label>
        <MarkdownField name="body" defaultValue={initial?.body ?? ""} rows={14} />
        {block.kind === "experience" && (
          <>
            <label className="block text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
              Long description (markdown) — body of the detail page
              <MarkdownField
                name="longDescription"
                defaultValue={exp?.longDescription ?? ""}
                rows={10}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Duration (e.g. 3 hours)" name="duration" defaultValue={exp?.duration ?? ""} />
              <Field label="Group size (e.g. Up to 12)" name="groupSize" defaultValue={exp?.groupSize ?? ""} />
              <Field
                label="From price (EUR)"
                name="priceFrom"
                type="number"
                defaultValue={exp?.priceFrom ?? ""}
              />
            </div>
            <label className="block text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
              Gallery — one per line as <code className="normal-case">{`path :: alt`}</code>
              <textarea
                name="gallery"
                rows={4}
                defaultValue={galleryDefault}
                className="mt-2 w-full rounded-2xl border border-[var(--color-outline)] bg-transparent p-3 text-sm normal-case tracking-normal focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
                placeholder={"/sea-society/site/exp-day-trips-2.webp :: Anchored off Es Vedra\n/sea-society/site/exp-day-trips-3.webp :: Lunch on board"}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Meta title (SEO)" name="metaTitle" defaultValue={exp?.metaTitle ?? ""} />
              <Field label="Meta description (SEO)" name="metaDescription" defaultValue={exp?.metaDescription ?? ""} />
            </div>
          </>
        )}
        {block.kind === "destination" && (
          <label className="block text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
            Highlights (one per line)
            <textarea
              name="highlights"
              rows={5}
              defaultValue={highlightsDefault}
              className="mt-2 w-full rounded-2xl border border-[var(--color-outline)] bg-transparent p-3 text-sm normal-case tracking-normal focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
              placeholder={"S'Espalmador\nIlletes beach\nEs Caló & Beso Beach"}
            />
          </label>
        )}
      </fieldset>

      <fieldset className="flex flex-wrap gap-6" disabled={!editable}>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={initial?.isPublished ?? true}
          />
          Published
        </label>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton
          idleLabel={initial ? "Save changes" : "Create"}
          pendingLabel={initial ? "Saving…" : "Creating…"}
          justSaved={justSavedTick !== 0}
          disabled={!editable}
        />
        {state.status === "ok" && (
          <p role="status" aria-live="polite" className="text-sm text-[var(--color-primary)]">
            {state.message}
          </p>
        )}
        {state.status === "error" && (
          <p role="alert" aria-live="assertive" className="text-sm text-[var(--color-secondary)]">
            {state.message}
          </p>
        )}
      </div>

      {!editable && (
        <p className="text-xs text-[var(--color-on-surface-variant)]">
          Read-only — Supabase is not configured.
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
}) {
  return (
    <label className="block text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-2 h-11 w-full rounded-full border border-[var(--color-outline)] bg-transparent px-4 text-sm normal-case tracking-normal text-[var(--color-on-surface)] focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
      />
    </label>
  );
}
