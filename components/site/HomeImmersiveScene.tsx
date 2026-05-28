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
 * Fixed-canvas backdrop + flow content.
 *
 *   - HomeImmersiveCanvas is fixed inset-0 z-[-1] and stays behind ALL
 *     page sections (until the footer's own background covers it). It
 *     reads window.scrollY directly each frame.
 *
 *   - Page content (hero copy, yacht cards) lives in natural document
 *     flow on top of the canvas. There is no sticky pinning, no overlay
 *     text on top of the cards — the hero text scrolls up as the user
 *     scrolls down, and the yacht cards arrive in their own time.
 *
 *   - Canvas phases driven by scrollY:
 *        0       → 1×vh   : full Es Vedra. Sea animating; subject locked.
 *        1×vh    → 2×vh   : smooth zoom into the sea band.
 *        > 2×vh           : stays at the zoomed sea forever (or until
 *                            the footer's own bg hides it).
 */
export function HomeImmersiveScene({ whatsappNumber, featured, locale }: Props) {
  const reduced = useReducedMotion();
  const lp = (path: string) => localePath(locale, path);

  return (
    <>
      {/* Fixed page backdrop. Sits at z-0 with the page main background
          made transparent on the host page; content sections layer at
          z-10 so they sit above the canvas. The canvas stays at full
          opacity for the entire page — the footer's own background
          takes over visually once the user scrolls into it. */}
      {reduced ? (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
          <Image
            src="/sea-society/site/home-hero.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={85}
            className="object-cover"
          />
        </div>
      ) : (
        <HomeImmersiveCanvas />
      )}

      <div>
      {/* ---------- HERO — natural flow, scrolls away normally. ----------
          NO brand-image-overlay (the user explicitly does not want any
          dark blur on the first slide). The brand-headline class
          carries text-shadow which gives the title enough contrast on
          the raw photo. */}
      <section className="relative z-10 w-full text-white" style={{ height: "100svh" }}>
        <div className="relative z-10 mx-auto flex h-full w-full max-w-(--spacing-container-max) flex-col justify-end px-5 pb-28 pt-28 md:px-10 md:pb-40 md:pt-40">
          <h1 className="brand-headline max-w-4xl text-[clamp(2.75rem,9vw,6rem)]">
            Ibiza is <span className="brand-accent">different</span>
            <br className="hidden md:block" /> from the sea.
          </h1>
          <p className="brand-sub mt-6 max-w-xl text-base md:text-lg">
            From the moment you step aboard at Botafoc Marina to the moment
            you watch the sun dissolve into the Mediterranean, every detail
            is handled.
          </p>
          <div className="mt-10">
            <BookHereCTA number={whatsappNumber} size="lg" label="Book here" />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-[max(env(safe-area-inset-bottom),1.25rem)] z-10 flex justify-center">
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

      {/* ---------- FLEET CARDS — natural flow on top of the canvas. ----------
          No backdrop block, no overlay text on the cards. The cards
          have their own bg-black/45 + backdrop-blur on each tile for
          legibility; the rest of the section reads the sea straight. */}
      <section id="fleet-cards" className="relative z-10 w-full text-white">
        <div className="relative z-10 mx-auto max-w-(--spacing-container-max) px-5 py-20 md:px-10 md:py-32">
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
      </div>
    </>
  );
}
