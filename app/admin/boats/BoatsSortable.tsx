"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { GripVertical } from "lucide-react";
import { reorderBoats, toggleBoatPublished, deleteBoat } from "../actions";

export interface BoatRow {
  id: string;
  name: string;
  slug: string;
  brand: string;
  type: string;
  priceFrom: number;
  isPublished: boolean;
}

/**
 * Admin fleet list with native drag-to-reorder.
 *
 * Rows are HTML5-draggable (no external DnD library). Dragging a row over
 * another reorders the list live; on drop the new order is persisted via
 * reorderBoats(), which writes sort_order 1..n — the same field the public
 * /fleet grid orders by. When Supabase isn't configured the list renders
 * static (drag + publish/delete disabled), matching the rest of the admin.
 */
export function BoatsSortable({
  boats,
  editable,
}: {
  boats: BoatRow[];
  editable: boolean;
}) {
  const [items, setItems] = useState<BoatRow[]>(boats);
  const [dragId, setDragId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  // Order as it was last persisted — used to decide whether to save on drop.
  const savedOrder = useRef(boats.map((b) => b.id).join(","));

  function onDragStart(id: string) {
    setDragId(id);
  }

  function onDragEnterRow(overId: string) {
    if (!dragId || dragId === overId) return;
    setItems((prev) => {
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

  function onDragEnd() {
    setDragId(null);
    setItems((current) => {
      const order = current.map((b) => b.id).join(",");
      if (order !== savedOrder.current) {
        savedOrder.current = order;
        const ids = current.map((b) => b.id);
        startTransition(() => {
          void reorderBoats(ids);
        });
      }
      return current;
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-[var(--color-on-surface-variant)]">
          {editable
            ? "Drag a row by the handle to reorder — this is the order shown on the public fleet page. First = shown first."
            : "Reordering is available once Supabase is connected."}
        </p>
        {pending && (
          <span className="text-xs text-[var(--color-primary)]">Saving order…</span>
        )}
      </div>

      <ul className="overflow-hidden rounded-2xl bg-[var(--color-surface)]">
        {items.map((b) => (
          <li
            key={b.id}
            draggable={editable}
            onDragStart={() => onDragStart(b.id)}
            onDragEnter={() => onDragEnterRow(b.id)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={onDragEnd}
            className={`flex items-center gap-3 border-b border-[var(--color-outline-variant)]/30 px-4 py-3 text-sm last:border-b-0 ${
              dragId === b.id ? "opacity-50" : ""
            } ${editable ? "cursor-grab active:cursor-grabbing" : ""}`}
          >
            {editable && (
              <GripVertical
                className="h-4 w-4 shrink-0 text-[var(--color-on-surface-variant)]"
                aria-hidden
              />
            )}
            <div className="min-w-0 flex-1">
              <Link
                className="font-medium hover:text-[var(--color-primary)]"
                href={`/admin/boats/${b.id}`}
              >
                {b.name}
              </Link>
              <p className="truncate text-xs text-[var(--color-on-surface-variant)]">
                /{b.slug} · {b.brand} · {b.type.replace("_", " ")}
              </p>
            </div>
            <span className="w-24 shrink-0 text-right text-[var(--color-on-surface-variant)]">
              €{b.priceFrom.toLocaleString("en-GB")}
            </span>
            <span className="w-16 shrink-0 text-center">
              {editable ? (
                <form action={toggleBoatPublished}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="next" value={String(!b.isPublished)} />
                  <button
                    type="submit"
                    className={`rounded-full px-3 py-1 text-xs ${
                      b.isPublished
                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                        : "bg-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]"
                    }`}
                  >
                    {b.isPublished ? "Live" : "Draft"}
                  </button>
                </form>
              ) : (
                <span className="text-xs">{b.isPublished ? "Live" : "Draft"}</span>
              )}
            </span>
            <span className="flex w-24 shrink-0 items-center justify-end gap-2">
              <Link className="text-xs underline" href={`/admin/boats/${b.id}`}>
                Edit
              </Link>
              {editable && (
                <form action={deleteBoat} className="inline">
                  <input type="hidden" name="id" value={b.id} />
                  <button
                    type="submit"
                    className="text-xs text-[var(--color-secondary)] underline"
                    formNoValidate
                  >
                    Delete
                  </button>
                </form>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
