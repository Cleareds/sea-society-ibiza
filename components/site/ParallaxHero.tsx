"use client";

import * as React from "react";
import "./parallax-hero.css";

/**
 * Scroll-driven 4-screen parallax stage.
 *
 * Outer container is 400 vh tall. A sticky inner stage pins to the viewport
 * while the page scrolls; a CSS variable --p (0 → 1) tracks scroll progress
 * across the whole section and drives each layer's transform / opacity via
 * pure CSS (no per-frame React state updates).
 *
 * Phases (with --p):
 *   0.00 → 0.50  bg-above slides from top crop to bottom crop
 *   0.50 → 0.78  bg-top fades in over bg-above (deep-water close-up)
 *   0.72 → 1.00  boat translates up from below the fold
 */
export function ParallaxHero({ children }: { children?: React.ReactNode }) {
  const wrapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const p = total > 0 ? scrolled / total : 0;
      el.style.setProperty("--p", p.toFixed(4));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={wrapRef} className="parallax-wrap relative" aria-label="Sea Society — scroll story">
      {/* sticky stage pinned for the duration of the wrap */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0b1e22]">
        {/* Layer 1 — coastline aerial. Image is sized 200% of stage height
            and anchored to the BOTTOM of the stage so its bottom edge always
            sits at the same y as bg-top's bottom edge (regardless of how the
            transform below scales / tilts it). Translated down at p=0 to show
            its top half, slid up to show the bottom half by p=0.5. */}
        <div className="parallax-layer parallax-above absolute inset-x-0 bottom-0 h-[200vh] w-full will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/home/bg-above.webp"
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
            decoding="async"
            fetchPriority="high"
          />
        </div>

        {/* Layer 3 — the boat, slides up from below the fold */}
        <div className="parallax-layer parallax-boat pointer-events-none absolute inset-x-0 bottom-0 flex justify-center will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/home/boat.webp"
            alt=""
            aria-hidden
            className="h-[34vh] w-auto max-w-none md:h-[42vh] drop-shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
            decoding="async"
          />
        </div>

        {/* Foreground copy (per-phase) — children render in the centre */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-5 text-white">
          {children}
        </div>

        {/* Subtle bottom darken for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      </div>
    </section>
  );
}
