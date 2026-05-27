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

/** Aspect-1 ring-dot cursor; turquoise; scales on interactive elements.
 *  RAF only runs while the cursor is in motion or hasn't settled — saves
 *  a per-frame transform write when the user is idle. */
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

    const tick = () => {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      // Stop the RAF loop once we're visually settled. Re-scheduled on
      // the next pointermove. Threshold of 0.3 px is sub-pixel so the
      // cursor never looks "stuck".
      if (Math.abs(tx - cx) < 0.3 && Math.abs(ty - cy) < 0.3) {
        raf = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const overInteractive = (e.target as HTMLElement | null)?.closest("a, button");
      el.dataset.hover = overInteractive ? "true" : "false";
      if (!raf) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return <div ref={ref} className="immersive-cursor" aria-hidden />;
}

type DeviceMode = "webgl" | "mobile" | "reduced";

/**
 * Picks the right hero variant for the device:
 *   "webgl"   → full immersive scroll with depth-mapped shader
 *   "mobile"  → two stacked viewport-tall sections, each with its yacht
 *               as the centerpiece (no WebGL — fast on small screens)
 *   "reduced" → static slide 2 image, no motion at all
 */
function useDeviceMode(): DeviceMode {
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
      if (reduced) return "reduced";
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const small = window.matchMedia("(max-width: 768px)").matches;
      if (coarse || small) return "mobile";
      return "webgl";
    },
    () => "reduced", // SSR render
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
      //
      // We only flip pointer-events when the bucket changes — style
      // recalculation isn't free and writing the same value still
      // invalidates downstream layout in some browsers.
      const c1 = copy1Ref.current;
      if (c1) {
        const op = clamp(1 - (p - 0.32) / 0.23, 0, 1);
        c1.style.opacity = String(op);
        const newPE = op > 0.5 ? "auto" : "none";
        if (c1.style.pointerEvents !== newPE) c1.style.pointerEvents = newPE;
      }
      const c2 = copy2Ref.current;
      if (c2) {
        const op = clamp((p - 0.45) / 0.20, 0, 1);
        c2.style.opacity = String(op);
        const newPE = op > 0.5 ? "auto" : "none";
        if (c2.style.pointerEvents !== newPE) c2.style.pointerEvents = newPE;
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
  const device = useDeviceMode();

  // Slide copy is the same shape for all device variants — centralise it
  // so the WebGL and mobile paths can't drift apart.
  const slide1Copy: SlideCopy = {
    eyebrow: "PRIVATE COASTAL ESCAPES",
    headline: "Quiet Waters, Private Moments",
    sub: "Step into curated yacht experiences shaped by still water, refined comfort, and effortless escape.",
    ctaLabel: "Discover More",
    ctaHref: ctaHref1,
  };
  const slide2Copy: SlideCopy = {
    eyebrow: "PRIVATE MEDITERRANEAN ESCAPES",
    headline: "Sea Society",
    sub: "Curated yacht experiences shaped around privacy, beauty, and effortless escape.",
    ctaLabel: "Explore the Experience",
    ctaHref: ctaHref2,
  };

  if (device === "mobile") {
    return (
      <MobileImmersiveHero
        slide1ImageSrc={slide1ImageSrc}
        slide2ImageSrc={slide2ImageSrc}
        slide1={slide1Copy}
        slide2={slide2Copy}
      />
    );
  }
  if (device === "reduced") {
    return (
      <ReducedImmersiveHero
        imageSrc={slide2ImageSrc}
        slide={slide2Copy}
      />
    );
  }

  return (
    <WebGLImmersiveHero
      slide1ImageSrc={slide1ImageSrc}
      slide1DepthSrc={slide1DepthSrc}
      slide2ImageSrc={slide2ImageSrc}
      slide2DepthSrc={slide2DepthSrc}
      slide1Copy={slide1Copy}
      slide2Copy={slide2Copy}
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
  );
}

interface SlideCopy {
  eyebrow: string;
  headline: string;
  sub: string;
  ctaLabel: string;
  ctaHref: string;
}

interface WebGLImmersiveHeroProps {
  slide1ImageSrc: string;
  slide1DepthSrc: string;
  slide2ImageSrc: string;
  slide2DepthSrc: string;
  slide1Copy: SlideCopy;
  slide2Copy: SlideCopy;
  parallaxStrength: number;
  waterDistortionStrength: number;
  cursorRippleStrength: number;
  shimmerStrength: number;
  driftStrength: number;
  slide1Rotation: number;
  slide1Zoom: number;
  slide1OffsetY: number;
  invertDepthSlide1: boolean;
  invertDepthSlide2: boolean;
  debugDepthView: number;
  debugWaterMask: number;
}

function WebGLImmersiveHero({
  slide1ImageSrc,
  slide1DepthSrc,
  slide2ImageSrc,
  slide2DepthSrc,
  slide1Copy,
  slide2Copy,
  parallaxStrength,
  waterDistortionStrength,
  cursorRippleStrength,
  shimmerStrength,
  driftStrength,
  slide1Rotation,
  slide1Zoom,
  slide1OffsetY,
  invertDepthSlide1,
  invertDepthSlide2,
  debugDepthView,
  debugWaterMask,
}: WebGLImmersiveHeroProps) {
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
        <ImmersiveCursor />

        <div className="absolute inset-0 -z-10">
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
        </div>

        {/* Legibility gradient — top + bottom darken, centre stays clear. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.5)_100%),linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_25%,rgba(0,0,0,0)_55%,rgba(0,0,0,0.7)_100%)]"
        />

        <HeroCopy containerRef={copy1Ref} {...slide1Copy} />
        <HeroCopy containerRef={copy2Ref} {...slide2Copy} initialOpacity={0} />

        <div ref={cueRef} aria-hidden className="immersive-scroll-cue">
          <span>Scroll</span>
          <span className="cue-line" />
        </div>

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

// =============================================================================
// Mobile variant — two stacked 100svh sections, each with its yacht as the
// visual centerpiece. No WebGL: native scrolling, CSS Ken-Burns zoom on
// imagery, a tiny scroll cue on the first slide. The yachts get the full
// canvas of the small screen and the page stays fast.
// =============================================================================

interface MobileImmersiveHeroProps {
  slide1ImageSrc: string;
  slide2ImageSrc: string;
  slide1: SlideCopy;
  slide2: SlideCopy;
}

function MobileImmersiveHero({
  slide1ImageSrc,
  slide2ImageSrc,
  slide1,
  slide2,
}: MobileImmersiveHeroProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const img1Ref = React.useRef<HTMLImageElement>(null);
  const img2Ref = React.useRef<HTMLImageElement>(null);
  const copy1Ref = React.useRef<HTMLDivElement>(null);
  const copy2Ref = React.useRef<HTMLDivElement>(null);
  const cueRef = React.useRef<HTMLDivElement>(null);

  useMobileTransition({
    section: sectionRef,
    img1: img1Ref,
    img2: img2Ref,
    copy1: copy1Ref,
    copy2: copy2Ref,
    cue: cueRef,
  });

  return (
    <section
      ref={sectionRef}
      className="immersive-mobile w-full bg-[#06141a] text-white"
      aria-label="Sea Society — private Mediterranean escapes"
      // 2× viewport tall so the sticky stage has 1× viewport of scroll
      // available to play the transition. Mirrors the desktop setup.
      style={{ height: "200svh" }}
    >
      <div className="immersive-mobile-stage">
        {/* Slide 1 — sits underneath, slowly tilts + zooms out under
            the scroll, fades as slide 2 takes over. */}
        <div className="immersive-mobile-layer" data-slide="1">
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset */}
          <img
            ref={img1Ref}
            src={slide1ImageSrc}
            alt=""
            aria-hidden
            className="immersive-mobile-bg"
            decoding="async"
            fetchPriority="high"
          />
          <div className="immersive-mobile-vignette" />
          <div ref={copy1Ref} className="immersive-mobile-copy">
            <p className="immersive-sub immersive-mobile-eyebrow">{slide1.eyebrow}</p>
            <h1 className="immersive-headline immersive-mobile-headline">
              {slide1.headline}
            </h1>
            <p className="immersive-sub immersive-mobile-sub">{slide1.sub}</p>
            <a href={slide1.ctaHref} className="immersive-mobile-cta">
              {slide1.ctaLabel}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        {/* Slide 2 — starts hidden + zoomed, settles to native by the
            end of scroll. Initial opacity 0 on the img/copy (NOT the
            wrapper) so the scroll handler can ramp them in without the
            wrapper masking them. */}
        <div className="immersive-mobile-layer" data-slide="2">
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset */}
          <img
            ref={img2Ref}
            src={slide2ImageSrc}
            alt=""
            aria-hidden
            className="immersive-mobile-bg"
            decoding="async"
            style={{ opacity: 0 }}
          />
          <div className="immersive-mobile-vignette" />
          <div
            ref={copy2Ref}
            className="immersive-mobile-copy"
            style={{ opacity: 0 }}
          >
            <p className="immersive-sub immersive-mobile-eyebrow">{slide2.eyebrow}</p>
            <h2 className="immersive-headline immersive-mobile-headline">
              {slide2.headline}
            </h2>
            <p className="immersive-sub immersive-mobile-sub">{slide2.sub}</p>
            <a href={slide2.ctaHref} className="immersive-mobile-cta">
              {slide2.ctaLabel}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        <div ref={cueRef} aria-hidden className="immersive-mobile-cue">
          <span>Scroll</span>
          <span className="cue-line" />
        </div>
      </div>
    </section>
  );
}

