"use client";

import * as React from "react";
import { trackPixel } from "@/lib/analytics";

interface Props {
  /** Which detail template fired this — segments the audience in Meta. */
  category: "boat" | "experience";
  /** Stable identifier for retargeting — the slug. */
  id: string;
  /** Human-readable name (boat name / experience title). */
  name: string;
  /** Starting price in EUR, when known — lets Meta value the event. */
  value?: number;
}

/**
 * Fires a Meta Pixel `ViewContent` event on mount. Rendered by the
 * boat and experience detail pages (Server Components) — drop it in the
 * tree with the content metadata. Renders nothing.
 *
 * Re-runs when the slug changes, so client-side navigation between two
 * boats counts as two separate views.
 */
export function PixelViewContent({ category, id, name, value }: Props) {
  React.useEffect(() => {
    trackPixel("ViewContent", {
      content_type: "product",
      content_category: category,
      content_ids: [id],
      content_name: name,
      ...(value ? { value, currency: "EUR" } : {}),
    });
  }, [category, id, name, value]);
  return null;
}
