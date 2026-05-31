import Image from "next/image";
import Link from "next/link";
import type { Boat } from "@/lib/data/types";
import { localePath, type Locale } from "@/lib/i18n/config";
import { imageVariant } from "@/lib/image-url";
import { cardImageForSlug } from "@/lib/boat-card-images";

interface BoatCardProps {
  boat: Boat;
  locale?: Locale;
  priority?: boolean;
  /** Override for the "From €x,xxx" string (localised in parent). */
  fromLabel?: string;
}

export function BoatCard({ boat, locale = "en", priority = false, fromLabel }: BoatCardProps) {
  const href = localePath(locale, `/fleet/${boat.slug}`);
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl bg-[var(--color-surface-container-low)] transition-shadow hover:shadow-xl focus-visible:shadow-xl"
    >
      <div className="brand-img-hover relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageVariant(cardImageForSlug(boat.slug) ?? boat.cardImage ?? boat.heroImage, 900)}
          alt={`${boat.name} — ${boat.tagline}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-2xl text-[var(--color-on-surface)]">{boat.name}</h3>
          <span className="text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
            {boat.lengthM} m
          </span>
        </div>
        <p className="mt-1 text-sm text-[var(--color-on-surface-variant)]">{boat.tagline}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-[var(--color-on-surface-variant)]">
            {boat.guests} guests · {boat.brand}
          </span>
          <span className="font-medium text-[var(--color-primary)]">
            {fromLabel ?? `From €${boat.priceFrom.toLocaleString("en-GB")}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
