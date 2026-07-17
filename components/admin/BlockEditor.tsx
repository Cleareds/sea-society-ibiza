"use client";

import * as React from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { BLOCK_CATALOG, BLOCK_FIELDS, MAX_COLUMNS } from "@/lib/experiences/blocks";
import type { ExperienceBlockType } from "@/lib/data/types";

const LOCALES = ["en", "es", "fr", "nl"] as const;
type Lc = (typeof LOCALES)[number];

type LocalizedField = "text" | "alt" | "caption" | "attribution";
type LocalizedMap = Partial<Record<Lc, string>>;

interface Column {
  id: string;
  kind: "text" | "image";
  text?: LocalizedMap;
  src?: string;
  alt?: LocalizedMap;
  caption?: LocalizedMap;
}

interface Block {
  id: string;
  type: ExperienceBlockType;
  text?: LocalizedMap;
  src?: string;
  alt?: LocalizedMap;
  caption?: LocalizedMap;
  attribution?: LocalizedMap;
  columns?: Column[];
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
    setBlocks((prev) => [
      ...prev,
      type === "columns"
        ? {
            id: newId(prev.length),
            type,
            columns: [
              { id: newId(prev.length * 10 + 1), kind: "text" as const },
              { id: newId(prev.length * 10 + 2), kind: "text" as const },
            ],
          }
        : { id: newId(prev.length), type },
    ]);

  const removeBlock = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id));

  // ---- columns helpers ----
  const patchColumn = (blockId: string, colId: string, patch: (c: Column) => Column) =>
    update(blockId, (b) => ({
      ...b,
      columns: (b.columns ?? []).map((c) => (c.id === colId ? patch(c) : c)),
    }));

  const setColText = (blockId: string, colId: string, field: "text" | "alt" | "caption", value: string) =>
    patchColumn(blockId, colId, (c) => ({ ...c, [field]: { ...(c[field] ?? {}), [lc]: value } }));

  const addColumn = (blockId: string) =>
    update(blockId, (b) => {
      const cols = b.columns ?? [];
      if (cols.length >= MAX_COLUMNS) return b;
      return { ...b, columns: [...cols, { id: newId(cols.length + 1), kind: "text" }] };
    });

  const removeColumn = (blockId: string, colId: string) =>
    update(blockId, (b) => ({ ...b, columns: (b.columns ?? []).filter((c) => c.id !== colId) }));

  const setColKind = (blockId: string, colId: string, kind: "text" | "image") =>
    patchColumn(blockId, colId, (c) => ({ ...c, kind }));

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

            {b.type === "columns" && (
              <div className="space-y-3">
                <div
                  className={`grid gap-3 ${
                    (b.columns?.length ?? 0) >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
                  }`}
                >
                  {(b.columns ?? []).map((col) => (
                    <div
                      key={col.id}
                      className="rounded-xl border border-[var(--color-outline-variant)]/50 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex gap-1 rounded-full border border-[var(--color-outline)] p-0.5">
                          {(["text", "image"] as const).map((k) => (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setColKind(b.id, col.id, k)}
                              disabled={disabled}
                              className={`rounded-full px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.1em] ${
                                col.kind === k
                                  ? "bg-[var(--color-primary)] text-white"
                                  : "text-[var(--color-on-surface-variant)]"
                              }`}
                            >
                              {k}
                            </button>
                          ))}
                        </div>
                        {(b.columns?.length ?? 0) > 1 && (
                          <button
                            type="button"
                            onClick={() => removeColumn(b.id, col.id)}
                            disabled={disabled}
                            className="text-[var(--color-secondary)]"
                            aria-label="Remove column"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      {col.kind === "image" ? (
                        <div className="space-y-2">
                          <ImageUpload
                            boatSlug={slug ?? "experience"}
                            value={col.src ?? ""}
                            onChange={(url) => patchColumn(b.id, col.id, (c) => ({ ...c, src: url }))}
                            disabled={disabled}
                            bucket="experiences"
                            label="Image"
                            previewClassName="aspect-[4/3]"
                          />
                          <input
                            type="text"
                            placeholder="Alt text"
                            value={col.alt?.[lc] ?? ""}
                            onChange={(e) => setColText(b.id, col.id, "alt", e.target.value)}
                            disabled={disabled}
                            className="h-9 w-full rounded-full border border-[var(--color-outline)] bg-transparent px-3 text-sm normal-case tracking-normal text-[var(--color-on-surface)] focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Caption"
                            value={col.caption?.[lc] ?? ""}
                            onChange={(e) => setColText(b.id, col.id, "caption", e.target.value)}
                            disabled={disabled}
                            className="h-9 w-full rounded-full border border-[var(--color-outline)] bg-transparent px-3 text-sm normal-case tracking-normal text-[var(--color-on-surface)] focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
                          />
                        </div>
                      ) : (
                        <textarea
                          rows={5}
                          placeholder="Text (markdown)"
                          value={col.text?.[lc] ?? ""}
                          onChange={(e) => setColText(b.id, col.id, "text", e.target.value)}
                          disabled={disabled}
                          className="w-full rounded-xl border border-[var(--color-outline)] bg-transparent p-3 text-sm normal-case tracking-normal text-[var(--color-on-surface)] focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
                        />
                      )}
                    </div>
                  ))}
                </div>
                {(b.columns?.length ?? 0) < 3 && (
                  <button
                    type="button"
                    onClick={() => addColumn(b.id)}
                    disabled={disabled}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--color-outline)] px-3 py-1.5 text-xs hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add column
                  </button>
                )}
              </div>
            )}
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
