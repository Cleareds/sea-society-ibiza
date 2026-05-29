"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { localePath, type Locale } from "@/lib/i18n/config";

/**
 * Fleet filter modal — dynamic faceting + checkbox UI.
 *
 *   - Triggered by a small "Filters · N" link on the fleet page.
 *   - Opens a right-side sheet matching the mobile nav style (large
 *     uppercase headings per dimension, generous spacing, minimal
 *     chrome).
 *   - Multi-select for type + brand (a yacht has exactly one of each,
 *     so within-dim multi-select expands the result set via OR).
 *   - Single-select for guests + budget (numeric ≥/≤ thresholds).
 *   - Each option shows a faceted count: how many boats would match
 *     IF this option were the only thing selected for its dimension,
 *     combined with the CURRENT selections in the other dimensions.
 *     Options that would yield 0 results are dimmed and disabled.
 *   - All edits are staged in local draft state; "Show N boats"
 *     commits to the URL.
 */

export interface FacetBoat {
  type: string;
  brand: string;
  guests: number;
  priceFrom: number;
}

interface Props {
  /** Slim projection of every boat for facet computation. */
  boats: FacetBoat[];
  brands: string[];
  locale?: Locale;
}

const TYPES: Array<{ value: string; label: string }> = [
  { value: "motor_yacht", label: "Motor" },
  { value: "sailing_yacht", label: "Sailing" },
  { value: "catamaran", label: "Catamaran" },
  { value: "day_boat", label: "Day boat" },
  { value: "sport_yacht", label: "Sport" },
];

const GUESTS: Array<{ value: string; label: string }> = [
  { value: "6", label: "6 or more" },
  { value: "8", label: "8 or more" },
  { value: "10", label: "10 or more" },
  { value: "12", label: "12 or more" },
];

const PRICES: Array<{ value: string; label: string }> = [
  { value: "3000", label: "Up to €3,000 / day" },
  { value: "5000", label: "Up to €5,000 / day" },
  { value: "10000", label: "Up to €10,000 / day" },
  { value: "20000", label: "Up to €20,000 / day" },
];

interface Draft {
  types: Set<string>;
  brands: Set<string>;
  minGuests: string | null;
  maxPrice: string | null;
}

