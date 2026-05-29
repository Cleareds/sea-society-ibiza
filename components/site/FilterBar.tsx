"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { localePath, type Locale } from "@/lib/i18n/config";

const TYPES: Array<{ value: string; label: string }> = [
  { value: "motor_yacht", label: "Motor" },
  { value: "sailing_yacht", label: "Sailing" },
  { value: "catamaran", label: "Catamaran" },
  { value: "day_boat", label: "Day boat" },
  { value: "sport_yacht", label: "Sport" },
];

const GUESTS: Array<{ value: string; label: string }> = [
  { value: "6", label: "6+" },
  { value: "8", label: "8+" },
  { value: "10", label: "10+" },
  { value: "12", label: "12+" },
];

const PRICES: Array<{ value: string; label: string }> = [
  { value: "3000", label: "Up to €3k" },
  { value: "5000", label: "Up to €5k" },
  { value: "10000", label: "Up to €10k" },
  { value: "20000", label: "Up to €20k" },
];

interface Props {
  brands: string[];
  locale?: Locale;
}

/**
 * Inline editorial filter bar — no boxes, no select chrome.
 *
 *   - TYPE + BRAND are MULTI-SELECT (a browser can stack
 *     "Motor + Sailing", "Sunseeker + Mangusta"). Stored as a
 *     comma-separated value in the URL: ?type=catamaran,sailing_yacht.
 *   - GUESTS + BUDGET are SINGLE-SELECT (numeric ≥X / ≤X thresholds).
 *     Click again to clear.
 *   - Active state = turquoise text + a thin underline. Inactive =
 *     muted on-surface, hover → on-surface.
 *   - Group label is a small uppercase eyebrow above each row.
 */
export function FilterBar({ brands, locale = "en" }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const base = localePath(locale, "/fleet");

  const writeParams = (next: URLSearchParams) => {
    const qs = next.toString();
    router.replace(qs ? `${base}?${qs}` : base, { scroll: false });
  };

  const setSingle = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (params.get(key) === value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    writeParams(next);
  };

  const toggleMulti = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    const current = new Set(
      (params.get(key) ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    );
    if (current.has(value)) current.delete(value);
    else current.add(value);
    if (current.size === 0) next.delete(key);
    else next.set(key, Array.from(current).join(","));
    writeParams(next);
  };

  const isActiveSingle = (key: string, value: string) =>
    params.get(key) === value;
  const isActiveMulti = (key: string, value: string) =>
    new Set((params.get(key) ?? "").split(",")).has(value);

  const reset = () => router.replace(base, { scroll: false });
  const hasAny = Array.from(params.keys()).length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Row label="Type">
        {TYPES.map((t) => (
          <Chip
            key={t.value}
            active={isActiveMulti("type", t.value)}
            onClick={() => toggleMulti("type", t.value)}
          >
            {t.label}
          </Chip>
        ))}
      </Row>

      {brands.length > 0 && (
        <Row label="Brand">
          {brands.map((b) => (
            <Chip
              key={b}
              active={isActiveMulti("brand", b)}
              onClick={() => toggleMulti("brand", b)}
            >
              {b}
            </Chip>
          ))}
        </Row>
      )}

      <Row label="For">
        {GUESTS.map((g) => (
          <Chip
            key={g.value}
            active={isActiveSingle("minGuests", g.value)}
            onClick={() => setSingle("minGuests", g.value)}
          >
            {g.label}
          </Chip>
        ))}
      </Row>

      <Row label="Budget">
        {PRICES.map((p) => (
          <Chip
            key={p.value}
            active={isActiveSingle("maxPrice", p.value)}
            onClick={() => setSingle("maxPrice", p.value)}
          >
            {p.label}
          </Chip>
        ))}
      </Row>

      {hasAny && (
        <button
          type="button"
          onClick={reset}
          className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", rowGap: "8px", columnGap: "20px" }}
    >
      <span
        className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]"
        style={{ minWidth: "5rem" }}
      >
        {label}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", columnGap: "20px", rowGap: "8px" }}>
        {children}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        "relative cursor-pointer text-sm font-medium transition-colors " +
        (active
          ? "text-[var(--color-primary)]"
          : "text-[var(--color-on-surface)]/75 hover:text-[var(--color-on-surface)]")
      }
    >
      {children}
      <span
        aria-hidden
        className={
          "absolute left-0 right-0 h-px transition-colors " +
          (active ? "bg-[var(--color-primary)]" : "bg-transparent")
        }
        style={{ bottom: "-4px" }}
      />
    </button>
  );
}
