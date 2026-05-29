import Image from "next/image";
import { BookHereCTA } from "@/components/site/BookHereCTA";

interface HeroProps {
  /** Headline rendered as React node so the caller can colour-highlight words. */
  headline: React.ReactNode;
  sub: React.ReactNode;
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

      {/* Scroll cue — "Scroll" label + a gently bobbing arrow
          (.home-cue-arrow). Same treatment as the preview hero. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[max(env(safe-area-inset-bottom),1.5rem)] z-10 flex justify-center">
        <a
          href="#after-hero"
          aria-label="Scroll to next section"
          className="pointer-events-auto inline-flex flex-col items-center gap-3 text-white/80 transition-opacity hover:text-white"
        >
          <span className="text-[10px] uppercase tracking-[0.35em] text-white/85">
            {scrollLabel}
          </span>
          <span className="home-cue-arrow inline-block" aria-hidden>
            <svg
              viewBox="0 0 16 24"
              className="h-6 w-4 fill-none stroke-white/85"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 1 L8 19" />
              <path d="M2 14 L8 21 L14 14" />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}
