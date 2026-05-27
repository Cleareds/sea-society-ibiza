import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  name: string;
  href?: string;
}

interface Props {
  items: Crumb[];
  /** When true, inherits text color from parent (use over image heroes). */
  onImage?: boolean;
}

export function Breadcrumb({ items, onImage }: Props) {
  // On-image: inherit the parent's color (set by `.brand-breadcrumb`) so
  // the breadcrumb stays high-contrast against any hero photo.
  // On-surface: classic dark text on light background.
  const baseClass = onImage
    ? "flex flex-wrap items-center gap-1 text-xs uppercase tracking-[0.15em]"
    : "flex flex-wrap items-center gap-1 text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]";
  return (
    <nav aria-label="Breadcrumb">
      <ol className={baseClass}>
        {items.map((it, idx) => {
          const last = idx === items.length - 1;
          return (
            <li key={it.name} className="flex items-center gap-1">
              {it.href && !last ? (
                <Link
                  href={it.href}
                  className={
                    onImage
                      ? "transition-opacity hover:opacity-100 opacity-90"
                      : "hover:text-[var(--color-primary)]"
                  }
                >
                  {it.name}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={
                    last && !onImage ? "text-[var(--color-on-surface)]" : undefined
                  }
                >
                  {it.name}
                </span>
              )}
              {!last && <ChevronRight aria-hidden className="h-3 w-3 opacity-70" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
