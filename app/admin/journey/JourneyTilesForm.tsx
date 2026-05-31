"use client";

import * as React from "react";
import { useActionState } from "react";
import { saveJourneyImages } from "@/app/admin/actions";
import {
  initialJourneyImagesState,
  type SaveJourneyImagesState,
} from "@/app/admin/actions-state";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface Tile {
  src: string;
}

interface Props {
  tiles: Tile[];
}

/**
 * 18-slot grid editor for the "Follow our society" tile wall.
 *
 * Each slot reuses <ImageUpload /> — that gives admins:
 *   - Click to upload (Supabase Storage via /api/admin/upload-image).
 *   - Or paste a URL (Unsplash, /public path, etc.).
 *   - Live preview of the current image.
 *   - Remove (clears the slot — public site falls back to its default).
 *
 * Save button submits all 18 URLs to saveJourneyImages, which upserts
 * site_settings.journey_images as a JSONB array.
 */
export function JourneyTilesForm({ tiles }: Props) {
  const [state, formAction] = useActionState<SaveJourneyImagesState, FormData>(
    saveJourneyImages,
    initialJourneyImagesState,
  );

  // Local state mirrors form so previews update before save.
  const [urls, setUrls] = React.useState<string[]>(() => tiles.map((t) => t.src));

  const update = (i: number, src: string) =>
    setUrls((prev) => prev.map((u, idx) => (idx === i ? src : u)));

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {urls.map((src, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[var(--color-outline-variant)]/40 bg-[var(--color-surface)] p-4"
          >
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
              Tile {String(i + 1).padStart(2, "0")}
              {i >= 6 && (
                <span className="ml-2 rounded-full bg-[var(--color-surface-container)] px-2 py-0.5 text-[9px]">
                  desktop only
                </span>
              )}
            </p>
            <ImageUpload
              boatSlug={`journey-${i + 1}`}
              bucket="boats"
              label=""
              previewClassName="aspect-square"
              value={src}
              onChange={(next) => update(i, next)}
            />
            <input type="hidden" name={`tile_${i}`} value={src} />
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 -mx-5 flex items-center justify-between gap-4 border-t border-[var(--color-outline-variant)]/40 bg-[var(--color-surface)] px-5 py-4 md:-mx-10 md:px-10">
        <p
          aria-live="polite"
          className={
            state.status === "ok"
              ? "text-sm text-[var(--color-primary)]"
              : state.status === "error"
              ? "text-sm text-[var(--color-secondary)]"
              : "text-xs text-[var(--color-on-surface-variant)]"
          }
        >
          {state.status === "ok"
            ? state.message ?? "Saved."
            : state.status === "error"
            ? state.message ?? "Save failed."
            : "Tiles 1–6 also show on mobile."}
        </p>
        <SubmitButton idleLabel="Save tiles" justSaved={state.status === "ok"} />
      </div>
    </form>
  );
}
