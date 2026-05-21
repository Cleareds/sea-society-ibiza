"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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

  const selectClass =
    "h-11 rounded-full border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-4 text-sm text-[var(--color-on-surface)] focus-visible:border-[var(--color-primary)] focus-visible:outline-none";

  const hasAny = Array.from(params.keys()).length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="sr-only" htmlFor="filter-type">
        Boat type
      </label>
      <select
        id="filter-type"
        value={params.get("type") ?? ""}
        onChange={(e) => update("type", e.target.value)}
        className={selectClass}
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
        className={selectClass}
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
        className={selectClass}
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
        className={selectClass}
      >
        <option value="">Any budget</option>
        <option value="3000">Up to €3,000</option>
        <option value="5000">Up to €5,000</option>
        <option value="10000">Up to €10,000</option>
        <option value="20000">Up to €20,000</option>
      </select>

      {hasAny && (
        <Button variant="ghost" size="sm" onClick={reset}>
          Reset
        </Button>
      )}
    </div>
  );
}
