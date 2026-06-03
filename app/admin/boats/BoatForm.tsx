"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { saveBoat } from "../actions";
import { initialSaveBoatState } from "../actions-state";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import type { Boat, BoatGalleryImage } from "@/lib/data/types";

interface Props {
  boat?: Boat | null;
  editable: boolean;
}

const TYPES = ["motor_yacht", "sailing_yacht", "catamaran", "day_boat", "sport_yacht"] as const;
const FLASH_MS = 2200;

export function BoatForm({ boat, editable }: Props) {
  const router = useRouter();
  const [state, formAction] = useActionState(saveBoat, initialSaveBoatState);

  const [justSavedTick, setJustSavedTick] = React.useState(0);
  const [heroImage, setHeroImage] = React.useState<string>(boat?.heroImage ?? "");
  const [gallery, setGallery] = React.useState<BoatGalleryImage[]>(boat?.gallery ?? []);

  // Flash the "Saved" affordance briefly after a successful save,
  // then refresh the route so dashboard counts + list pages update.
  React.useEffect(() => {
    if (state.status !== "ok" || !state.savedAt) return;
    queueMicrotask(() => setJustSavedTick(state.savedAt!));
    const t = setTimeout(() => {
      setJustSavedTick(0);
      router.refresh();
    }, FLASH_MS);
    return () => clearTimeout(t);
  }, [state.status, state.savedAt, router]);

  const justSaved = justSavedTick !== 0;

  return (
    <form action={formAction} className="space-y-10">
      {boat?.id && <input type="hidden" name="id" value={boat.id} />}
      <input type="hidden" name="heroImage" value={heroImage} />

      <ImageUpload
        boatSlug={boat?.slug}
        value={heroImage}
        onChange={setHeroImage}
        disabled={!editable}
      />

      {/* Basics ----------------------------------------------------- */}
      <Section title="Basics">
        <fieldset className="grid gap-4 md:grid-cols-2" disabled={!editable}>
          <Field label="Name" name="name" defaultValue={boat?.name ?? ""} required />
          <Field label="Slug" name="slug" defaultValue={boat?.slug ?? ""} required />
          <Field label="Tagline" name="tagline" defaultValue={boat?.tagline ?? ""} />
          <Field label="Brand" name="brand" defaultValue={boat?.brand ?? ""} />
          <Field label="Model name" name="modelName" defaultValue={boat?.modelName ?? ""} />
          <Field
            label="Base harbour"
            name="baseHarbour"
            defaultValue={boat?.baseHarbour ?? ""}
          />

          <label className="block text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
            Type
            <select
              name="type"
              defaultValue={boat?.type ?? "motor_yacht"}
              className="mt-2 h-11 w-full rounded-full border border-[var(--color-outline)] bg-transparent px-3 text-sm normal-case tracking-normal text-[var(--color-on-surface)] focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Sort order"
            name="sortOrder"
            type="number"
            defaultValue={boat?.sortOrder ?? 0}
          />
        </fieldset>
      </Section>

      {/* Technical specs -------------------------------------------- */}
      <Section
        title="Technical specs"
        hint="These power the on-page Specifications grid. Numeric only — engines / consumption are free text so they can read like the brochure (e.g. '2 × MTU, 2.800 hp')."
      >
        <fieldset className="grid gap-4 md:grid-cols-2" disabled={!editable}>
          <Field
            label="Length (m)"
            name="lengthM"
            type="number"
            step="0.01"
            defaultValue={boat?.lengthM ?? ""}
          />
          <Field
            label="Beam (m)"
            name="beamM"
            type="number"
            step="0.01"
            defaultValue={boat?.beamM ?? ""}
          />
          <Field label="Guests (day)" name="guests" type="number" defaultValue={boat?.guests ?? ""} />
          <Field
            label="Guests (night)"
            name="guestsNight"
            type="number"
            defaultValue={boat?.guestsNight ?? ""}
          />
          <Field label="Cabins" name="cabins" type="number" defaultValue={boat?.cabins ?? ""} />
          <Field label="Build year" name="buildYear" type="number" defaultValue={boat?.buildYear ?? ""} />
          <Field
            label="Refit year"
            name="refitYear"
            type="number"
            defaultValue={boat?.refitYear ?? ""}
          />
          <Field
            label="Cruise speed (kn)"
            name="cruiseKnots"
            type="number"
            defaultValue={boat?.cruiseKnots ?? ""}
          />
          <Field
            label="Max speed (kn)"
            name="maxKnots"
            type="number"
            defaultValue={boat?.maxKnots ?? ""}
          />
          <Field
            label="Engines"
            name="engines"
            defaultValue={boat?.engines ?? ""}
          />
          <Field
            label="Fuel consumption"
            name="consumption"
            defaultValue={boat?.consumption ?? ""}
          />
        </fieldset>
      </Section>

      {/* Pricing ---------------------------------------------------- */}
      <Section
        title="Pricing — day charter"
        hint="High season runs 20 June – 31 August. Both figures are pre-tax; VAT, fuel, APA and crew gratuity are excluded as per Ibimar's pricing list."
      >
        <fieldset className="grid gap-4 md:grid-cols-2" disabled={!editable}>
          <Field
            label="Low season (EUR / day)"
            name="priceFrom"
            type="number"
            defaultValue={boat?.priceFrom ?? ""}
          />
          <Field
            label="High season (EUR / day)"
            name="priceHigh"
            type="number"
            defaultValue={boat?.priceHigh ?? ""}
          />
        </fieldset>
      </Section>

      {/* Copy ------------------------------------------------------- */}
      <Section title="Copy">
        <fieldset className="space-y-3" disabled={!editable}>
          <TextArea
            label="Description"
            name="description"
            rows={3}
            defaultValue={boat?.description ?? ""}
          />
          <TextArea
            label="Long description"
            name="longDescription"
            rows={6}
            defaultValue={boat?.longDescription ?? ""}
          />
          <TextArea
            label="What's included — one item per line"
            name="whatIncludedRaw"
            rows={6}
            defaultValue={(boat?.whatIncluded ?? []).join("\n")}
          />
        </fieldset>
      </Section>

      {/* Structured grids ------------------------------------------- */}
      <Section
        title="Specs grid + highlights"
        hint="JSON only — these power the icon strip under the hero and the labelled spec list on the yacht page. Use the existing yachts as a template."
      >
        <fieldset className="space-y-3" disabled={!editable}>
          <TextArea
            label='specs — JSON array of { "label", "value" }'
            name="specsRaw"
            rows={10}
            defaultValue={JSON.stringify(boat?.specs ?? [], null, 2)}
            monospace
          />
          <TextArea
            label='highlights — JSON array of { "icon", "label", "value" } (max 5 shown)'
            name="highlightsRaw"
            rows={8}
            defaultValue={JSON.stringify(boat?.highlights ?? [], null, 2)}
            monospace
          />
        </fieldset>
      </Section>

      {/* Gallery ---------------------------------------------------- */}
      <Section
        title="Gallery"
        hint="The order here is exactly the order shown on the public yacht page — first image is the large hero in the lightbox grid."
      >
        <GalleryEditor
          boatSlug={boat?.slug}
          value={gallery}
          onChange={setGallery}
          disabled={!editable}
        />
      </Section>

      {/* SEO -------------------------------------------------------- */}
      <Section title="SEO meta">
        <fieldset className="grid gap-4" disabled={!editable}>
          <Field
            label="Meta title"
            name="metaTitle"
            defaultValue={boat?.metaTitle ?? ""}
          />
          <TextArea
            label="Meta description"
            name="metaDescription"
            rows={3}
            defaultValue={boat?.metaDescription ?? ""}
          />
        </fieldset>
      </Section>

      {/* Status ----------------------------------------------------- */}
      <Section title="Publishing">
        <fieldset className="flex flex-wrap gap-6" disabled={!editable}>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isPublished" defaultChecked={boat?.isPublished ?? true} />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={boat?.featured ?? false} />
            Featured on homepage
          </label>
        </fieldset>
      </Section>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton
          idleLabel={boat ? "Save changes" : "Create yacht"}
          pendingLabel={boat ? "Saving…" : "Creating…"}
          justSaved={justSaved}
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
          Read-only — Supabase is not configured. Set USE_SUPABASE=true with credentials to enable
          saves.
        </p>
      )}
    </form>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-3xl border border-[var(--color-outline-variant)]/40 bg-[var(--color-surface)] p-5 md:p-6">
      <header>
        <h2 className="font-serif text-xl text-[var(--color-on-surface)]">{title}</h2>
        {hint && (
          <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">{hint}</p>
        )}
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  step?: string;
}) {
  return (
    <label className="block text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
      {label}
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        defaultValue={defaultValue}
        className="mt-2 h-11 w-full rounded-full border border-[var(--color-outline)] bg-transparent px-4 text-sm normal-case tracking-normal text-[var(--color-on-surface)] focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  rows = 4,
  defaultValue,
  monospace,
}: {
  label: string;
  name: string;
  rows?: number;
  defaultValue?: string;
  monospace?: boolean;
}) {
  return (
    <label className="block text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
      {label}
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className={`mt-2 w-full rounded-2xl border border-[var(--color-outline)] bg-transparent p-3 text-sm normal-case tracking-normal focus-visible:border-[var(--color-primary)] focus-visible:outline-none ${
          monospace ? "font-mono text-xs" : ""
        }`}
      />
    </label>
  );
}
