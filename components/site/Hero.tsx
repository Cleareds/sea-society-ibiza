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
}: HeroProps) {
  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[var(--color-primary)]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/55" />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 pb-24 pt-32 text-center text-white md:pt-40">
        <p className="text-xs uppercase tracking-[0.35em] text-white/80">
          One platform. Endless experiences at sea.
        </p>
        <h1 className="mt-6 max-w-4xl font-serif text-[10vw] leading-[1.02] tracking-tight md:text-7xl lg:text-[88px]">
          {headline}
        </h1>
        <p className="mt-6 max-w-xl text-base text-white/85 md:text-lg">{sub}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="primary">
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
          <Button asChild size="lg" variant="outlineLight">
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-white/70">
        <span aria-hidden>↓</span> scroll
      </div>
    </section>
  );
}
