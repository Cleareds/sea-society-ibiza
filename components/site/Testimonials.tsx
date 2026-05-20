import type { Testimonial } from "@/lib/data/types";

interface Props {
  items: Testimonial[];
}

export function Testimonials({ items }: Props) {
  return (
    <section aria-labelledby="testimonials-h" className="text-center">
      <p
        id="testimonials-h"
        className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]"
      >
        What our guests say
      </p>
      <ul className="mt-10 grid gap-8 md:grid-cols-3">
        {items.map((t) => (
          <li
            key={t.id}
            className="rounded-2xl border border-[var(--color-outline-variant)]/40 bg-[var(--color-surface-container-low)] p-6 text-left"
          >
            <blockquote className="font-serif text-lg leading-relaxed text-[var(--color-on-surface)]">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
              — {t.author}, {t.location}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
