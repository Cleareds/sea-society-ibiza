"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import "./immersive-hero.css";

/**
 * Sea Society immersive hero — two scroll-linked depth-mapped slides.
 *
 * Visual story (driven by scroll over a 2× viewport container):
 *   0.00 → 0.30  Slide 1 holds. Subtle horizontal drift + cursor ripple.
 *   0.30 → 0.65  Slide 1 gently pivots away (tiny Z-rotation + recede)
 *                and starts fading.
 *   0.55 → 1.00  Slide 2 emerges through soft warped UVs, parallax kicks
 *                in, water effects move to slide 2. By 1.0 the new yacht
 *                fully fills the screen.
 *
 * Assets:
 *   /public/sea-society/new/hero.webp       — slide 1 colour
 *   /public/sea-society/new/hero-depth.png  — slide 1 grayscale depth
 *   /public/sea-society/hero.webp           — slide 2 colour
 *   /public/sea-society/hero-depth.png      — slide 2 grayscale depth
 *
 * The colored depth visualisations (`*-depth-colored.webp`) ship for
 * design reference only — the shader never samples them.
 */
export interface ImmersiveHeroProps {
  slide1ImageSrc?: string;
  slide1DepthSrc?: string;
  slide2ImageSrc?: string;
  slide2DepthSrc?: string;
  ctaHref1?: string;
  ctaHref2?: string;
  parallaxStrength?: number;
  waterDistortionStrength?: number;
  cursorRippleStrength?: number;
  shimmerStrength?: number;
  driftStrength?: number;
  slide1Rotation?: number;
  slide1Zoom?: number;
  /** Vertical screen offset applied to slide 1 at the end of its rotation
   *  phase, expressed as a fraction of viewport height. Positive values
   *  shift the rotated yacht DOWN on screen. Default 0.10 ≈ 10% down. */
  slide1OffsetY?: number;
  invertDepthSlide1?: boolean;
  invertDepthSlide2?: boolean;
  debugDepthView?: number;
  debugWaterMask?: number;
}

const ImmersiveCanvas = dynamic(() => import("./ImmersiveCanvas"), {
  ssr: false,
  loading: () => null,
});

/** Aspect-1 ring-dot cursor; turquoise; scales on interactive elements. */
function ImmersiveCursor() {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const overInteractive = (e.target as HTMLElement | null)?.closest("a, button");
      el.dataset.hover = overInteractive ? "true" : "false";
    };
    const tick = () => {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return <div ref={ref} className="immersive-cursor" aria-hidden />;
}

/**
 * Decides whether the WebGL hero runs at all.
 * - prefers-reduced-motion → off, static fallback
 * - coarse pointer / small viewport → off (mobile, lean image)
 */
function useEnabled(): boolean {
  return React.useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      const queries = [
        window.matchMedia("(prefers-reduced-motion: reduce)"),
        window.matchMedia("(pointer: coarse)"),
        window.matchMedia("(max-width: 768px)"),
      ];
      for (const q of queries) q.addEventListener("change", cb);
      return () => {
        for (const q of queries) q.removeEventListener("change", cb);
      };
    },
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const small = window.matchMedia("(max-width: 768px)").matches;
      return !reduced && !coarse && !small;
    },
    () => false,
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/**
 * Ref-based scroll progress + per-element DOM mutation. The host component
 * NEVER re-renders on scroll — a single rAF loop reads scroll position once
 * per frame and writes:
 *   - progressRef.current     (read by the WebGL canvas in its render loop)
 *   - copy element opacities  (direct .style.opacity mutation)
 *   - scroll-cue opacity      (direct .style.opacity mutation)
 *   - progress-bar height     (direct .style.height mutation)
 *
 * This eliminates React reconciliation from the per-scroll-tick critical
 * path — the previous useState approach forced ImmersiveHero + all its
 * children (HeroCopy x 2, ImmersiveCursor, gradient, cue, progress) to
 * re-render dozens of times per second during momentum scrolls.
 */
