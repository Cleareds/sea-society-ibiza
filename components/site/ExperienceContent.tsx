import Image from "next/image";
import { MarkdownBody } from "./MarkdownBody";
import type { ExperienceBlock } from "@/lib/data/types";

/**
 * Renders the CMS block body of an experience (heading / paragraph / image /
 * quote), in order. Blocks are already resolved to the active locale.
 */
export function ExperienceContent({ blocks }: { blocks: ExperienceBlock[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((b) => {
        switch (b.type) {
          case "heading":
            return b.text ? (
              <h2
                key={b.id}
                className="font-serif text-3xl text-[var(--color-on-surface)] md:text-4xl"
              >
                {b.text}
              </h2>
            ) : null;
          case "paragraph":
            return b.text ? (
              <MarkdownBody key={b.id} source={b.text} className="max-w-none" />
            ) : null;
          case "image":
            return b.src ? (
              <figure key={b.id} className="my-2">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={b.src}
                    alt={b.alt ?? ""}
                    fill
                    sizes="(min-width: 1024px) 60vw, 90vw"
                    className="object-cover"
                  />
                </div>
                {b.caption && (
                  <figcaption className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
                    {b.caption}
                  </figcaption>
                )}
              </figure>
            ) : null;
          case "quote":
            return b.text ? (
              <blockquote
                key={b.id}
                className="border-l-2 border-[var(--color-primary)] pl-5"
              >
                <p className="font-serif text-2xl italic leading-relaxed text-[var(--color-on-surface)] md:text-3xl">
                  {b.text}
                </p>
                {b.attribution && (
                  <cite className="mt-3 block text-xs uppercase not-italic tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                    — {b.attribution}
                  </cite>
                )}
              </blockquote>
            ) : null;
          default:
            return null;
        }
      })}
    </div>
  );
}
