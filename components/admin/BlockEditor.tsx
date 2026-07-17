"use client";

import * as React from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { BLOCK_CATALOG, BLOCK_FIELDS } from "@/lib/experiences/blocks";
import type { ExperienceBlockType } from "@/lib/data/types";

const LOCALES = ["en", "es", "fr", "nl"] as const;
type Lc = (typeof LOCALES)[number];

type LocalizedField = "text" | "alt" | "caption" | "attribution";

interface Block {
  id: string;
  type: ExperienceBlockType;
  text?: Partial<Record<Lc, string>>;
  src?: string;
  alt?: Partial<Record<Lc, string>>;
  caption?: Partial<Record<Lc, string>>;
  attribution?: Partial<Record<Lc, string>>;
}

const FIELD_LABEL: Record<LocalizedField, string> = {
  text: "Text",
  alt: "Alt text",
  caption: "Caption",
  attribution: "Attribution",
};

function newId(index: number) {
  // Client-only; crypto is available in the browser.
  return `blk-${index}-${crypto.randomUUID().slice(0, 8)}`;
}

/**
 * Block-based content editor for experiences. Add / drag-reorder / edit /
 * delete blocks; text fields are edited per-language via the locale tabs.
 * Serialises to a hidden input (JSON) submitted with the experience form.
 */
export function BlockEditor({
  name,
  defaultValue,
  slug,
  disabled = false,
}: {
  name: string;
  defaultValue?: Block[];
  slug?: string;
  disabled?: boolean;
}) {
  const [blocks, setBlocks] = React.useState<Block[]>(defaultValue ?? []);
  const [lc, setLc] = React.useState<Lc>("en");
  const [dragId, setDragId] = React.useState<string | null>(null);

  const update = (id: string, patch: (b: Block) => Block) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? patch(b) : b)));

  const setText = (id: string, field: LocalizedField, value: string) =>
    update(id, (b) => ({ ...b, [field]: { ...(b[field] ?? {}), [lc]: value } }));

  const addBlock = (type: ExperienceBlockType) =>
    setBlocks((prev) => [...prev, { id: newId(prev.length), type }]);

  const removeBlock = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id));

  function onDragEnter(overId: string) {
    if (!dragId || dragId === overId) return;
    setBlocks((prev) => {
      const from = prev.findIndex((b) => b.id === dragId);
      const to = prev.findIndex((b) => b.id === overId);
      if (from === -1 || to === -1) return prev;
      const next = prev.slice();
      const [moved] = next.splice(from, 1);
      if (!moved) return prev;
      next.splice(to, 0, moved);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={JSON.stringify(blocks)} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full border border-[var(--color-outline)] p-1">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLc(l)}
              className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.15em] ${
                lc === l
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-on-surface-variant)]"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--color-on-surface-variant)]">
          Editing <strong>{lc.toUpperCase()}</strong> — non-English falls back to English when blank.
        </p>
      </div>

      <ul className="space-y-3">
        {blocks.map((b) => (
          <li
            key={b.id}
            draggable={!disabled}
            onDragStart={() => setDragId(b.id)}
            onDragEnter={() => onDragEnter(b.id)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={() => setDragId(null)}
            className={`rounded-2xl border border-[var(--color-outline-variant)]/50 bg-[var(--color-surface)] p-4 ${
              dragId === b.id ? "opacity-50" : ""
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
                <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing" aria-hidden />
                {b.type}
              </span>
              <button
                type="button"
                onClick={() => removeBlock(b.id)}
                disabled={disabled}
                className="inline-flex items-center gap-1 text-xs text-[var(--color-secondary)] hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>

            {BLOCK_FIELDS[b.type].hasImage && (
              <div className="mb-3">
                <ImageUpload
                  boatSlug={slug ?? "experience"}
                  value={b.src ?? ""}
                  onChange={(url) => update(b.id, (x) => ({ ...x, src: url }))}
                  disabled={disabled}
                  bucket="experiences"
                  label="Image"
                  previewClassName="aspect-[16/9]"
                />
              </div>
            )}

            {BLOCK_FIELDS[b.type].localizedText.map((field) => (
              <label
                key={field}
                className="mb-2 block text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]"
              >
                {FIELD_LABEL[field]}
                {field === "text" && b.type !== "heading" ? (
                  <textarea
                    rows={b.type === "paragraph" ? 5 : 3}
                    value={b[field]?.[lc] ?? ""}
                    onChange={(e) => setText(b.id, field, e.target.value)}
                    disabled={disabled}
                    className="mt-1 w-full rounded-xl border border-[var(--color-outline)] bg-transparent p-3 text-sm normal-case tracking-normal text-[var(--color-on-surface)] focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={b[field]?.[lc] ?? ""}
                    onChange={(e) => setText(b.id, field, e.target.value)}
                    disabled={disabled}
                    className="mt-1 h-10 w-full rounded-full border border-[var(--color-outline)] bg-transparent px-4 text-sm normal-case tracking-normal text-[var(--color-on-surface)] focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
                  />
                )}
              </label>
            ))}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2">
        {BLOCK_CATALOG.map((c) => (
          <button
            key={c.type}
            type="button"
            onClick={() => addBlock(c.type)}
            disabled={disabled}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--color-outline)] px-3 py-1.5 text-xs hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            <Plus className="h-3.5 w-3.5" /> {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
