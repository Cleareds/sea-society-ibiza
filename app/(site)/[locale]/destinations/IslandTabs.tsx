"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Props {
  /** Stable id used to scope the ARIA hooks per island instance. */
  id: string;
  labels: { sea: string; clubs: string };
  sea: React.ReactNode;
  clubs: React.ReactNode;
}

/**
 * Two-tab strip used inside each island block. Default tab is
 * "From the sea" (the coves grid); the second tab swaps to beach
 * clubs. Only one panel renders content at a time, which is what
 * lets the side-image stretch to match a stable content height
 * (without tabs the section would grow / shrink as readers
 * switched mental modes).
 *
 * Standard ARIA tabs pattern (role="tablist" / role="tab" with
 * aria-selected + aria-controls, role="tabpanel" with `hidden`
 * when inactive so screen readers skip past).
 */
export function IslandTabs({ id, labels, sea, clubs }: Props) {
  const [active, setActive] = React.useState<"sea" | "clubs">("sea");

  const tab = (key: "sea" | "clubs", label: string) => {
    const isActive = active === key;
    return (
      <button
        key={key}
        type="button"
        role="tab"
        id={`${id}-tab-${key}`}
        aria-selected={isActive}
        aria-controls={`${id}-panel-${key}`}
        tabIndex={isActive ? 0 : -1}
        onClick={() => setActive(key)}
        className={cn(
          "relative py-3 text-xs font-medium uppercase tracking-[0.25em] transition-colors md:text-sm",
          isActive
            ? "text-[#000000]"
            : "text-[var(--color-on-surface-variant)] hover:text-[#000000]",
        )}
      >
        {label}
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-0 -bottom-px h-0.5 bg-[#000000] transition-opacity",
            isActive ? "opacity-100" : "opacity-0",
          )}
        />
      </button>
    );
  };

  return (
    <div className="mt-2">
      <div
        role="tablist"
        aria-label="Section"
        className="flex gap-8 border-b border-[var(--color-outline-variant)]"
      >
        {tab("sea", labels.sea)}
        {tab("clubs", labels.clubs)}
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel-sea`}
        aria-labelledby={`${id}-tab-sea`}
        hidden={active !== "sea"}
        className="pt-8"
      >
        {sea}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel-clubs`}
        aria-labelledby={`${id}-tab-clubs`}
        hidden={active !== "clubs"}
        className="pt-8"
      >
        {clubs}
      </div>
    </div>
  );
}
