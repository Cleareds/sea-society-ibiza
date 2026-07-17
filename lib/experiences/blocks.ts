import type { Locale } from "@/lib/i18n/config";
import type {
  ExperienceBlock,
  ExperienceBlockStored,
  ExperienceBlockType,
  LocalizedText,
} from "@/lib/data/types";

/** Curated block catalog + labels for the admin editor. */
export const BLOCK_CATALOG: Array<{ type: ExperienceBlockType; label: string }> = [
  { type: "heading", label: "Heading" },
  { type: "paragraph", label: "Paragraph" },
  { type: "image", label: "Image" },
  { type: "quote", label: "Quote" },
];

/** Which fields each block type uses (drives the editor + validation). */
export const BLOCK_FIELDS: Record<
  ExperienceBlockType,
  { localizedText: Array<"text" | "alt" | "caption" | "attribution">; hasImage: boolean }
> = {
  heading: { localizedText: ["text"], hasImage: false },
  paragraph: { localizedText: ["text"], hasImage: false },
  image: { localizedText: ["alt", "caption"], hasImage: true },
  quote: { localizedText: ["text", "attribution"], hasImage: false },
};

function pick(t: LocalizedText | undefined, locale: Locale): string | undefined {
  if (!t) return undefined;
  return t[locale] ?? t.en ?? undefined;
}

/** Resolve stored blocks to a single locale for rendering (falls back to EN). */
export function resolveBlocks(
  blocks: ExperienceBlockStored[] | null | undefined,
  locale: Locale,
): ExperienceBlock[] {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((b) => b && b.type)
    .map((b) => ({
      id: b.id,
      type: b.type,
      text: pick(b.text, locale),
      src: b.src || undefined,
      alt: pick(b.alt, locale),
      caption: pick(b.caption, locale),
      attribution: pick(b.attribution, locale),
    }));
}
