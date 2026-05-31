"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

interface InlineProps {
  number: string;
  boatName?: string;
  label?: string;
  className?: string;
  /** Style: 'light' is white pill on dark (immersive style); 'dark' is dark pill on light. */
  tone?: "light" | "dark";
  size?: "md" | "lg";
}

/**
 * `Book here` CTA — replaces the previous green WhatsApp button. Styled
 * to match the immersive page pill: glassy white outline, no fill on
 * 'light' tone, soft backdrop blur, subtle hover lift. Always opens
 * WhatsApp in a new tab.
 */
export function BookHereCTA({
  number,
  boatName,
  label = "Book here",
  className,
  tone = "light",
  size = "md",
}: InlineProps) {
  const href = whatsappLink({ number, boatName });
  // Sized to match the header pill's typography but with a larger
  // outer footprint for body-of-page placements. Uppercase tracking
  // matches the header CTA so the hover language reads as one system.
  const sizeCls =
    size === "lg" ? "h-14 px-9 text-xs" : "h-12 px-7 text-xs";
  // Outer border / colour.
  //   light  — outlined white on dark backdrops (hero pills).
  //   dark   — FILLED turquoise on light backdrops (body-of-page CTA);
  //            the slide-up below swaps to deep ink on hover so the
  //            colour change is the hover signal.
  const toneCls =
    tone === "light"
      ? "border border-white/50 text-white"
      : "border border-[var(--color-primary)] bg-[var(--color-primary)] text-white";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative inline-flex w-fit items-center justify-center gap-3 overflow-hidden rounded-full font-medium uppercase tracking-[0.22em] backdrop-blur-sm transition-all duration-500",
        sizeCls,
        toneCls,
        className,
      )}
    >
      {/* Sliding fill — translates from below on hover. Light tone
          fills with white (text becomes deep ink); dark tone (already
          turquoise-filled) fills with deep ink so the colour change
          is the hover signal (text stays white throughout). */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -z-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0",
          tone === "light" ? "bg-white" : "bg-[var(--color-on-surface)]",
        )}
      />
      <span
        className={cn(
          "relative z-10 transition-colors duration-500",
          tone === "light" ? "group-hover:text-[#06141a]" : "",
        )}
      >
        {label}
        <span className="sr-only"> (opens WhatsApp in a new tab)</span>
      </span>
      <ArrowUpRight
        aria-hidden
        className={cn(
          "relative z-10 h-4 w-4 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
          tone === "light" ? "group-hover:text-[#06141a]" : "",
        )}
      />
    </a>
  );
}

interface StickyProps {
  number: string;
  label?: string;
  /** Threshold (px) past which the sticky CTA fades in. Defaults to ~80% of viewport (i.e. past the hero). */
  showAfter?: number;
}

/**
 * Mobile-only sticky bottom CTA. Appears after the user has scrolled
 * past the hero. Inherits the same look as the hero's BookHereCTA so
 * the experience is continuous. Hidden on parallax/immersive routes
 * via the host wrapper.
 */
export function StickyBookHere({
  number,
  label = "Book here",
  showAfter,
}: StickyProps) {
  const href = whatsappLink({ number });
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const threshold = showAfter ?? window.innerHeight * 0.7;
    const onScroll = () => setShow(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfter]);

  return (
    <div
      className={cn(
        // Mobile: stretches edge-to-edge inset-x-4. Desktop: shrinks to
        // a centred pill (auto width via w-auto on the anchor below).
        "pointer-events-none fixed inset-x-4 bottom-[max(env(safe-area-inset-bottom),0.75rem)] z-40 flex justify-center transition-all duration-300 md:inset-x-0 md:bottom-6",
        show
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "translate-y-4 opacity-0",
      )}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex h-12 w-full max-w-md items-center justify-center gap-3 overflow-hidden rounded-full border border-white/30 bg-[#06141a]/85 px-7 text-xs font-medium uppercase tracking-[0.22em] text-white shadow-2xl backdrop-blur-md transition-all duration-500 md:h-14 md:w-auto md:px-10"
      >
        <span
          aria-hidden
          className="absolute inset-0 -z-0 translate-y-full bg-white transition-transform duration-500 ease-out group-hover:translate-y-0"
        />
        <span className="relative z-10 transition-colors duration-500 group-hover:text-[#06141a]">
          {label}
        </span>
        <ArrowUpRight
          aria-hidden
          className="relative z-10 h-4 w-4 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#06141a]"
        />
      </a>
    </div>
  );
}
