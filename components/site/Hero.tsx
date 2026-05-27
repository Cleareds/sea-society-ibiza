import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroProps {
  headline: string;
  sub: string;
  imageSrc: string;
  imageAlt: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  eyebrow?: string;
  scrollLabel?: string;
  /**
   * When true (default), the hero pins to the top of the viewport via
   * `position: sticky`. Subsequent sections must carry `relative z-10`
   * + a solid background so they scroll *over* it, creating the
   * background-cover-fixed illusion without the iOS Safari bugs that
   * `background-attachment: fixed` has.
   */
  pinned?: boolean;
}

export function Hero({
  headline,
  sub,
  imageSrc,
  imageAlt,
  primaryHref = "/fleet",
  primaryLabel = "Explore the fleet",
  secondaryHref = "/contact",
  secondaryLabel = "Plan your charter",
  eyebrow = "One platform. Endless experiences at sea.",
  scrollLabel = "Scroll",
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
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        quality={85}
        className="object-cover motion-safe:animate-hero-zoom"
      />
      {/* Two-layer brand overlay: radial vignette + foot darken for CTA contrast. */}
      <div className="absolute inset-0 brand-image-overlay" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 pb-24 pt-28 text-center text-white md:pt-40">
        <p className="brand-eyebrow motion-safe:animate-hero-rise [animation-delay:120ms]">
          {eyebrow}
        </p>
        <h1 className="brand-headline motion-safe:animate-hero-rise mt-6 max-w-4xl text-[11vw] [animation-delay:240ms] md:text-7xl lg:text-[88px]">
          {headline}
        </h1>
        <p className="brand-sub motion-safe:animate-hero-rise mt-6 max-w-xl text-base [animation-delay:380ms] md:text-lg">
          {sub}
        </p>
        <div className="motion-safe:animate-hero-rise mt-10 flex flex-col gap-3 [animation-delay:520ms] sm:flex-row">
          <Button asChild size="lg" variant="primary">
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
          <Button asChild size="lg" variant="outlineLight">
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        </div>
      </div>

      {/* Scroll cue — centered via flex wrapper so we don't fight the
          keyframe transform on iOS Safari. Animation only translates Y. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[max(env(safe-area-inset-bottom),1.5rem)] z-10 flex justify-center">
        <a
          href="#after-hero"
          aria-label="Scroll to next section"
          className="motion-safe:animate-scroll-cue group pointer-events-auto inline-flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-white/85 hover:text-white"
        >
          {scrollLabel}
          <span aria-hidden className="block h-8 w-px bg-white/60" />
        </a>
      </div>
    </section>
  );
}
