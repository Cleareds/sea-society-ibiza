"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Props {
  labels: { ibiza: string; formentera: string };
  ibiza: React.ReactNode;
  formentera: React.ReactNode;
}

/**
 * Two-tab strip for the beach clubs section. Collapses two previously
 * stacked full sections (~2700 px) into one panel (~1500 px) by
 * showing only the active island's clubs at a time.
 *
 * Accessibility: standard ARIA tabs pattern — role="tablist" with
 * role="tab" buttons that own aria-selected + aria-controls, and
 * role="tabpanel" content nodes that hide via `hidden` so they're
 * pulled from the a11y tree when inactive.
 */
export function ClubsTabs({ labels, ibiza, formentera }: Props) {
  const [active, setActive] = React.useState<"ibiza" | "formentera">("ibiza");

  const tab = (key: "ibiza" | "formentera", label: string) => {
    const isActive = active === key;
    return (
      <button
        key={key}
        type="button"
        role="tab"
        id={`clubs-tab-${key}`}
        aria-selected={isActive}
        aria-controls={`clubs-panel-${key}`}
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
        {/* Active underline — sits on the bottom border, 2px black. */}
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
    <div className="mt-8">
      <div
        role="tablist"
        aria-label="Beach clubs by island"
        className="flex gap-8 border-b border-[var(--color-outline-variant)]"
      >
        {tab("ibiza", labels.ibiza)}
        {tab("formentera", labels.formentera)}
      </div>

      <div
        role="tabpanel"
        id="clubs-panel-ibiza"
        aria-labelledby="clubs-tab-ibiza"
        hidden={active !== "ibiza"}
        className="pt-10"
      >
        {ibiza}
      </div>
      <div
        role="tabpanel"
        id="clubs-panel-formentera"
        aria-labelledby="clubs-tab-formentera"
        hidden={active !== "formentera"}
        className="pt-10"
      >
        {formentera}
      </div>
    </div>
  );
}
