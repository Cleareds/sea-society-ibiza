"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { BookHereCTA } from "@/components/site/BookHereCTA";
import { ArrowRight } from "lucide-react";
import type { Boat } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";

const HomeImmersiveCanvas = dynamic(
  () => import("./HomeImmersiveCanvas").then((m) => m.HomeImmersiveCanvas),
  { ssr: false, loading: () => null },
);

/** Returns true when the user has prefers-reduced-motion: reduce. */
function useReducedMotion(): boolean {
  return React.useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      const q = window.matchMedia("(prefers-reduced-motion: reduce)");
      q.addEventListener("change", cb);
      return () => q.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export interface HomeFeaturedBoat {
  boat: Boat;
  fromLabel: string;
}

interface Props {
  whatsappNumber: string;
  featured: HomeFeaturedBoat[];
  locale: Locale;
}

/**
 * Pinned WebGL scene that holds the entire upper homepage:
 *
 *   - 1 viewport — hero text ("Ibiza is different from the sea.") sits
 *     over the full Es Vedra frame.
 *   - 1 viewport — second-screen text ("Three yachts. One Mediterranean.")
 *     crossfades in as the canvas zooms into the sea region.
 *   - 1 viewport — fleet cards layer over the zoomed sea + a "See the
 *     full fleet" link.
 *
 * The whole block is a single 3×100vh section. The canvas is sticky
 * inside, the text panels scroll through it via opacity tied to scroll
 * progress.
 */
export function HomeImmersiveScene({ whatsappNumber, featured, locale }: Props) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const progressRef = React.useRef(0);
  const reduced = useReducedMotion();
  const heroCopyRef = React.useRef<HTMLDivElement>(null);
  const fleetCopyRef = React.useRef<HTMLDivElement>(null);
  const cardsRef = React.useRef<HTMLDivElement>(null);
  const cueRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;

    const tick = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const total = el.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, scrolled / total) : 0;
      progressRef.current = p;

      // Hero copy fades 0.0 → 0.30
      const heroOp = clamp(1 - p / 0.30, 0, 1);
      if (heroCopyRef.current) {
        heroCopyRef.current.style.opacity = String(heroOp);
        heroCopyRef.current.style.pointerEvents = heroOp > 0.4 ? "auto" : "none";
      }
      // Scroll cue fades 0.0 → 0.05
      if (cueRef.current) {
        cueRef.current.style.opacity = String(clamp(1 - p / 0.05, 0, 1));
      }
      // Fleet headline fades in 0.35 → 0.55
      const fleetTxt = clamp((p - 0.35) / 0.20, 0, 1);
      if (fleetCopyRef.current) {
        fleetCopyRef.current.style.opacity = String(fleetTxt);
      }
      // Yacht cards rise in 0.55 → 0.80
      const cardsOp = clamp((p - 0.55) / 0.25, 0, 1);
      if (cardsRef.current) {
        cardsRef.current.style.opacity = String(cardsOp);
        cardsRef.current.style.transform = `translateY(${(1 - cardsOp) * 24}px)`;
        cardsRef.current.style.pointerEvents = cardsOp > 0.5 ? "auto" : "none";
      }
    };

    const schedule = () => { if (!raf) raf = requestAnimationFrame(tick); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const lp = (path: string) => localePath(locale, path);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#06141a] text-white"
      // 3 viewport heights — gives 2vh of scroll to drive the
      // progress 0→1 inside the sticky canvas.
      style={{ height: "300svh" }}
    >
      <div className="sticky top-0 isolate h-[100svh] w-full overflow-hidden">
        {/* Background — WebGL canvas for motion users, static cover image
            for prefers-reduced-motion (no shader, no RAF, no GPU work). */}
        {reduced ? (
          <div className="absolute inset-0 -z-10">
            <Image
              src="/sea-society/site/home-hero.webp"
              alt="Looking out at Es Vedra rock at golden hour."
              fill
              priority
              sizes="100vw"
              quality={85}
              className="object-cover"
            />
          </div>
        ) : (
          <HomeImmersiveCanvas progressRef={progressRef} />
        )}

        {/* Legibility overlay — same brand gradient as the rest of the site. */}
        <div className="absolute inset-0 brand-image-overlay" />

        {/* SCREEN 1 — hero copy */}
        <div
          ref={heroCopyRef}
          className="absolute inset-0 z-10 mx-auto flex h-full w-full max-w-(--spacing-container-max) flex-col justify-end px-5 pb-28 pt-28 md:px-10 md:pb-40 md:pt-40"
        >
          <p className="brand-eyebrow">Sea Society Ibiza</p>
          <h1 className="brand-headline mt-5 max-w-4xl text-[clamp(2.75rem,9vw,6rem)]">
            Ibiza is <span className="brand-accent">different</span>
            <br className="hidden md:block" /> from the sea.
          </h1>
          <p className="brand-sub mt-6 max-w-xl text-base md:text-lg">
            One platform. Endless experiences at sea.
          </p>
          <div className="mt-10">
            <BookHereCTA number={whatsappNumber} size="lg" label="Book here" />
          </div>
        </div>

        {/* SCREEN 2 — second-screen headline (fades in above the cards) */}
        <div
          ref={fleetCopyRef}
          className="pointer-events-none absolute inset-x-0 top-[18svh] z-10 mx-auto w-full max-w-(--spacing-container-max) px-5 md:px-10"
          style={{ opacity: 0 }}
        >
          <p className="brand-eyebrow">The fleet</p>
          <h2 className="brand-headline mt-3 max-w-3xl text-[clamp(2rem,6.5vw,4.5rem)]">
            Three yachts. <span className="brand-accent">One</span> Mediterranean.
          </h2>
        </div>

        {/* SCREEN 3 — yacht cards (rise in) */}
        <div
          ref={cardsRef}
          className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-(--spacing-container-max) px-5 pb-12 md:px-10 md:pb-16"
          style={{ opacity: 0, transform: "translateY(24px)" }}
        >
          <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
            {featured.slice(0, 3).map(({ boat: b, fromLabel }) => (
              <li
                key={b.id}
                className="overflow-hidden rounded-2xl bg-black/40 backdrop-blur-md ring-1 ring-white/15"
              >
                <Link
                  href={lp(`/fleet/${b.slug}`)}
                  className="group block"
                >
                  <div className="relative aspect-[5/3] overflow-hidden">
                    <Image
                      src={b.heroImage}
                      alt={`${b.name} — ${b.modelName ?? b.brand}`}
                      fill
                      sizes="(min-width: 768px) 30vw, 90vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="brand-eyebrow text-[10px]">{b.brand}</p>
                    <h3 className="font-serif text-xl text-white md:text-2xl">{b.name}</h3>
                    <p className="mt-2 text-sm text-white/85">{fromLabel}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-end md:mt-8">
            <Link
              href={lp("/fleet")}
              className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-white/90 transition-colors hover:text-white"
            >
              See the full fleet
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Scroll cue at the bottom — fades by p=0.05 */}
        <div
          ref={cueRef}
          className="pointer-events-none absolute inset-x-0 bottom-[max(env(safe-area-inset-bottom),1.25rem)] z-10 flex justify-center"
        >
          <a
            href="#after-hero"
            aria-label="Scroll to next section"
            className="motion-safe:animate-scroll-cue group pointer-events-auto inline-flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-white/85 hover:text-white"
          >
            Scroll
            <span aria-hidden className="block h-10 w-px bg-white/60" />
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
      </div>
    </section>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
