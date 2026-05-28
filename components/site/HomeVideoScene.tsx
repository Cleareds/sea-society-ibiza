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

const HomeVideoCanvas = dynamic(
  () => import("./HomeVideoCanvas").then((m) => m.HomeVideoCanvas),
  { ssr: false, loading: () => null },
);

export type Typography =
  | "editorial-serif"
  | "oversized-minimal"
  | "mixed-weight"
  | "classical";

export interface CanvasOverrides {
  cursorLightStrength?: number;
  shimmerStrength?: number;
  brightnessLift?: number;
  tint?: [number, number, number];
  saturation?: number;
  contrast?: number;
  parallaxX?: number;
  parallaxY?: number;
}

export type Layout = "bottom-left" | "center" | "right-band";

export interface HomeVideoSceneProps {
  videoSrc: string;
  videoSrcMobile?: string;
  maskSrc: string;
  videoAspect: number;
  posterSrc?: string;
  whatsappNumber: string;
  featured: Array<{ boat: Boat; fromLabel: string }>;
  locale: Locale;
  headline: React.ReactNode;
  sub: string;
  typography?: Typography;
  layout?: Layout;
  canvas?: CanvasOverrides;
  variantTag?: string;
  /** How many viewports of scroll the user must cover to fully scrub
   *  through the video. Default 2.5 (smooth feel without dragging). */
  scrubViewports?: number;
}

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

const HEADLINE_CLASSES: Record<Typography, string> = {
  "editorial-serif":
    "brand-headline max-w-4xl text-[clamp(2.75rem,9vw,6rem)]",
  "oversized-minimal":
    "font-serif font-light tracking-tight max-w-5xl text-[clamp(3rem,12vw,8rem)] leading-[0.95]",
  "mixed-weight":
    "max-w-4xl text-[clamp(2.5rem,8vw,5.5rem)] leading-[1.02] font-serif italic [&_.brand-accent]:not-italic [&_.brand-accent]:font-normal",
  "classical":
    "font-serif uppercase tracking-[0.04em] max-w-3xl text-[clamp(2.25rem,7vw,4.75rem)] leading-[1.08]",
};

const SUB_CLASSES: Record<Typography, string> = {
  "editorial-serif": "brand-sub mt-6 max-w-xl text-base md:text-lg",
  "oversized-minimal":
    "mt-8 max-w-md text-sm uppercase tracking-[0.25em] text-white/80",
  "mixed-weight": "mt-6 max-w-xl text-base italic text-white/85 md:text-lg",
  "classical":
    "mt-6 max-w-xl text-sm uppercase tracking-[0.18em] text-white/80",
};

/**
 * Scroll-scrubbed video hero.
 *
 *   <runwayRef                 height: scrubViewports × 100vh>
 *     <div sticky top:0 h:100svh>          ← stays pinned while
 *       <HomeVideoCanvas />                  scroll advances
 *       <copy/CTA overlay />
 *     </div>
 *   </runwayRef>
 *
 *   <fleet cards section />                 ← reveals after runway ends
 */
export function HomeVideoScene(props: HomeVideoSceneProps) {
  const {
    videoSrc, videoSrcMobile, maskSrc, videoAspect, posterSrc,
    whatsappNumber, featured, locale,
    headline, sub,
    typography = "editorial-serif",
    layout = "bottom-left",
    canvas,
    variantTag,
    scrubViewports = 2.5,
  } = props;
  const reduced = useReducedMotion();
  const lp = (p: string) => localePath(locale, p);
  const runwayRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Scroll runway — tall outer wrapper, sticky inner pins the
          canvas + copy to the viewport while scroll advances. The
          canvas maps progress through this runway → video.currentTime. */}
      <div
        ref={runwayRef}
        className="relative z-10 w-full"
        style={{ height: `${scrubViewports * 100}svh` }}
      >
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          {reduced ? (
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
              {posterSrc && (
                <Image
                  src={posterSrc}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              )}
            </div>
          ) : (
            <HomeVideoCanvas
              videoSrc={videoSrc}
              videoSrcMobile={videoSrcMobile}
              maskSrc={maskSrc}
              videoAspect={videoAspect}
              posterSrc={posterSrc}
              scrubScopeRef={runwayRef}
              {...(canvas ?? {})}
            />
          )}

          {/* Copy overlay — sits in front of the canvas. */}
          <div
            className={
              "relative z-10 mx-auto flex h-full w-full max-w-(--spacing-container-max) flex-col px-5 pt-28 pb-28 text-white md:px-10 md:pt-40 md:pb-40 " +
              (layout === "center"
                ? "items-center justify-center text-center"
                : layout === "right-band"
                  ? "items-end justify-end text-right"
                  : "justify-end")
            }
          >
            <h1 className={HEADLINE_CLASSES[typography]}>{headline}</h1>
            <p className={SUB_CLASSES[typography]}>{sub}</p>
            <div className={layout === "center" ? "mt-10 flex justify-center" : "mt-10"}>
              <BookHereCTA number={whatsappNumber} size="lg" label="Book here" />
            </div>

            {/* Scroll cue */}
            <div className="pointer-events-none absolute inset-x-0 bottom-[max(env(safe-area-inset-bottom),1.5rem)] z-10 flex justify-center">
              <span className="pointer-events-auto inline-flex flex-col items-center gap-3 text-white/80">
                <span className="text-[10px] uppercase tracking-[0.35em] text-white/85">
                  Scroll
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
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet cards — reveals after the scroll runway. Bg solid so
          the canvas above is fully hidden (no more z-stacking trick). */}
      <section
        id="fleet-cards"
        className="relative z-10 w-full bg-[var(--color-surface)] text-[var(--color-on-surface)]"
      >
        <div className="mx-auto w-full max-w-(--spacing-container-max) px-5 py-20 md:px-10 md:py-32">
          <ul className="grid gap-6 md:grid-cols-3 md:gap-8">
            {featured.slice(0, 3).map(({ boat: b, fromLabel }) => (
              <li
                key={b.id}
                className="overflow-hidden rounded-2xl bg-[var(--color-surface-container-low)] ring-1 ring-[var(--color-outline-variant)]/40"
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
                    <h3 className="font-serif text-xl md:text-2xl">{b.name}</h3>
                    <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">{fromLabel}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex items-center justify-between md:mt-14">
            {variantTag && (
              <span className="rounded-full bg-[var(--color-surface-container-low)] px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
                {variantTag}
              </span>
            )}
            <Link
              href={lp("/fleet")}
              className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-primary)]"
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
