"use client";

import * as React from "react";
import Image from "next/image";

interface Props {
  poster: string;
  src1080: string;
  src720: string;
  alt: string;
}

/**
 * Detail-page hero video player for the 9 boats with shipped footage.
 *
 * Performance:
 *   - The poster image is rendered as a Next/Image with `priority` +
 *     `fetchPriority="high"`, so it's the LCP element painted before
 *     any video bytes arrive.
 *   - <video preload="metadata"> — server sends only the moov atom +
 *     1-2s of data; the rest streams via range requests as playback
 *     advances. Saves bandwidth on slow connections.
 *   - The video source is chosen at mount from `window.innerWidth` so
 *     small viewports get the 720p tier (~50% the size of 1080p).
 *   - The <video> is overlaid above the poster and cross-faded in via
 *     CSS opacity once it can play — no layout shift, no flash of
 *     empty pixels.
 *
 * Loop:
 *   - The mp4 itself is a yoyo (forward frames + reversed frames in
 *     one file), so native `loop` plays endlessly with no visible
 *     seam — last frame of forward equals first frame of reverse,
 *     and vice-versa.
 *
 * Accessibility:
 *   - aria-hidden on the video (it's decorative; the boat copy below
 *     conveys all info).
 *   - prefers-reduced-motion skips the video entirely and leaves the
 *     poster as the hero — no autoplay, no animation.
 */
export function BoatHeroVideo({ poster, src1080, src720, alt }: Props) {
  const [src, setSrc] = React.useState<string | null>(null);
  const [reduced, setReduced] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Bail out under reduced motion OR when the user has Data Saver on
    // (Chrome's saveData hint, fired on metered/slow connections).
    // Either way, the poster stays as the hero, no video bytes load.
    type ConnLike = { saveData?: boolean };
    const conn = (navigator as Navigator & { connection?: ConnLike }).connection;
    const saveData = conn?.saveData === true;
    if (mql.matches || saveData) {
      setReduced(true);
      return;
    }
    // Pick the resolution tier at mount based on viewport width.
    // Small phones get the 540p file (~half the size); everything
    // else gets the 720p tier — sharp on retina laptops + desktops.
    setSrc(window.innerWidth >= 1100 ? src1080 : src720);
  }, [src1080, src720]);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => setReady(true);
    v.addEventListener("canplay", onCanPlay);
    // Some browsers fire `loadeddata` first; accept either as ready.
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
          entirely under prefers-reduced-motion. */}
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
