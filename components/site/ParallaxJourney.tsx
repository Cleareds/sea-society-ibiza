"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { localePath, type Locale } from "@/lib/i18n/config";

interface StageCopy {
  kicker: string;
  title: string;
  body: string;
}

interface Props {
  locale: Locale;
  layers: { sky: string; mid: string; sea: string };
  texts: {
    eyebrow: string;
    cue: string;
    stage1: StageCopy;
    stage2: StageCopy;
    stage3: StageCopy;
    final: { kicker: string; title: string; primary: string; secondary: string };
  };
}

/**
 * Sky → mountain → sea scroll narrative. The component is mostly a markup
 * scaffold; all motion lives in CSS keyframes (see globals.css `.pj-*`).
 *
 * On mount we register a rAF loop that writes the scroll progress (0–1)
 * to `--p` on the section. Each layer / cloud / text has a paused
 * keyframe animation with `animation-delay: calc(var(--p) * -1s)`, so
 * the browser interpolates them on the compositor — no per-frame
 * layout, no transform recomputes in JS.
 */
export function ParallaxJourney({ locale, layers, texts }: Props) {
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }

    let rafId = 0;
    let last = -1;

    const tick = () => {
      const rect = el.getBoundingClientRect();
      const span = Math.max(1, el.offsetHeight - window.innerHeight);
      const p = Math.max(0, Math.min(1, -rect.top / span));
      if (Math.abs(p - last) > 0.0004) {
        el.style.setProperty("--p", p.toFixed(4));
        last = p;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const lp = (path: string) => localePath(locale, path);

  return (
    <section ref={ref} className="pj relative isolate" style={{ height: "400svh" }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[var(--color-primary)]">
        {/* === Image layers, stacked back-to-front === */}
        <div className="pj-layer pj-layer--sky">
          <Image
            src={layers.sky}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={82}
            className="object-cover"
          />
        </div>
        <div className="pj-layer pj-layer--mid">
          <Image
            src={layers.mid}
            alt=""
            fill
            sizes="100vw"
            quality={82}
            className="object-cover"
          />
        </div>
        <div className="pj-layer pj-layer--sea">
          <Image
            src={layers.sea}
            alt=""
            fill
            sizes="100vw"
            quality={82}
            className="object-cover"
          />
        </div>

        {/* Cloud SVGs drifting across at three depths */}
        <Cloud depth="back" />
        <Cloud depth="mid" />
        <Cloud depth="front" />

        {/* Yacht silhouette settles at lower right for stage 3 */}
        <YachtSilhouette />

        <div className="pj-vignette" aria-hidden />

        {/* Brand mark at the top, fades after first stage */}
        <div className="pj-eyebrow absolute inset-x-0 top-[max(env(safe-area-inset-top),1.5rem)] z-10 flex justify-center px-5">
          <p className="text-[10px] uppercase tracking-[0.4em] md:text-xs">{texts.eyebrow}</p>
        </div>

        {/* Three stage text overlays — each visible for a slice of the scroll */}
        <StageText kind="stage1" copy={texts.stage1} />
        <StageText kind="stage2" copy={texts.stage2} />
        <StageText kind="stage3" copy={texts.stage3} />

        {/* Final CTA card — composes on top of stage 3 with the yacht */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[8%] z-10 flex justify-center px-5">
          <div className="pj-cta-card pointer-events-auto inline-flex max-w-md flex-col items-center gap-3 rounded-2xl bg-white/12 px-7 py-6 text-center text-white backdrop-blur-md ring-1 ring-white/20">
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/85">
              {texts.final.kicker}
            </p>
            <p className="max-w-[20ch] font-serif text-2xl leading-tight md:text-3xl">
              {texts.final.title}
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <Button asChild size="md" variant="primary">
                <Link href={lp("/fleet")}>{texts.final.primary}</Link>
              </Button>
              <Button asChild size="md" variant="outlineLight">
                <Link href={lp("/contact")}>{texts.final.secondary}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll cue — only during the first stage */}
        <div className="pj-cue absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.35em]">
          {texts.cue}
          <span aria-hidden className="block h-8 w-px bg-white/60" />
        </div>
      </div>
    </section>
  );
}

function StageText({ kind, copy }: { kind: "stage1" | "stage2" | "stage3"; copy: StageCopy }) {
  return (
    <div className={`pj-text pj-text--${kind}`}>
      <p className="text-[10px] uppercase tracking-[0.32em] text-white/85 md:text-xs">
        {copy.kicker}
      </p>
      <h2 className="mt-4 max-w-3xl font-serif text-[10vw] leading-[1.04] tracking-tight md:text-7xl lg:text-[88px]">
        {copy.title}
      </h2>
      <p className="mt-5 max-w-xl text-sm text-white/90 md:text-base">{copy.body}</p>
    </div>
  );
}

function Cloud({ depth }: { depth: "back" | "mid" | "front" }) {
  // Smooth, soft cloud silhouette. Pure SVG path — no external asset.
  return (
    <svg
      className={`pj-cloud pj-cloud--${depth}`}
      viewBox="0 0 480 140"
      fill="currentColor"
      aria-hidden
    >
      <path d="M76 96c-28 0-52-19-52-44s24-44 52-44c14 0 27 5 36 13 8-22 30-37 56-37 30 0 56 21 60 49 8-4 17-6 26-6 30 0 54 22 54 48 0 4 0 7-1 11 10-6 22-9 35-9 28 0 50 21 50 47 0 26-22 47-50 47H76z" />
    </svg>
  );
}

function YachtSilhouette() {
  return (
    <svg className="pj-yacht" viewBox="0 0 600 220" fill="currentColor" aria-hidden>
      {/* Hull */}
      <path d="M40 150 L520 150 L490 192 L120 192 Z" opacity="0.95" />
      {/* Reflection in water */}
      <path
        d="M120 198 L490 198 L470 208 L150 208 Z"
        opacity="0.35"
      />
      {/* Cabin / superstructure */}
      <path d="M180 95 L420 95 L440 148 L165 148 Z" opacity="0.95" />
      <path d="M220 60 L380 60 L405 95 L195 95 Z" opacity="0.95" />
      {/* Windows */}
      <rect x="220" y="105" width="36" height="18" rx="2" fill="rgba(0,101,101,0.6)" />
      <rect x="270" y="105" width="36" height="18" rx="2" fill="rgba(0,101,101,0.6)" />
      <rect x="320" y="105" width="36" height="18" rx="2" fill="rgba(0,101,101,0.6)" />
      <rect x="370" y="105" width="36" height="18" rx="2" fill="rgba(0,101,101,0.6)" />
      {/* Bow detail */}
      <path d="M40 150 L100 130 L100 150 Z" opacity="0.95" />
      {/* Light water sheen */}
      <path d="M50 168 L490 168 L488 174 L52 174 Z" opacity="0.35" />
    </svg>
  );
}