interface MobileScrollRefs {
  section: React.RefObject<HTMLElement | null>;
  img1: React.RefObject<HTMLImageElement | null>;
  img2: React.RefObject<HTMLImageElement | null>;
  copy1: React.RefObject<HTMLDivElement | null>;
  copy2: React.RefObject<HTMLDivElement | null>;
  cue: React.RefObject<HTMLDivElement | null>;
}

function useMobileTransition(refs: MobileScrollRefs) {
  // Pull refs out so the React compiler doesn't flag `refs.x.current = ...`
  // as prop mutation (same pattern as the desktop hook).
  const sectionRef = refs.section;
  const img1Ref = refs.img1;
  const img2Ref = refs.img2;
  const copy1Ref = refs.copy1;
  const copy2Ref = refs.copy2;
  const cueRef = refs.cue;

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    let lastP = -1;

    // Damped progress for buttery scrolling on touch devices.
    let smoothedP = 0;
    let lastFrameT = performance.now();

    const tick = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const total = el.offsetHeight - window.innerHeight;
      const targetP = total > 0 ? Math.min(1, scrolled / total) : 0;

      // Critically-damped easing (~0.3s settle) so a flick of the
      // finger doesn't tracker-jump the transition.
      const now = performance.now();
      const dt = Math.min((now - lastFrameT) / 1000, 0.05);
      lastFrameT = now;
      const lerp = 1 - Math.pow(0.001, dt * 2.2);
      smoothedP += (targetP - smoothedP) * lerp;
      const p = smoothedP;

      // Settled at target — skip identical DOM writes.
      if (Math.abs(p - lastP) < 0.0005 && p === targetP) {
        // Only re-schedule if there's still scroll to chase.
        return;
      }
      lastP = p;

      // Slide 1 camera-approach: front-loaded so the zoom + tilt finish
      // BEFORE slide 2 starts fading in. Was linear across the whole
      // scroll which left the rotation only ~38% done at the handover.
      // Now: smoothstep-eased to complete by p=0.36; from there the
      // image holds its tilted/zoomed pose until slide 2 dissolves on top.
      const img1 = img1Ref.current;
      if (img1) {
        const t = clamp(p / 0.36, 0, 1);
        const ease = t * t * (3 - 2 * t); // smoothstep
        const scale = 1 + ease * 0.55;
        const ty = -ease * 8; // vh — more pronounced drift-up
        const rot = -ease * 18; // deg — more pronounced "camera tilt"
        img1.style.transform = `translate3d(0, ${ty}vh, 0) scale(${scale}) rotate(${rot}deg)`;
        img1.style.opacity = String(clamp(1 - (p - 0.42) / 0.22, 0, 1));
      }

      // Slide 2: starts zoomed-in, settles to native scale; opacity
      // ramps in across the overlap window. Begins at p=0.40 (just
      // after slide-1 has settled into its tilted pose).
      const img2 = img2Ref.current;
      if (img2) {
        const scale = 1.22 - p * 0.22;
        img2.style.transform = `translate3d(0, 0, 0) scale(${scale})`;
        img2.style.opacity = String(clamp((p - 0.40) / 0.25, 0, 1));
      }

      // Copy crossfade with overlap: slide-1 copy fades p 0.28 → 0.52,
      // slide-2 copy fades in p 0.46 → 0.70. Overlap p 0.46 → 0.52 —
      // both texts visible simultaneously during the handoff.
      const c1 = copy1Ref.current;
      if (c1) {
        c1.style.opacity = String(clamp(1 - (p - 0.28) / 0.24, 0, 1));
      }
      const c2 = copy2Ref.current;
      if (c2) {
        c2.style.opacity = String(clamp((p - 0.46) / 0.24, 0, 1));
      }
      const cue = cueRef.current;
      if (cue) {
        cue.style.opacity = String(clamp(1 - p / 0.05, 0, 1));
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };
    // Run continuously so the damping animates even between scroll events.
    const loop = () => {
      tick();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", tick);
    };
    // Refs are stable; only mount once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// =============================================================================
// Reduced-motion variant — static slide 2, no animation. Renders an <img>
// background plus the headline copy so the page still says something.
// =============================================================================

function ReducedImmersiveHero({
  imageSrc,
  slide,
}: {
  imageSrc: string;
  slide: SlideCopy;
}) {
  return (
    <section
      className="immersive-mobile w-full bg-[#06141a] text-white"
      aria-label="Sea Society"
    >
      <div
        className="immersive-mobile-stage"
        style={{ position: "relative" /* override sticky */ }}
      >
        <div className="immersive-mobile-layer">
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset */}
          <img
            src={imageSrc}
            alt=""
            aria-hidden
            className="immersive-mobile-bg"
            decoding="async"
            fetchPriority="high"
          />
          <div className="immersive-mobile-vignette" />
          <div className="immersive-mobile-copy">
            <p className="immersive-sub immersive-mobile-eyebrow">{slide.eyebrow}</p>
            <h1 className="immersive-headline immersive-mobile-headline">
              {slide.headline}
            </h1>
            <p className="immersive-sub immersive-mobile-sub">{slide.sub}</p>
            <a href={slide.ctaHref} className="immersive-mobile-cta">
              {slide.ctaLabel}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
