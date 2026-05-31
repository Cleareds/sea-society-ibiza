"use client";

import * as React from "react";
import Image from "next/image";

interface Props {
  poster: string;
  src1080: string;
  src720: string;
  /** Element whose scroll-progress drives video.currentTime. Usually
   *  the runway box that wraps the sticky hero pin. */
  scrubScopeRef: React.RefObject<HTMLElement | null>;
}

/**
 * Homepage hero — scroll-scrubbed video, rendered directly as a DOM
 * <video> element (no WebGL canvas, no 3D water composite). Replaces
 * the previous HomeWater3DCanvas; same scroll-progress-driven
 * playback model but pixel-perfect crisp because nothing distorts the
 * source.
 *
 * Performance:
 *   - Poster is the LCP image (Next/Image priority + fetchPriority).
 *   - <video preload="metadata"> — only the moov atom + 1-2s of data
 *     download up front; the rest streams via range requests as the
 *     user scrolls the seek forward.
 *   - The source is encoded all-intra (-g 1 -keyint_min 1) so every
 *     frame is a keyframe and seek() is instant in both directions.
 *   - Source tier chosen at mount from window.innerWidth.
 *   - RAF loop pauses while the runway isn't intersecting the viewport
 *     (IntersectionObserver) — no main-thread cost while user is way
 *     past the hero.
 *
 * Behaviour:
 *   - currentTime tracks scroll position with critical-damped lerp
 *     (factor 0.18) for buttery seek interpolation.
 *   - Seeks are throttled to ~60Hz (16ms minimum interval) so a fast
 *     scroll wheel doesn't queue up dozens of redundant seeks.
 *   - prefers-reduced-motion OR navigator.connection.saveData skip
 *     the video entirely; the poster stays as the hero.
 *
 * Accessibility: aria-hidden on the video (decorative).
 */
export function HomeHeroVideo({ poster, src1080, src720, scrubScopeRef }: Props) {
  const [src, setSrc] = React.useState<string | null>(null);
  const [reduced, setReduced] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    type ConnLike = { saveData?: boolean };
    const conn = (navigator as Navigator & { connection?: ConnLike }).connection;
    const saveData = conn?.saveData === true;
    if (mql.matches || saveData) {
      setReduced(true);
      return;
    }
    setSrc(window.innerWidth >= 1100 ? src1080 : src720);
  }, [src1080, src720]);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => setReady(true);
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("loadeddata", onLoaded);
    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("loadeddata", onLoaded);
    };
  }, [src]);

  // Scroll → currentTime, smoothed
  React.useEffect(() => {
    if (reduced) return;
    const v = videoRef.current;
    if (!v) return;

    let raf = 0;
    let smooth = 0;
    let lastSeekAt = 0;
    const SEEK_INTERVAL = 16;

    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => { visible = !!e?.isIntersecting; },
      { rootMargin: "200px" },
    );
    const scope = scrubScopeRef.current;
    if (scope) io.observe(scope);

    const progress = () => {
      const s = scrubScopeRef.current;
      if (!s) return 0;
      const rect = s.getBoundingClientRect();
      const total = Math.max(1, s.offsetHeight - window.innerHeight);
      return Math.min(1, Math.max(0, -rect.top) / total);
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const duration = v.duration;
      if (!duration || isNaN(duration)) return;
      const target = progress() * Math.max(0, duration - 0.02);
      smooth += (target - smooth) * 0.18;
      const now = performance.now();
      if (
        Math.abs(v.currentTime - smooth) > 0.005 &&
        now - lastSeekAt > SEEK_INTERVAL
      ) {
        try {
          v.currentTime = smooth;
          lastSeekAt = now;
        } catch {
          /* not ready */
        }
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduced, scrubScopeRef, src]);

  return (
    <>
      <Image
        src={poster}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />
      {!reduced && src && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="metadata"
          disableRemotePlayback
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </>
  );
}
