import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  name: string;
  href?: string;
}

interface Props {
  items: Crumb[];
}

export function Breadcrumb({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
        {items.map((it, idx) => {
          const last = idx === items.length - 1;
          return (
            <li key={it.name} className="flex items-center gap-1">
              {it.href && !last ? (
                <Link href={it.href} className="hover:text-[var(--color-primary)]">
                  {it.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-[var(--color-on-surface)]" : undefined}>
                  {it.name}
                </span>
              )}
              {!last && <ChevronRight aria-hidden className="h-3 w-3" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
