"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  locales,
  localeLabels,
  localeFullLabels,
  localePath,
  stripLocale,
  type Locale,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

interface Props {
  currentLocale: Locale;
  /** `transparent` is used on top of dark heroes (white text);
   *  `solid` is the default solid-header dark text style. */
  variant?: "solid" | "transparent";
  /** Extra classes merged into the outer <nav>. Use to override the
   *  default `text-xs` sizing (e.g. `text-base` for the mobile sheet). */
  className?: string;
}

/**
 * Inline text-only language toggle — `EN · ES · FR · NL`. No flags,
 * no icons, no dropdown. The active locale is bold at full opacity;
 * the others are interactive at reduced contrast. Click swaps the
 * locale and navigates to the same path under the new prefix
 * (`/about` ↔ `/fr/about`). Driven by the `locales` tuple in
 * lib/i18n/config.ts — adding a fifth locale there extends the
 * switcher automatically.
 */
export function LocaleSwitcher({ currentLocale, variant = "solid", className }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = React.useCallback(
    (target: Locale) => {
      if (target === currentLocale) return;
      const bare = stripLocale(pathname || "/");
      const next = localePath(target, bare);
      router.push(next);
    },
    [currentLocale, pathname, router],
  );

  const isTransparent = variant === "transparent";
  const activeCls = isTransparent ? "text-white" : "text-[#000000]";
  const inactiveCls = isTransparent
    ? "text-white/55 hover:text-white"
    : "text-[var(--color-on-surface-variant)] hover:text-[#000000]";
  const sepCls = isTransparent ? "text-white/40" : "text-[var(--color-outline)]";

  return (
    <nav
      aria-label="Language"
      className={cn(
        "inline-flex items-center text-xs uppercase tracking-[0.18em]",
        className,
      )}
    >
      {locales.map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && (
            <span aria-hidden className={cn("px-1", sepCls)}>
              ·
            </span>
          )}
          <button
            type="button"
            onClick={() => switchTo(l)}
            aria-current={l === currentLocale ? "true" : undefined}
            aria-label={`Switch to ${localeFullLabels[l]}`}
            className={cn(
              "transition-colors duration-300",
              l === currentLocale
                ? `${activeCls} font-medium`
                : inactiveCls,
            )}
          >
            {localeLabels[l]}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}
