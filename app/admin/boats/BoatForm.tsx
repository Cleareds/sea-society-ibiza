import { saveBoat } from "../actions";
import type { Boat } from "@/lib/data/types";

interface Props {
  boat?: Boat | null;
  editable: boolean;
}

const TYPES = ["motor_yacht", "sailing_yacht", "catamaran", "day_boat", "sport_yacht"] as const;

export function BoatForm({ boat, editable }: Props) {
  return (
    <form action={saveBoat} className="space-y-6">
      {boat?.id && <input type="hidden" name="id" value={boat.id} />}

      <fieldset className="grid gap-4 md:grid-cols-2" disabled={!editable}>
        <Field label="Name" name="name" defaultValue={boat?.name ?? ""} required />
        <Field label="Slug" name="slug" defaultValue={boat?.slug ?? ""} required />
        <Field label="Tagline" name="tagline" defaultValue={boat?.tagline ?? ""} />
        <Field label="Brand" name="brand" defaultValue={boat?.brand ?? ""} />
        <Field label="Length (m)" name="lengthM" type="number" step="0.1" defaultValue={boat?.lengthM ?? ""} />
        <Field label="Guests" name="guests" type="number" defaultValue={boat?.guests ?? ""} />
        <Field label="Cabins" name="cabins" type="number" defaultValue={boat?.cabins ?? ""} />
        <Field label="Build year" name="buildYear" type="number" defaultValue={boat?.buildYear ?? ""} />
        <Field label="Price from (EUR)" name="priceFrom" type="number" defaultValue={boat?.priceFrom ?? ""} />
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={boat?.sortOrder ?? 0} />

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

        <Field label="Hero image URL" name="heroImage" defaultValue={boat?.heroImage ?? ""} />
      </fieldset>

      <fieldset className="space-y-3" disabled={!editable}>
        <label className="block text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
          Description
          <textarea
            name="description"
            rows={3}
            defaultValue={boat?.description ?? ""}
            className="mt-2 w-full rounded-2xl border border-[var(--color-outline)] bg-transparent p-3 text-sm normal-case tracking-normal focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
          Long description
          <textarea
            name="longDescription"
            rows={6}
            defaultValue={boat?.longDescription ?? ""}
            className="mt-2 w-full rounded-2xl border border-[var(--color-outline)] bg-transparent p-3 text-sm normal-case tracking-normal focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
          />
        </label>
      </fieldset>

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

      <button
        type="submit"
        disabled={!editable}
        className="rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {boat ? "Save changes" : "Create boat"}
      </button>

      {!editable && (
        <p className="text-xs text-[var(--color-on-surface-variant)]">
          Read-only — Supabase is not configured. Set USE_SUPABASE=true with credentials to enable saves.
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
