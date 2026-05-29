"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { localePath, type Locale } from "@/lib/i18n/config";

const TYPES: Array<{ value: string; label: string }> = [
  { value: "", label: "All types" },
  { value: "motor_yacht", label: "Motor yacht" },
  { value: "sailing_yacht", label: "Sailing" },
  { value: "catamaran", label: "Catamaran" },
  { value: "day_boat", label: "Day boat" },
  { value: "sport_yacht", label: "Sport yacht" },
];

const GUESTS = ["", "6", "8", "10", "12"];

interface Props {
  brands: string[];
  locale?: Locale;
}

export function FilterBar({ brands, locale = "en" }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const base = localePath(locale, "/fleet");

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${base}?${qs}` : base, { scroll: false });
  };

  const reset = () => router.replace(base, { scroll: false });

  // Unboxed select — no border, no fill. A subtle bottom rule appears
  // on hover / focus / when a value is set, mirroring the editorial
  // language of the rest of the site (no buttons inside boxes).
  const baseSelect =
    "appearance-none bg-transparent h-10 pr-6 text-sm font-medium text-[var(--color-on-surface)] cursor-pointer transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:text-[var(--color-primary)]";
  // Down caret rendered via background-image so we control its colour
  // and don't get the OS default select chrome.
  const caret =
    "bg-no-repeat bg-[length:10px_10px] bg-[right_2px_center] bg-[url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='%231d2730' stroke-width='1.5'><path d='M2 4 L6 8 L10 4'/></svg>\")]";

  const selectClass = `${baseSelect} ${caret}`;
  const activeUnderline = (key: string) =>
    params.get(key)
      ? "border-b border-[var(--color-primary)]"
      : "border-b border-transparent hover:border-[var(--color-outline-variant)]";

  const hasAny = Array.from(params.keys()).length > 0;

  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
      <label className="sr-only" htmlFor="filter-type">
        Boat type
      </label>
      <select
        id="filter-type"
        value={params.get("type") ?? ""}
        onChange={(e) => update("type", e.target.value)}
        className={`${selectClass} ${activeUnderline("type")}`}
      >
        {TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="filter-guests">
        Minimum guests
      </label>
      <select
        id="filter-guests"
        value={params.get("minGuests") ?? ""}
        onChange={(e) => update("minGuests", e.target.value)}
        className={`${selectClass} ${activeUnderline("minGuests")}`}
      >
        {GUESTS.map((g) => (
          <option key={g} value={g}>
            {g ? `${g}+ guests` : "Any size"}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="filter-brand">
        Brand
      </label>
      <select
        id="filter-brand"
        value={params.get("brand") ?? ""}
        onChange={(e) => update("brand", e.target.value)}
        className={`${selectClass} ${activeUnderline("brand")}`}
      >
        <option value="">All brands</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="filter-price">
        Max price
      </label>
      <select
        id="filter-price"
        value={params.get("maxPrice") ?? ""}
        onChange={(e) => update("maxPrice", e.target.value)}
        className={`${selectClass} ${activeUnderline("maxPrice")}`}
      >
        <option value="">Any budget</option>
        <option value="3000">Up to €3,000</option>
        <option value="5000">Up to €5,000</option>
        <option value="10000">Up to €10,000</option>
        <option value="20000">Up to €20,000</option>
      </select>

      {hasAny && (
        <button
          type="button"
          onClick={reset}
          className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
        >
          Reset
        </button>
      )}
    </div>
  );
}