interface ScrollRefs {
  section: React.RefObject<HTMLElement | null>;
  progress: React.RefObject<number>;
  copy1: React.RefObject<HTMLDivElement | null>;
  copy2: React.RefObject<HTMLDivElement | null>;
  cue: React.RefObject<HTMLDivElement | null>;
  bar: React.RefObject<HTMLDivElement | null>;
}

function useImmersiveScroll(refs: ScrollRefs) {
  // Aliases pulled out of the destructure so the React compiler doesn't
  // flag direct writes to `refs.progress.current` as prop mutation.
  const sectionRef = refs.section;
  const progressRef = refs.progress;
  const copy1Ref = refs.copy1;
  const copy2Ref = refs.copy2;
  const cueRef = refs.cue;
  const barRef = refs.bar;

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    let lastP = -1;

    const tick = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const total = el.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, scrolled / total) : 0;
      if (p === lastP) return;
      lastP = p;
      progressRef.current = p;

      // Copy fades — wide windows so slide-1 and slide-2 text overlap.
      // Slide-2 starts appearing at p=0.45 while slide-1 still has some
      // opacity until p=0.55. Both texts visible during handoff.
      const c1 = copy1Ref.current;
      if (c1) {
        const op = clamp(1 - (p - 0.32) / 0.23, 0, 1);
        c1.style.opacity = String(op);
        c1.style.pointerEvents = op > 0.5 ? "auto" : "none";
      }
      const c2 = copy2Ref.current;
      if (c2) {
        const op = clamp((p - 0.45) / 0.20, 0, 1);
        c2.style.opacity = String(op);
        c2.style.pointerEvents = op > 0.5 ? "auto" : "none";
      }
      const cue = cueRef.current;
      if (cue) {
        cue.style.opacity = String(clamp(1 - p / 0.05, 0, 1));
      }
      const bar = barRef.current;
      if (bar) {
        bar.style.height = `${(p * 100).toFixed(2)}%`;
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", tick);
    };
    // Refs are stable across renders, so this effect only needs to run on
    // mount. eslint isn't aware that React.RefObject identities are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function ImmersiveHero({
  slide1ImageSrc = "/sea-society/new/hero.webp",
  slide1DepthSrc = "/sea-society/new/hero-depth.png",
  slide2ImageSrc = "/sea-society/hero.webp",
  slide2DepthSrc = "/sea-society/hero-depth.png",
  ctaHref1 = "/fleet",
  ctaHref2 = "/fleet",
  parallaxStrength = 0.018,
  waterDistortionStrength = 0.006,
  cursorRippleStrength = 0.005,
  shimmerStrength = 2.0,
  driftStrength = 0.18,
  slide1Rotation = -1.5707963,
  slide1Zoom = 1.60,
  slide1OffsetY = 0.10,
  invertDepthSlide1 = false,
  invertDepthSlide2 = false,
  debugDepthView = 0,
  debugWaterMask = 0,
}: ImmersiveHeroProps) {
  const enabled = useEnabled();
  const sectionRef = React.useRef<HTMLElement>(null);
  // Shared progress ref. The canvas reads progressRef.current in its render
  // loop; copy / cue / bar are mutated directly by the RAF in useImmersiveScroll.
  // No useState → no React renders on scroll.
  const progressRef = React.useRef(0);
  const copy1Ref = React.useRef<HTMLDivElement>(null);
  const copy2Ref = React.useRef<HTMLDivElement>(null);
  const cueRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);
  useImmersiveScroll({
    section: sectionRef,
    progress: progressRef,
    copy1: copy1Ref,
    copy2: copy2Ref,
    cue: cueRef,
    bar: barRef,
  });

  return (
    <section
      ref={sectionRef}
      className="immersive-hero relative w-full bg-[#06141a] text-white"
      aria-label="Sea Society — immersive scroll story"
      // 2× viewport tall so the user has 1× of scroll to drive the
      // transition; the inner stage is sticky for the duration.
      style={{ height: "200svh" }}
    >
      <div className="sticky top-0 isolate flex h-screen w-full items-center overflow-hidden">
        {enabled ? <ImmersiveCursor /> : null}

        {/* Background — two-slide WebGL on capable devices, static fallback otherwise. */}
        <div className="absolute inset-0 -z-10">
          {enabled ? (
            <ImmersiveCanvas
              slide1ImageSrc={slide1ImageSrc}
              slide1DepthSrc={slide1DepthSrc}
              slide2ImageSrc={slide2ImageSrc}
              slide2DepthSrc={slide2DepthSrc}
              progressRef={progressRef}
              parallaxStrength={parallaxStrength}
              waterDistortionStrength={waterDistortionStrength}
              cursorRippleStrength={cursorRippleStrength}
              shimmerStrength={shimmerStrength}
              driftStrength={driftStrength}
              slide1Rotation={slide1Rotation}
              slide1Zoom={slide1Zoom}
              slide1OffsetY={slide1OffsetY}
              invertDepthSlide1={invertDepthSlide1}
              invertDepthSlide2={invertDepthSlide2}
              debugDepthView={debugDepthView}
              debugWaterMask={debugWaterMask}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- static fallback
            <img
              src={slide2ImageSrc}
              alt=""
              aria-hidden
              className="h-full w-full object-cover"
              decoding="async"
              fetchPriority="high"
            />
          )}
        </div>

        {/* Legibility gradient — top + bottom darken, centre stays clear. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.5)_100%),linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_25%,rgba(0,0,0,0)_55%,rgba(0,0,0,0.7)_100%)]"
        />

        {/* Slide 1 copy */}
        <HeroCopy
          containerRef={copy1Ref}
          eyebrow="PRIVATE COASTAL ESCAPES"
          headline="Quiet Waters, Private Moments"
          sub="Step into curated yacht experiences shaped by still water, refined comfort, and effortless escape."
          ctaLabel="Discover More"
          ctaHref={ctaHref1}
        />
        {/* Slide 2 copy */}
        <HeroCopy
          containerRef={copy2Ref}
          eyebrow="PRIVATE MEDITERRANEAN ESCAPES"
          headline="Sea Society"
          sub="Curated yacht experiences shaped around privacy, beauty, and effortless escape."
          ctaLabel="Explore the Experience"
          ctaHref={ctaHref2}
          initialOpacity={0}
        />

        {/* Subtle scroll cue — fades the moment user scrolls. */}
        <div ref={cueRef} aria-hidden className="immersive-scroll-cue">
          <span>Scroll</span>
          <span className="cue-line" />
        </div>

        {/* Progress bar at the right side. */}
        <div aria-hidden className="immersive-progress">
          <div ref={barRef} className="immersive-progress-fill" />
        </div>
      </div>
    </section>
  );
}

