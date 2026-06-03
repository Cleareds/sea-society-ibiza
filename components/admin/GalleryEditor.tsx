"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, X } from "lucide-react";
import type { BoatGalleryImage } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface Props {
  /** Stable identifier used to namespace uploads (e.g. boat slug). */
  boatSlug?: string;
  /** Hidden-form-field name. The component serialises its state to a
   *  JSON string under this key so saveBoat can read it on the server. */
  name?: string;
  value: BoatGalleryImage[];
  onChange: (next: BoatGalleryImage[]) => void;
  disabled?: boolean;
  /** Supabase Storage bucket. Defaults to "boats" — same bucket as the
   *  hero ImageUpload, so a yacht's hero + gallery live side by side. */
  bucket?: string;
  /** Max images to allow. Defaults to 24 — generous; site renders all of them. */
  max?: number;
}

/**
 * Gallery curator for the boats admin form. Reorder with the up/down
 * arrows, remove with the × button, add with the upload tile at the
 * end of the strip. Images post to the existing
 * /api/admin/upload-image route, so storage + permissions match the
 * hero ImageUpload.
 *
 * The component renders a hidden <input> serialised to JSON so that the
 * <form action> handler picks it up alongside the other fields — no
 * extra Server Action needed.
 */
export function GalleryEditor({
  boatSlug,
  name = "gallery",
  value,
  onChange,
  disabled = false,
  bucket = "boats",
  max = 24,
}: Props) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFiles = async (files: FileList | File[]) => {
    setError(null);
    const list = Array.from(files);
    if (list.length === 0) return;
    if (value.length + list.length > max) {
      setError(`Gallery is capped at ${max} images.`);
      return;
    }
    for (const file of list) {
      if (!/^image\//.test(file.type)) {
        setError("Pick image files only.");
        continue;
      }
      if (file.size > 12 * 1024 * 1024) {
        setError("Images must be under 12 MB.");
        continue;
      }
    }
    setUploading(true);
    try {
      const uploaded: BoatGalleryImage[] = [];
      for (const file of list) {
        const fd = new FormData();
        fd.set("file", file);
        fd.set("bucket", bucket);
        fd.set("scope", `${boatSlug ?? "misc"}/gallery`);
        const res = await fetch("/api/admin/upload-image", {
          method: "POST",
          body: fd,
        });
        const body = (await res.json().catch(() => null)) as {
          url?: string;
          error?: string;
        } | null;
        if (!res.ok || !body?.url) throw new Error(body?.error ?? "Upload failed.");
        uploaded.push({ src: body.url, alt: "" });
      }
      onChange([...value, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = value.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved!);
    onChange(next);
  };

  const remove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const updateAlt = (idx: number, alt: string) => {
    onChange(value.map((img, i) => (i === idx ? { ...img, alt } : img)));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
          Gallery
        </p>
        <p className="text-[10px] tracking-[0.15em] uppercase text-[var(--color-on-surface-variant)]">
          {value.length} / {max}
        </p>
      </div>

      {/* Hidden serialised value — picked up by saveBoat on the server. */}
      <input type="hidden" name={name} value={JSON.stringify(value)} />

      {value.length === 0 && (
        <p className="rounded-2xl border border-dashed border-[var(--color-outline)] p-6 text-center text-sm text-[var(--color-on-surface-variant)]">
          No images yet — add the first one below. The order here is the
          order shown on the public yacht page.
        </p>
      )}

      {value.length > 0 && (
        <ol className="space-y-2">
          {value.map((img, i) => (
            <li
              key={img.src + i}
              className="flex items-center gap-3 rounded-2xl border border-[var(--color-outline-variant)]/40 bg-[var(--color-surface)] p-2 pr-3"
            >
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--color-surface-container)] px-2 text-[10px] font-medium tracking-[0.1em] uppercase text-[var(--color-on-surface-variant)]">
                {i + 1}
              </span>

              {/* Thumbnail */}
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface-container)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt || `Gallery image ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Alt text field */}
              <input
                type="text"
                value={img.alt}
                onChange={(e) => updateAlt(i, e.target.value)}
                disabled={disabled}
                placeholder="Alt text (optional)"
                aria-label={`Alt text for image ${i + 1}`}
                className="h-9 min-w-0 flex-1 rounded-full border border-[var(--color-outline)] bg-transparent px-3 text-xs normal-case tracking-normal focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
              />

              {/* Reorder + remove controls */}
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={disabled || i === 0}
                  aria-label={`Move image ${i + 1} up`}
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)]",
                    "disabled:opacity-30 disabled:hover:bg-transparent",
                  )}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={disabled || i === value.length - 1}
                  aria-label={`Move image ${i + 1} down`}
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)]",
                    "disabled:opacity-30 disabled:hover:bg-transparent",
                  )}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  disabled={disabled}
                  aria-label={`Remove image ${i + 1}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-on-surface-variant)] hover:bg-[var(--color-error-container,#fdecec)] hover:text-[var(--color-error,#b3261e)] disabled:opacity-30"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="flex items-center gap-3">
        <label
          className={cn(
            "inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[var(--color-outline)] px-4 text-xs uppercase tracking-[0.2em]",
            (disabled || uploading || value.length >= max) &&
              "cursor-not-allowed opacity-50",
          )}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Plus className="h-4 w-4" aria-hidden />
          )}
          <span>{uploading ? "Uploading…" : "Add image(s)"}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={disabled || uploading || value.length >= max}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files;
              if (f) void handleFiles(f);
            }}
          />
        </label>
        {error && (
          <p role="alert" className="text-xs text-[var(--color-secondary,#b3261e)]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
