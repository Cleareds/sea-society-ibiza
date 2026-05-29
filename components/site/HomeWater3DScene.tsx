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
    // All three phases (hero / cards / IG) are now driven by the same
    // runway-progress RAF so the cross-fades happen at matching
    // intervals. Each transition takes 0.15 of runway scroll.
    //
    // Phase windows:
    //   Hero:  visible 0.00–0.30, fades out 0.30–0.45
    //   Cards: fade in 0.30–0.45, visible 0.45–0.65, fade out 0.65–0.80
    //   IG:    fade in 0.65–0.80, stays to 1.00
    //
    // The 0.30→0.45 transition (hero→cards) and the 0.65→0.80
    // transition (cards→IG) are identical 0.15-wide cross-fades — what
    // the user asked for.
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const p = progressRef.current;
      // Desktop = full progress-driven cross-fade. Mobile = sections
      // flow naturally past the sticky sea video, so we don't
      // animate opacity below md (which would otherwise leave IG
      // stuck at 0 until the user has scrolled past 65% of runway).
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
      // Hero text fades MUCH faster on mobile — the pinned sticky
      // overlaps with the in-flow cards as they scroll up, so we
      // need the hero text gone before cards reach the upper half
      // of the viewport.
      const heroOpacity = isDesktop
        ? clamp01(1 - (p - 0.30) / 0.15)
        : clamp01(1 - p / 0.10);
      const cardsOpacity = Math.min(
        clamp01((p - 0.30) / 0.15),
        clamp01(1 - (p - 0.65) / 0.15),
      );
      const igOpacity = isDesktop ? clamp01((p - 0.65) / 0.15) : 1;
      if (heroRef.current) {
        heroRef.current.style.opacity = String(heroOpacity);
        heroRef.current.style.pointerEvents = heroOpacity < 0.05 ? "none" : "";
      }
      if (igRef.current) {
        igRef.current.style.opacity = String(igOpacity);
        igRef.current.style.pointerEvents = igOpacity < 0.05 ? "none" : "";
      }
      if (cardsRef.current) {
        cardsRef.current.style.opacity = String(cardsOpacity);
        cardsRef.current.style.pointerEvents = cardsOpacity < 0.05 ? "none" : "";
      }
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div
      ref={runwayRef}
      // Runway height — desktop uses an exact svh count to drive the
      // progress-based cross-fade choreography. Mobile lets the box
      // size to its in-flow children (cards / IG / brand icon), so
      // the sticky pin (canvas backdrop) stays glued to the top of
      // the viewport across the entire runway and every block reads
      // on the sea video, not on white.
      className="relative z-10 w-full md:h-[var(--runway-h-desktop)]"
      data-cursor-bg="dark"
      style={{ ['--runway-h-desktop' as string]: `${scrubViewports * 100}svh` } as React.CSSProperties}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* LCP poster — Next/Image marked priority + fetchPriority="high".
            Rendered BEHIND the WebGL canvas as a real <img>, so it's the
            largest contentful element painted by the browser (better LCP
            than waiting for the video texture to decode + first three.js
            tick to render). The canvas paints on top of it within ~one
            frame, but if anything delays the canvas (JS not yet hydrated,
            video still decoding) the user sees the poster instead of an
            empty hero. */}
        {posterSrc && (
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
            <Image
              src={posterSrc}
              alt=""
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}
        {reduced ? null : (
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

      {/* PHASE B (mobile) — yacht cards in NORMAL FLOW after the
          sticky pin, scrolling past the still-pinned sea video.
          Hidden on desktop (absolute-pinned version inside the pin
          takes over). Generous vertical padding for a slower
          scroll-in feel. */}
      <div className="relative z-10 w-full px-5 pt-[28svh] pb-[10svh] md:hidden">
        <div className="mx-auto w-full max-w-(--spacing-container-max)">
          {renderCardsContent({ featured, lp, variantTag, accentClassName })}
        </div>
      </div>

      {/* Spacer — DESKTOP ONLY. Pushes IG to its cross-fade window
          inside the runway. On mobile we don't need it since each
          block flows naturally past the sticky video. */}
      {instagramSlot && (
        <div
          aria-hidden
          className="pointer-events-none hidden w-full md:block"
          style={{
            // IG must enter the viewport while runway-progress p is
            // around 0.65. For a 6×100svh runway, p=0.65 maps to
            // scrollY ≈ 3.25vh, so IG's doc position should sit at
            // ≈ 4.25vh. Sticky pin owns 1vh, so spacer ≈ 3.25vh =
            // 325svh on the default 6vh runway.
            height: `${Math.max(0, (scrubViewports - 1) * 100 - 175)}svh`,
          }}
        />
      )}

      {/* IG — normal flow, scrolls over the sticky video. Same block
          on both breakpoints; desktop opacity is animated via the
          progress-driven RAF, mobile renders at full opacity since
          opacity hits 1.0 the moment scroll progress hits the IG
          window. */}
      {instagramSlot && (
        <div
          ref={igRef}
          className={`pointer-events-auto relative z-10 w-full px-5 pt-[4svh] md:px-10 md:opacity-0 md:transition-opacity md:duration-500 ${
            brandCloseSlot ? "pb-[3svh]" : "pb-[14svh]"
          }`}
        >
          <div className="mx-auto w-full max-w-(--spacing-container-max)">
            {instagramSlot}
          </div>
        </div>
      )}

      {/* Brand close — sits below IG, still inside the runway so the
          pinned sea video continues underneath. */}
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
