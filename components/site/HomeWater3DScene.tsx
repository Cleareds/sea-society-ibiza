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

const HomeWater3DCanvas = dynamic(
  () => import("./HomeWater3DCanvas").then((m) => m.HomeWater3DCanvas),
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
  waterMotion?: number;
}

export type Layout = "bottom-left" | "center" | "right-band";

export interface HomeWater3DSceneProps {
  videoSrc: string;
  videoSrcMobile?: string;
  maskSrc: string;
  videoAspect: number;
  posterSrc?: string;
  whatsappNumber: string;
  featured: Array<{ boat: Boat; fromLabel: string }>;
  locale: Locale;
  headline: React.ReactNode;
  /** Extra class names merged into the h1 — used to apply the wave-fill
   *  treatment on individual variants without changing the shared
   *  typography preset. */
  headlineClassName?: string;
  /** Class merged into ALL brand-accent spans (the h1 focus word AND
   *  the h2 'Explore the fleet' focus word) on this scene. */
  accentClassName?: string;
  sub: React.ReactNode;
  typography?: Typography;
  layout?: Layout;
  canvas?: CanvasOverrides;
  variantTag?: string;
  scrubViewports?: number;
  panMode?: "none" | "vertical";
  /** Optional per-frame depth video — passed straight through to
   *  HomeVideoCanvas. When set, the shader uses live depth for masks
   *  instead of the static maskSrc PNG. */
  depthVideoSrc?: string;
  depthVideoSrcMobile?: string;
  depthWaterLo?: number;
  depthWaterHi?: number;
  yachtDepthThreshold?: number;
  horizonY?: number;
  /** Synthetic-sea mode — fully replace sea pixels with shader output. */
  seaMode?: "photo" | "synthetic";
  seaShallowColor?: [number, number, number];
  seaDeepColor?: [number, number, number];
  seaFoamColor?: [number, number, number];
  seaSunDir?: [number, number, number];
  skyColor?: [number, number, number];
  waveScale?: number;
  cameraHeight?: number;
  cameraDolly?: number;
  seaBlend?: number;
  /** Optional Instagram slot — rendered as the third phase (after the
   *  yacht cards) over the still-scrubbing video. Pass <InstagramFeed />
   *  from the page. */
  instagramSlot?: React.ReactNode;
  /** Instagram handle + URL — used for a small "follow" link inside the
   *  glass panel. Optional; falls back to nothing if omitted. */
  instagramHandle?: string;
  instagramHref?: string;
  /** Optional content rendered after the IG block, still inside the
   *  scroll runway so it sits on the same pinned video backdrop.
   *  Used for the open-sea page's branded SS-icon close. */
  brandCloseSlot?: React.ReactNode;
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
 * Hook: tracks scroll progress through a given element. Returns a ref to
 * stick on the runway + a live 0..1 progress value. Updates on a RAF
 * loop so it stays smooth.
 */
function useScrollProgress(): [
  React.RefObject<HTMLDivElement | null>,
  React.RefObject<number>,
] {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const progressRef = React.useRef(0);

  React.useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = Math.max(1, el.offsetHeight - window.innerHeight);
      const scrolled = Math.max(0, -rect.top);
      progressRef.current = Math.min(1, scrolled / total);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return [ref, progressRef];
}

/**
 * Three phases laid out on top of the same scroll runway:
 *
 *   p in [0.00, 0.35]  → hero text + CTA visible, no yacht cards
 *   p in [0.35, 0.55]  → cross-fade — text out, cards in
 *   p in [0.55, 1.00]  → yacht cards visible over the still-scrubbing
 *                         video; frosted-glass tiles, no white panel
 *
 * The video continues scrubbing through the whole runway, so the
 * footage is alive behind the yacht cards too.
 */
export function HomeWater3DScene(props: HomeWater3DSceneProps) {
  const {
    videoSrc, videoSrcMobile, maskSrc, videoAspect, posterSrc,
    whatsappNumber, featured, locale,
    headline, headlineClassName, accentClassName, sub,
    typography = "editorial-serif",
    layout = "bottom-left",
    canvas,
    variantTag,
    scrubViewports = 4,
    panMode = "none",
    depthVideoSrc,
    depthVideoSrcMobile,
    depthWaterLo,
    depthWaterHi,
    yachtDepthThreshold,
    horizonY,
    seaMode,
    seaShallowColor,
    seaDeepColor,
    seaFoamColor,
    seaSunDir,
    skyColor,
    waveScale,
    cameraHeight,
    cameraDolly,
    seaBlend,
    instagramSlot,
    instagramHandle,
    instagramHref,
    brandCloseSlot,
  } = props;
  const reduced = useReducedMotion();
  const lp = (p: string) => localePath(locale, p);

  // ---- Scroll-progress driven overlays --------------------------------
  const [runwayRef, progressRef] = useScrollProgress();
  const heroRef = React.useRef<HTMLDivElement>(null);
  const cardsRef = React.useRef<HTMLDivElement>(null);
  const igRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let raf = 0;
    // Hero + yacht cards remain absolute-overlay phases on top of the
    // sticky canvas (they're "screen-based" by design — they sell the
    // pinned video). IG is the exception — it lives in normal flow at
    // the bottom of the runway so it scrolls naturally over the
    // already-pinned video, with sea visible around it.
    //
    // Phase windows:
    //   Hero:  visible 0.00–0.30, fades out by 0.45
    //   Cards: fade in 0.30–0.45, fade out 0.65–0.75
    //   (IG opacity is driven by its OWN intersection — see useEffect
    //    below — so it has nothing to do with this RAF.)
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const p = progressRef.current;
      const heroOpacity = clamp01(1 - (p - 0.30) / 0.15);
      const cardsOpacity = Math.min(
        clamp01((p - 0.30) / 0.15),
        clamp01(1 - (p - 0.65) / 0.10),
      );
      if (heroRef.current) {
        heroRef.current.style.opacity = String(heroOpacity);
        heroRef.current.style.pointerEvents = heroOpacity < 0.05 ? "none" : "";
      }
      if (cardsRef.current) {
        cardsRef.current.style.opacity = String(cardsOpacity);
        cardsRef.current.style.pointerEvents = cardsOpacity < 0.05 ? "none" : "";
      }
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  // IG block fade-in based on its OWN scroll position (intersection
  // with the viewport) so it appears 1–2 viewports before the runway
  // ends, regardless of how long the runway is.
  React.useEffect(() => {
    if (!instagramSlot) return;
    const el = igRef.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Fade in as the top of the block enters the lower half of the
      // viewport; fully visible by the time it's centred.
      const t = (vh - rect.top) / (vh * 0.7);
      el.style.opacity = String(clamp01(t));
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [instagramSlot]);

  return (
    <div
      ref={runwayRef}
      className="relative z-10 w-full"
      data-cursor-bg="dark"
      style={{ height: `${scrubViewports * 100}svh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {reduced ? (
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
            {posterSrc && (
              <Image src={posterSrc} alt="" fill priority sizes="100vw" className="object-cover" />
            )}
          </div>
        ) : (
          <HomeWater3DCanvas
            videoSrc={videoSrc}
            videoSrcMobile={videoSrcMobile}
            depthVideoSrc={depthVideoSrc}
            yachtDepthThreshold={yachtDepthThreshold}
            horizonY={horizonY}
            seaShallow={seaShallowColor}
            seaDeep={seaDeepColor}
            seaFoam={seaFoamColor}
            sunDir={seaSunDir}
            skyColor={skyColor}
            waveScale={waveScale}
            cameraHeight={cameraHeight}
            cameraDolly={cameraDolly}
            videoAspect={videoAspect}
            posterSrc={posterSrc}
            scrubScopeRef={runwayRef}
          />
        )}

        {/* PHASE A — hero text. Fades out as user scrolls past 30% */}
        <div
          ref={heroRef}
          className="absolute inset-0 z-10 transition-opacity duration-300"
        >
          <div
            className={
              "relative z-10 mx-auto flex h-full w-full max-w-(--spacing-container-max) flex-col px-5 pt-28 pb-40 text-white md:px-10 md:pt-40 md:pb-56 " +
              (layout === "center"
                ? "items-center justify-center text-center"
                : layout === "right-band"
                  ? "items-end justify-end text-right"
                  : "justify-end")
            }
          >
            <h1 className={`${HEADLINE_CLASSES[typography]} ${headlineClassName ?? ""}`.trim()}>{headline}</h1>
            <p className={SUB_CLASSES[typography]}>{sub}</p>
            <div className={layout === "center" ? "mt-10 flex justify-center" : "mt-10"}>
              <BookHereCTA number={whatsappNumber} size="lg" label="Book here" />
            </div>
          </div>

          {/* Scroll cue — anchored bottom of viewport, separate from copy. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[max(env(safe-area-inset-bottom),1.5rem)] z-10 flex justify-center">
            <span className="inline-flex flex-col items-center gap-3 text-white/80">
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

        {/* PHASE B (desktop) — yacht cards absolute-pinned over the live
            video, fading in/out via scroll progress. Single-row grid fits
            in the viewport at ≥ md breakpoints. Hidden on mobile — see
            the relative-flow version below. */}
        <div
          ref={cardsRef}
          className="absolute inset-0 z-10 hidden items-center opacity-0 transition-opacity duration-300 md:flex"
        >
          <div className="mx-auto w-full max-w-(--spacing-container-max) px-5 md:px-10">
            {renderCardsContent({ featured, lp, variantTag, accentClassName })}
          </div>
        </div>

      </div>

      {/* PHASE B (mobile) — cards in NORMAL FLOW after the sticky pin,
          so 3 stacked cards can scroll past the still-pinned video
          without overflowing the viewport. Always visible on mobile;
          the desktop absolute-pinned version above takes over at md. */}
      <div className="relative z-10 w-full px-5 py-[8svh] md:hidden">
        <div className="mx-auto w-full max-w-(--spacing-container-max)">
          {renderCardsContent({ featured, lp, variantTag, accentClassName })}
        </div>
      </div>

      {/* Spacer — pushes the IG block down toward the end of the
          runway so it enters the viewport around scroll progress 0.80
          (i.e. ~1–2s before the video reaches its last frame). The
          sticky inner takes the first 100svh; this spacer fills the
          gap so the IG block sits near the runway tail. */}
      {instagramSlot && (
        <>
          <div
            aria-hidden
            className="pointer-events-none w-full"
            style={{
              // Take all but ~1.2 viewports of the remaining runway
              // (sticky already consumed 1; we want IG to start ~80%
              // through). The math is: runway-1 (sticky already
              // consumed 1vh) minus the IG block's own ~1.2vh height.
              height: `${Math.max(0, (scrubViewports - 1) * 100 - 120)}svh`,
            }}
          />
          {/* IG — normal flow, scrolls over the sticky video. No
              glass frame, just side + bottom padding so the sea is
              visible around it. Fade-in driven by viewport
              intersection. */}
          <div
            ref={igRef}
            className={`pointer-events-auto relative z-10 w-full px-5 pt-[4svh] opacity-0 transition-opacity duration-500 md:px-10 ${
              brandCloseSlot ? "pb-[3svh]" : "pb-[14svh]"
            }`}
          >
            <div className="mx-auto w-full max-w-(--spacing-container-max)">
              {instagramSlot}
            </div>
          </div>
        </>
      )}

      {/* Brand close — sits below IG, still inside the runway so the
          pinned video backdrop continues underneath it. Padded to
          flow tight with the IG block above and the page footer
          below. */}
      {brandCloseSlot && (
        <div className="relative z-10 flex w-full items-center justify-center px-5 pb-[8svh] pt-[2svh] md:px-10">
          {brandCloseSlot}
        </div>
      )}
    </div>
  );
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function renderCardsContent({
  featured,
  lp,
  variantTag,
  accentClassName,
}: {
  featured: Array<{ boat: Boat; fromLabel: string }>;
  lp: (p: string) => string;
  variantTag?: string;
  accentClassName?: string;
}) {
  const accentCls = `brand-accent ${accentClassName ?? ""}`.trim();
  return (
    <>
      <div className="flex items-baseline justify-between gap-4 pb-6 text-white">
        <h2 className="font-serif text-2xl md:text-4xl">
          <span className={accentCls}>Explore</span> the fleet
        </h2>
        <Link
          href={lp("/fleet")}
          className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-white/90 transition-colors hover:text-white"
        >
          See all
          <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
        {featured.slice(0, 3).map(({ boat: b, fromLabel }) => (
          <li
            key={b.id}
            className="overflow-hidden rounded-2xl border border-white/20 bg-black/35 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)] backdrop-blur-xl backdrop-saturate-150"
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
              <div className="p-4 md:p-5">
                <p className="brand-eyebrow text-[10px] text-white/75">{b.brand}</p>
                <h3 className="mt-1 font-serif text-lg text-white md:text-xl">{b.name}</h3>
                <p className="mt-1 text-xs text-white/80">{fromLabel}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {variantTag && (
        <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-white/55">
          {variantTag}
        </p>
      )}
    </>
  );
}