interface CopyProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  eyebrow: string;
  headline: string;
  sub: string;
  ctaLabel: string;
  ctaHref: string;
  /** Starting opacity (rAF will overwrite this on first scroll tick). */
  initialOpacity?: number;
}

function HeroCopy({
  containerRef,
  eyebrow,
  headline,
  sub,
  ctaLabel,
  ctaHref,
  initialOpacity = 1,
}: CopyProps) {
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10 mx-auto w-full max-w-(--spacing-container-max) px-5 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40"
      style={{ opacity: initialOpacity }}
    >
      <div className="mx-auto flex h-full w-full max-w-(--spacing-container-max) flex-col justify-center px-5 md:px-10">
        <p className="immersive-sub text-[0.7rem] uppercase tracking-[0.4em] text-white/80 md:text-xs">
          {eyebrow}
        </p>
        <h1 className="immersive-headline mt-6 max-w-2xl font-serif text-6xl leading-[0.95] md:text-8xl">
          {headline}
        </h1>
        <p className="immersive-sub mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
          {sub}
        </p>
        <a
          href={ctaHref}
          className="mt-10 inline-flex h-12 w-fit items-center justify-center gap-3 rounded-full border border-white/40 bg-white/5 px-7 text-sm font-medium tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white/15 md:h-14 md:px-9 md:text-base"
        >
          {ctaLabel}
          <span aria-hidden className="text-base leading-none">→</span>
        </a>
      </div>
    </div>
  );
}
