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
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Tracks scroll position over `sectionRef` and emits 0 → 1 progress. */
function useScrollProgress(sectionRef: React.RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      // Section is 2× viewport tall; the canvas sticks for 1× of scrolling.
      // We want progress 0 at top of section, 1 after one viewport of scroll.
      const scrolled = Math.max(0, -rect.top);
      const total = el.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, scrolled / total) : 0;
      setProgress(p);
    };
    compute();
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, [sectionRef]);
  return progress;
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
  invertDepthSlide1 = false,
  invertDepthSlide2 = false,
  debugDepthView = 0,
  debugWaterMask = 0,
}: ImmersiveHeroProps) {
  const enabled = useEnabled();
  const sectionRef = React.useRef<HTMLElement>(null);
  // Linear scroll progress. The previous smoothstep(0,1,raw) call killed
  // ~70% of scroll input near the start (smoothstep(0,1,0.1)≈0.028) which
  // read as severe lag. Easing now lives entirely in the shader windows.
  const progress = useScrollProgress(sectionRef);

  // Copy timing aligned with the tightened rotation+dissolve shader:
  //   slide-1 copy gone by p≈0.15 (just as rotation kicks in).
  //   slide-2 copy fades in p≈0.82 → 0.95 once dissolve is mostly done.
  const slide1Opacity = clamp(1 - (progress - 0.02) / 0.12, 0, 1);
  const slide2Opacity = clamp((progress - 0.82) / 0.10, 0, 1);
  const cueOpacity = clamp(1 - progress / 0.05, 0, 1);

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
              transitionProgress={progress}
              parallaxStrength={parallaxStrength}
              waterDistortionStrength={waterDistortionStrength}
              cursorRippleStrength={cursorRippleStrength}
              shimmerStrength={shimmerStrength}
              driftStrength={driftStrength}
              slide1Rotation={slide1Rotation}
              slide1Zoom={slide1Zoom}
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
          eyebrow="PRIVATE COASTAL ESCAPES"
          headline="Quiet Waters, Private Moments"
          sub="Step into curated yacht experiences shaped by still water, refined comfort, and effortless escape."
          ctaLabel="Discover More"
          ctaHref={ctaHref1}
          opacity={slide1Opacity}
        />
        {/* Slide 2 copy */}
        <HeroCopy
          eyebrow="PRIVATE MEDITERRANEAN ESCAPES"
          headline="Sea Society"
          sub="Curated yacht experiences shaped around privacy, beauty, and effortless escape."
          ctaLabel="Explore the Experience"
          ctaHref={ctaHref2}
          opacity={slide2Opacity}
        />

        {/* Subtle scroll cue — only on slide 1, fades the moment user scrolls. */}
        <div
          aria-hidden
          className="immersive-scroll-cue"
          style={{ opacity: cueOpacity }}
        >
          <span>Scroll</span>
          <span className="cue-line" />
        </div>

        {/* Progress bar at the right side — tells the user this section
            holds while the transition plays. */}
        <div aria-hidden className="immersive-progress">
          <div
            className="immersive-progress-fill"
            style={{ height: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}

interface CopyProps {
  eyebrow: string;
  headline: string;
  sub: string;
  ctaLabel: string;
  ctaHref: string;
  /** 0 → 1, set per scroll position. */
  opacity: number;
}

function HeroCopy({ eyebrow, headline, sub, ctaLabel, ctaHref, opacity }: CopyProps) {
  return (
    <div
      className="relative z-10 mx-auto w-full max-w-(--spacing-container-max) px-5 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40 transition-[transform] duration-500"
      style={{
        opacity,
        pointerEvents: opacity > 0.5 ? "auto" : "none",
        position: "absolute",
        inset: 0,
      }}
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
