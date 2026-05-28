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
 * Pinned WebGL "stage" + a natural-flow yacht-cards block over a frozen
 * sea backdrop.
 *
 * Stage scroll (sticky canvas):
 *   - phase A (~2/3 of the pin on desktop): the camera pans down through
 *     the portrait Es Vedra photo. Hero copy stays in place; everything
 *     except the sea is locked.
 *   - phase B (~1/3): the camera zooms into the sea band; hero copy
 *     fades out; "A fleet. One Mediterranean." fades in.
 *
 * After the pin releases, the canvas is gone. The cards section uses a
 * static cover-fit photo of the same hero (positioned to show only the
 * sea region) as its backdrop, and the yacht cards scroll one-by-one
 * in natural document flow at whatever height they need.
 */
export function HomeImmersiveScene({ whatsappNumber, featured, locale }: Props) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const panRef = React.useRef(0);
  const zoomRef = React.useRef(0);
  const heroCopyRef = React.useRef<HTMLDivElement>(null);
  const fleetCopyRef = React.useRef<HTMLDivElement>(null);
  const cueRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let raf = 0;

    const tick = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const total = el.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, scrolled / total) : 0;

      // Split progress into pan + zoom phases.
      // Pan runs across the first 2/3 of the pin (longer on desktop
      // because the stage is taller); zoom takes the last 1/3.
      const panEnd = 0.66;
      const pan = clamp(p / panEnd, 0, 1);
      const zoom = clamp((p - panEnd) / (1 - panEnd), 0, 1);
      panRef.current = pan;
      zoomRef.current = zoom;

      // Hero copy stays in place during the pan, fades out as the zoom
      // begins so the camera move feels like one continuous beat.
      const heroOp = clamp(1 - zoom * 1.3, 0, 1);
      if (heroCopyRef.current) {
        heroCopyRef.current.style.opacity = String(heroOp);
        heroCopyRef.current.style.pointerEvents = heroOp > 0.4 ? "auto" : "none";
      }
      // Fleet copy fades in over the zoom — by the time the zoom is done,
      // it's fully visible.
      const fleetOp = clamp((zoom - 0.20) / 0.6, 0, 1);
      if (fleetCopyRef.current) {
        fleetCopyRef.current.style.opacity = String(fleetOp);
      }
      if (cueRef.current) {
        cueRef.current.style.opacity = String(clamp(1 - pan * 6, 0, 1));
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
    <>
      {/* ---------- STAGE — sticky canvas, pan + zoom by scroll. ----------
          Desktop pin: 3 viewport heights so the user gets 2 screens of
          pure hero pan before the zoom begins.
          Mobile pin: 2 viewport heights — image is portrait and already
          mostly visible, so we skip the vertical pan and go straight
          into hero-then-zoom. */}
      <section
        ref={stageRef}
        className="relative w-full bg-[#06141a] text-white [--stage-h:200svh] md:[--stage-h:300svh]"
        style={{ height: "var(--stage-h)" }}
      >
        <div className="sticky top-0 isolate h-[100svh] w-full overflow-hidden">
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
            <HomeImmersiveCanvas panRef={panRef} zoomRef={zoomRef} />
          )}

          {/* Legibility overlay */}
          <div className="absolute inset-0 brand-image-overlay" />

          {/* Hero copy — visible across the entire pan phase */}
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

          {/* Fleet copy — crossfades in over the zoom phase */}
          <div
            ref={fleetCopyRef}
            className="pointer-events-none absolute inset-0 z-10 mx-auto flex h-full w-full max-w-(--spacing-container-max) flex-col justify-end px-5 pb-28 md:px-10 md:pb-40"
            style={{ opacity: 0 }}
          >
            <p className="brand-eyebrow">The fleet</p>
            <h2 className="brand-headline mt-3 max-w-3xl text-[clamp(2.25rem,7vw,5rem)]">
              A <span className="brand-accent">fleet</span>. One Mediterranean.
            </h2>
            <p className="brand-sub mt-6 max-w-xl text-base md:text-lg">
              Twenty-one yachts from Botafoc Marina. Pick the right one for
              the day — or send us a message and we will choose.
            </p>
          </div>

          {/* Scroll cue */}
          <div
            ref={cueRef}
            className="pointer-events-none absolute inset-x-0 bottom-[max(env(safe-area-inset-bottom),1.25rem)] z-10 flex justify-center"
          >
            <a
              href="#fleet-cards"
              aria-label="Scroll to the fleet"
              className="motion-safe:animate-scroll-cue group pointer-events-auto inline-flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-white/85 hover:text-white"
            >
              Scroll
              <span aria-hidden className="block h-10 w-px bg-white/60" />
              <svg aria-hidden viewBox="0 0 12 8" className="h-2 w-3 fill-none stroke-white/80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1 L6 6 L11 1" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ---------- CARDS — natural flow on a frozen sea backdrop. ----------
          The hero photo is rendered behind, biased so the sea band fills
          the visible area. No animation here — the sea is static, the
          yacht cards scroll one-by-one as the user moves down the page. */}
      <section
        id="fleet-cards"
        className="relative isolate w-full overflow-hidden bg-[#06141a] text-white"
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src="/sea-society/site/home-hero.webp"
            alt=""
            fill
            sizes="100vw"
            quality={85}
            className="object-cover"
            style={{ objectPosition: "20% 55%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06141a]/40 via-[#06141a]/55 to-[#06141a]/80" />
        </div>

        <div className="mx-auto max-w-(--spacing-container-max) px-5 py-20 md:px-10 md:py-32">
          <ul className="grid gap-6 md:grid-cols-3 md:gap-8">
            {featured.slice(0, 3).map(({ boat: b, fromLabel }) => (
              <li
                key={b.id}
                className="overflow-hidden rounded-2xl bg-black/45 backdrop-blur-md ring-1 ring-white/15"
              >
                <Link href={lp(`/fleet/${b.slug}`)} className="group block">
                  <div className="relative aspect-[5/3] overflow-hidden">
                    <Image
                      src={b.heroImage}
                      alt={`${b.name} — ${b.modelName ?? b.brand}`}
                      fill
                      sizes="(min-width: 768px) 30vw, 90vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="brand-eyebrow text-[10px]">{b.brand}</p>
                    <h3 className="font-serif text-xl text-white md:text-2xl">{b.name}</h3>
                    <p className="mt-2 text-sm text-white/85">{fromLabel}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex justify-end md:mt-14">
            <Link
              href={lp("/fleet")}
              className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-white/90 transition-colors hover:text-white"
            >
              See the full fleet
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