function readParams(params: URLSearchParams): Draft {
  return {
    types: new Set(
      (params.get("type") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    ),
    brands: new Set(
      (params.get("brand") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    ),
    minGuests: params.get("minGuests") || null,
    maxPrice: params.get("maxPrice") || null,
  };
}

/** Apply a draft to the boat list; used to count matches. */
function applyDraft(boats: FacetBoat[], d: Draft, ignore?: keyof Draft): FacetBoat[] {
  return boats.filter((b) => {
    if (ignore !== "types" && d.types.size > 0 && !d.types.has(b.type)) return false;
    if (
      ignore !== "brands" &&
      d.brands.size > 0 &&
      !d.brands.has(b.brand.toLowerCase())
    )
      return false;
    if (ignore !== "minGuests" && d.minGuests && b.guests < Number(d.minGuests))
      return false;
    if (ignore !== "maxPrice" && d.maxPrice && b.priceFrom > Number(d.maxPrice))
      return false;
    return true;
  });
}

export function FilterModal({ boats, brands, locale = "en" }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const base = localePath(locale, "/fleet");

  // Live draft state — initialised from URL params on each open so the
  // modal always reflects the canonical state.
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft>(() => readParams(params));
  React.useEffect(() => {
    if (open) setDraft(readParams(params));
  }, [open, params]);

  // Active count for the trigger badge — reflects the COMMITTED URL
  // state, not the in-flight draft.
  const activeCount = React.useMemo(() => {
    const c = readParams(params);
    return (
      c.types.size +
      c.brands.size +
      (c.minGuests ? 1 : 0) +
      (c.maxPrice ? 1 : 0)
    );
  }, [params]);

  // ---- Facet helpers ------------------------------------------------
  // Standard Airbnb-style faceting: count = "how many boats match
  // THIS SPECIFIC value, given the current selections in the OTHER
  // dimensions". Stable as the user toggles within the same dim —
  // selecting one type doesn't change the type facets, only the
  // brand/guests/budget facets shift because those dimensions are
  // now narrower. This is what stops the counts going crazy on
  // multi-select.
  const facetCount = React.useCallback(
    (dim: keyof Draft, value: string): number => {
      const inValue = (b: FacetBoat): boolean => {
        if (dim === "types") return b.type === value;
        if (dim === "brands") return b.brand.toLowerCase() === value.toLowerCase();
        if (dim === "minGuests") return b.guests >= Number(value);
        if (dim === "maxPrice") return b.priceFrom <= Number(value);
        return false;
      };
      return boats.filter((b) => {
        if (dim !== "types" && draft.types.size > 0 && !draft.types.has(b.type))
          return false;
        if (
          dim !== "brands" &&
          draft.brands.size > 0 &&
          !draft.brands.has(b.brand.toLowerCase())
        )
          return false;
        if (
          dim !== "minGuests" &&
          draft.minGuests &&
          b.guests < Number(draft.minGuests)
        )
          return false;
        if (
          dim !== "maxPrice" &&
          draft.maxPrice &&
          b.priceFrom > Number(draft.maxPrice)
        )
          return false;
        return inValue(b);
      }).length;
    },
    [boats, draft],
  );

  const matchCount = React.useMemo(() => applyDraft(boats, draft).length, [boats, draft]);

  // Global counts — independent of any draft. Used to suppress rows
  // that have NO data in the dataset (default state).
  const presentTypes = React.useMemo(
    () =>
      TYPES.filter(
        (t) => boats.some((b) => b.type === t.value),
      ),
    [boats],
  );
  const presentBrands = React.useMemo(
    () =>
      brands.filter((b) =>
        boats.some((boat) => boat.brand.toLowerCase() === b.toLowerCase()),
      ),
    [boats, brands],
  );
  const presentGuests = React.useMemo(
    () =>
      GUESTS.filter((g) =>
        boats.some((b) => b.guests >= Number(g.value)),
      ),
    [boats],
  );
  const presentPrices = React.useMemo(
    () =>
      PRICES.filter((p) =>
        boats.some((b) => b.priceFrom <= Number(p.value)),
      ),
    [boats],
  );

  // ---- Mutators -----------------------------------------------------
  const toggleType = (v: string) =>
    setDraft((d) => {
      const next = new Set(d.types);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return { ...d, types: next };
    });
  const toggleBrand = (v: string) =>
    setDraft((d) => {
      const next = new Set(d.brands);
      const k = v.toLowerCase();
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return { ...d, brands: next };
    });
  const setMinGuests = (v: string) =>
    setDraft((d) => ({ ...d, minGuests: d.minGuests === v ? null : v }));
  const setMaxPrice = (v: string) =>
    setDraft((d) => ({ ...d, maxPrice: d.maxPrice === v ? null : v }));

  const reset = () =>
    setDraft({
      types: new Set(),
      brands: new Set(),
      minGuests: null,
      maxPrice: null,
    });

  const apply = () => {
    const next = new URLSearchParams();
    if (draft.types.size > 0) next.set("type", Array.from(draft.types).join(","));
    if (draft.brands.size > 0) next.set("brand", Array.from(draft.brands).join(","));
    if (draft.minGuests) next.set("minGuests", draft.minGuests);
    if (draft.maxPrice) next.set("maxPrice", draft.maxPrice);
    const qs = next.toString();
    router.replace(qs ? `${base}?${qs}` : base, { scroll: false });
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.22em] text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span
              aria-hidden
              className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1.5 text-[10px] font-medium text-white"
            >
              {activeCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-md md:max-w-lg"
      >
        {/* Scroll region — header + sections. Footer lives outside so
            it's anchored to the true bottom of the sheet, never
            scrolled-under by long filter content. */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6">
          <SheetTitle className="text-3xl">Filter the fleet</SheetTitle>
          <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
            {matchCount} {matchCount === 1 ? "boat" : "boats"} match
          </p>

          <div className="mt-8 space-y-10">
            {presentTypes.length > 0 && (
              <Section label="Type">
                {presentTypes.map((t) => {
                  const active = draft.types.has(t.value);
                  const count = facetCount("types", t.value);
                  return (
                    <CheckRow
                      key={t.value}
                      label={t.label}
                      active={active}
                      count={count}
                      onClick={() => toggleType(t.value)}
                    />
                  );
                })}
              </Section>
            )}

            {presentBrands.length > 0 && (
              <Section label="Brand">
                {presentBrands.map((b) => {
                  const active = draft.brands.has(b.toLowerCase());
                  const count = facetCount("brands", b);
                  return (
                    <CheckRow
                      key={b}
                      label={b}
                      active={active}
                      count={count}
                      onClick={() => toggleBrand(b)}
                    />
                  );
                })}
              </Section>
            )}

            {presentGuests.length > 0 && (
              <Section label="For">
                {presentGuests.map((g) => {
                  const active = draft.minGuests === g.value;
                  const count = facetCount("minGuests", g.value);
                  return (
                    <CheckRow
                      key={g.value}
                      label={g.label}
                      active={active}
                      count={count}
                      onClick={() => setMinGuests(g.value)}
                      variant="radio"
                    />
                  );
                })}
              </Section>
            )}

            {presentPrices.length > 0 && (
              <Section label="Budget">
                {presentPrices.map((p) => {
                  const active = draft.maxPrice === p.value;
                  const count = facetCount("maxPrice", p.value);
                  return (
                    <CheckRow
                      key={p.value}
                      label={p.label}
                      active={active}
                      count={count}
                      onClick={() => setMaxPrice(p.value)}
                      variant="radio"
                    />
                  );
                })}
              </Section>
            )}
          </div>
        </div>

        {/* Footer — anchored to the bottom edge. Lives outside the
            scroll container so no filter section ever scrolls under
            it. */}
        <div className="flex items-center justify-between gap-4 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-6 py-4">
          <button
            type="button"
            onClick={reset}
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={apply}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-90"
          >
            Show {matchCount} {matchCount === 1 ? "boat" : "boats"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ─── Sub-components ───────────────────────────────────────────── */

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="font-serif text-2xl text-[var(--color-on-surface)] md:text-3xl">
        {label}
      </h3>
      <div className="mt-4 space-y-1">{children}</div>
    </section>
  );
}

function CheckRow({
  label,
  active,
  count,
  onClick,
  variant = "check",
}: {
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
  variant?: "check" | "radio";
}) {
  const disabled = count === 0 && !active;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active}
      className="group flex w-full items-center justify-between gap-3 py-2 text-left transition-colors disabled:cursor-not-allowed"
      style={{ opacity: disabled ? 0.4 : 1 }}
    >
      <span className="flex items-center gap-3">
        <span
          aria-hidden
          className={
            "inline-flex h-4 w-4 shrink-0 items-center justify-center transition-colors " +
            (variant === "radio" ? "rounded-full" : "rounded-[2px]") +
            (active
              ? " border border-[var(--color-primary)] bg-[var(--color-primary)]"
              : " border border-[var(--color-outline)] bg-transparent group-hover:border-[var(--color-on-surface)]")
          }
        >
          {active &&
            (variant === "radio" ? (
              <span className="block h-1.5 w-1.5 rounded-full bg-white" />
            ) : (
              <svg viewBox="0 0 12 12" className="h-3 w-3 stroke-white" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 6 L5 9 L10 3" />
              </svg>
            ))}
        </span>
        <span
          className={
            "text-sm font-normal " +
            (active
              ? "text-[var(--color-on-surface)]"
              : "text-[var(--color-on-surface)]/75 group-hover:text-[var(--color-on-surface)]")
          }
        >
          {label}
        </span>
      </span>
      <span
        className={
          "text-xs tabular-nums " +
          (active
            ? "text-[var(--color-primary)]"
            : "text-[var(--color-on-surface-variant)]")
        }
      >
        {count}
      </span>
    </button>
  );
}
