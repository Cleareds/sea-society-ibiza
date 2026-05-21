"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Globe, ChevronDown } from "lucide-react";
import {
  locales,
  localeLabels,
  localeFlags,
  defaultLocale,
  localePath,
  stripLocale,
  type Locale,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

interface Props {
  currentLocale: Locale;
  variant?: "solid" | "transparent";
}

/**
 * Dropdown that swaps the current locale and navigates to the equivalent path
 * in the target language. The default locale stays at the bare path, others
 * get a `/{locale}` prefix.
 */
export function LocaleSwitcher({ currentLocale, variant = "solid" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const switchTo = (target: Locale) => {
    const bare = stripLocale(pathname);
    const next = localePath(target, bare);
    setOpen(false);
    router.push(next);
  };

  const trigger =
    variant === "transparent"
      ? "text-white/90 hover:text-white"
      : "text-[var(--color-on-surface)] hover:text-[var(--color-primary)]";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs uppercase tracking-[0.18em] transition-colors",
          trigger,
        )}
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span>{currentLocale.toUpperCase()}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} aria-hidden />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] py-1 text-sm shadow-xl"
        >
          {locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                onClick={() => switchTo(l)}
                role="option"
                aria-selected={l === currentLocale}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]",
                  l === currentLocale && "bg-[var(--color-surface-container)] font-medium",
                )}
              >
                <span>
                  <span className="mr-2" aria-hidden>
                    {localeFlags[l]}
                  </span>
                  {localeLabels[l]}
                </span>
                {l === defaultLocale && (
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
                    Default
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
