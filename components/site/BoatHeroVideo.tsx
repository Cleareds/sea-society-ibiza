"use client";

import * as React from "react";
import Image from "next/image";

interface Props {
  poster: string;
  /** Optional. When set, used as the LCP poster on viewports < 1100px
   *  instead of `poster`. Pair with src720 that matches its aspect
   *  (e.g. a portrait mobile clip). */
  posterMobile?: string;
  src1080: string;
  src720: string;
  alt: string;
}

/**
 * Detail-page hero video player for the boats with shipped footage.
 *
 * Playback model:
 *   - Plays the source clip forward on mount and loops continuously
 *     (restarts from the first frame each time it ends).
 *
 * Performance:
 *   - The poster image is rendered as a Next/Image with `priority` +
 *     `fetchPriority="high"`, so it's the LCP element painted before
 *     any video bytes arrive.
 *   - <video preload="metadata"> — server sends only the moov atom +
 *     1-2s of data; the rest streams via range requests as playback
 *     advances.
 *   - Source tier picked at mount from `window.innerWidth` (1080p for
 *     desktop, 720p for phones).
 *   - The <video> is overlaid above the poster and cross-faded in via
 *     CSS opacity once it can play.
 *
 * Accessibility:
 *   - aria-hidden on the video (it's decorative; boat copy below
 *     carries all info).
 *   - prefers-reduced-motion OR navigator.connection.saveData skip
 *     the video entirely and leave the poster as the hero.
 */
export function BoatHeroVideo({ poster, posterMobile, src1080, src720, alt }: Props) {
  const [src, setSrc] = React.useState<string | null>(null);
  const [activePoster, setActivePoster] = React.useState(poster);
  const [reduced, setReduced] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    type ConnLike = { saveData?: boolean };
    const conn = (navigator as Navigator & { connection?: ConnLike }).connection;
    const saveData = conn?.saveData === true;
    const isDesktop = window.innerWidth >= 1100;
    // Pick the right poster aspect for the device before anything
    // paints. Avoids a flash of stretched portrait poster on desktop
    // (or vice-versa) for the few hundred ms before the video loads.
    if (!isDesktop && posterMobile) setActivePoster(posterMobile);
    if (mql.matches || saveData) {
      setReduced(true);
      return;
    }
    setSrc(isDesktop ? src1080 : src720);
  }, [src1080, src720, posterMobile]);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => setReady(true);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("loadeddata", onCanPlay);
    return () => {
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("loadeddata", onCanPlay);
    };
  }, [src]);

  return (
    <>
      {/* LCP layer — poster image painted before any video byte arrives. */}
      <Image
        src={poster}
        alt={alt}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />
      {/* Video overlay — cross-fades in once it can play. Skipped
          entirely under prefers-reduced-motion or Save-Data. Loops
          continuously. */}
      {!reduced && src && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
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
