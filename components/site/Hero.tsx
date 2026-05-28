import Image from "next/image";
import { BookHereCTA } from "@/components/site/BookHereCTA";

interface HeroProps {
  /** Headline rendered as React node so the caller can colour-highlight words. */
  headline: React.ReactNode;
  sub: string;
  imageSrc: string;
  imageAlt: string;
  eyebrow?: string;
  scrollLabel?: string;
  whatsappNumber: string;
  ctaLabel?: string;
  /**
   * When true (default), the hero pins to the top of the viewport via
   * `position: sticky`. Subsequent sections must carry `relative z-10`
   * + a solid background so they scroll *over* it.
   */
  pinned?: boolean;
}

/**
 * Homepage hero — Es Vedra background, left-aligned editorial copy with
 * the immersive brand typography, single "Book here" CTA pointing at
 * WhatsApp, scroll cue pointing toward the next section (the sea).
 */
export function Hero({
  headline,
  sub,
  imageSrc,
  imageAlt,
  eyebrow = "Sea Society Ibiza",
  scrollLabel = "Scroll",
  whatsappNumber,
  ctaLabel = "Book here",
  pinned = true,
}: HeroProps) {
  return (
    <section
      className={
        pinned
          ? "sticky top-0 z-0 isolate h-[100svh] w-full overflow-hidden bg-[#06141a]"
          : "relative isolate min-h-[100svh] w-full overflow-hidden bg-[#06141a]"
      }
    >
      {/* Image lives in a relative wrapper so next/image's fill mode
          finds a valid containing block (the section itself is `sticky`,
          which Next 16 refuses for `fill` images). */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover motion-safe:animate-hero-zoom"
        />
      </div>
      <div className="absolute inset-0 brand-image-overlay" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-(--spacing-container-max) flex-col justify-end px-5 pb-28 pt-28 text-white md:px-10 md:pb-40 md:pt-40">
        {eyebrow && (
          <p className="brand-eyebrow motion-safe:animate-hero-rise [animation-delay:120ms]">
            {eyebrow}
          </p>
        )}
        <h1 className="brand-headline motion-safe:animate-hero-rise max-w-4xl text-[clamp(2.75rem,9vw,6rem)] [animation-delay:240ms]">
          {headline}
        </h1>
        <p className="brand-sub motion-safe:animate-hero-rise mt-6 max-w-xl text-base [animation-delay:380ms] md:text-lg">
          {sub}
        </p>
        <div className="motion-safe:animate-hero-rise mt-10 [animation-delay:520ms]">
          <BookHereCTA number={whatsappNumber} size="lg" label={ctaLabel} />
        </div>
      </div>

      {/* Scroll cue — points TOWARDS the next section (the sea), centred
          along the bottom edge. Arrow chevron rotates pointer-down. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[max(env(safe-area-inset-bottom),1.25rem)] z-10 flex justify-center">
        <a
          href="#after-hero"
          aria-label="Scroll to next section"
          className="motion-safe:animate-scroll-cue group pointer-events-auto inline-flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-white/85 hover:text-white"
        >
          {scrollLabel}
          <span aria-hidden className="block h-10 w-px bg-white/60" />
          {/* Tiny chevron pointing down — toward the sea section below */}
          <svg
            aria-hidden
            viewBox="0 0 12 8"
            className="h-2 w-3 fill-none stroke-white/80"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 1 L6 6 L11 1" />
          </svg>
        </a>
      </div>
    </section>
  );
}
