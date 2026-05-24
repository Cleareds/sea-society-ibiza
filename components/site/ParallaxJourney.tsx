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
  layers: {
    sky: string;
    mid: string;
    sea: string;
    /** A photographic clouds-on-blue-sky shot. Rendered with
     * mix-blend-mode: screen so the dark/blue parts disappear and only
     * the white clouds drift across the scene — a real-photo equivalent
     * of a transparent-cloud overlay. */
    cloudsOverlay: string;
  };
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
 * Sky → mountain → sea scroll narrative. Mont-Fort / Maritime-inspired:
 * pure photographic layers, soft crossfades, subtle Y-translate per layer
 * for depth, and a single drifting cloud overlay rendered via blend mode
 * instead of cartoon SVGs.
 *
 * All motion lives in CSS keyframes (see globals.css `.pj-*`). On mount
 * we register a rAF loop that writes the scroll progress (0–1) to `--p`
 * on the section. Each layer has a paused keyframe animation with
 * `animation-delay: calc(var(--p) * -1s)` so the browser interpolates
 * on the compositor — no per-frame JS layout, no transform recomputes.
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
        {/* === Photographic layers, stacked back-to-front === */}
        <div className="pj-layer pj-layer--sky">
          <Image src={layers.sky} alt="" fill priority sizes="100vw" quality={82} className="object-cover" />
        </div>
        <div className="pj-layer pj-layer--mid">
          <Image src={layers.mid} alt="" fill sizes="100vw" quality={82} className="object-cover" />
        </div>
        <div className="pj-layer pj-layer--sea">
          <Image src={layers.sea} alt="" fill sizes="100vw" quality={82} className="object-cover" />
        </div>

        {/* Photographic cloud overlay — real clouds drifting across the
            entire journey, rendered with mix-blend-mode: screen so only
            the bright cloud pixels show through against every layer. */}
        <div className="pj-clouds-overlay" aria-hidden>
          <Image
            src={layers.cloudsOverlay}
            alt=""
            fill
            sizes="160vw"
            quality={78}
            className="object-cover"
          />
        </div>

        <div className="pj-vignette" aria-hidden />

        {/* Brand mark at the top, fades after first stage */}
        <div className="pj-eyebrow absolute inset-x-0 top-[max(env(safe-area-inset-top),1.5rem)] z-10 flex justify-center px-5">
          <p className="text-[10px] uppercase tracking-[0.4em] md:text-xs">{texts.eyebrow}</p>
        </div>

        {/* Three stage text overlays — each visible for a slice of the scroll */}
        <StageText kind="stage1" copy={texts.stage1} />
        <StageText kind="stage2" copy={texts.stage2} />
        <StageText kind="stage3" copy={texts.stage3} />

        {/* Final CTA card — composes on top of stage 3 */}
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
