"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import { trackBookHereClick } from "@/lib/analytics";

interface InlineProps {
  number: string;
  boatName?: string;
  label?: string;
  className?: string;
  /** Style: 'light' is white pill on dark (immersive style); 'dark' is dark pill on light. */
  tone?: "light" | "dark";
  size?: "md" | "lg";
  /** Analytics: where on the site this button is rendered. See
   *  lib/analytics.ts for the taxonomy. Required so conversion
   *  attribution works. */
  placement: string;
  /** Optional: boat slug if the surrounding context is boat-specific. */
  boatSlug?: string;
  /** Optional: experience slug if the context is experience-specific. */
  experienceSlug?: string;
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
  placement,
  boatSlug,
  experienceSlug,
}: InlineProps) {
  const href = whatsappLink({ number, boatName });
  const onClick = React.useCallback(() => {
    trackBookHereClick({ placement, boat: boatSlug, experience: experienceSlug });
  }, [placement, boatSlug, experienceSlug]);
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
      onClick={onClick}
      className={cn(
        "group relative inline-flex w-fit items-center justify-center gap-3 overflow-hidden rounded-full font-medium uppercase tracking-[0.22em] backdrop-blur-sm transition-all duration-500",
        sizeCls,
        toneCls,
        className,
      )}
    >
      {/* Sliding fill — translates from below on hover. Both tones
          fill with white so the hover state reads as an INVERSE pill:
          white background, black text, black border (border colour
          is constant via toneCls above; the bg-white slide-up reveals
          it). Text + icon flip to black on hover via group-hover. */}
      <span
        aria-hidden
        className="absolute inset-0 -z-0 translate-y-full bg-white transition-transform duration-500 ease-out group-hover:translate-y-0"
      />
      <span className="relative z-10 transition-colors duration-500 group-hover:text-[#000000]">
        {label}
        <span className="sr-only"> (opens WhatsApp in a new tab)</span>
      </span>
      <ArrowUpRight
        aria-hidden
        className="relative z-10 h-4 w-4 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#000000]"
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
  const onClick = React.useCallback(() => {
    trackBookHereClick({ placement: "sticky_mobile" });
  }, []);

  React.useEffect(() => {
    const threshold = showAfter ?? window.innerHeight * 0.7;
    const onScroll = () => setShow(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfter]);

  return (
    <div
      // pointer-events stays `none` on the wrapper at all times so the
      // empty flex space alongside the centred pill never intercepts
      // clicks on whatever is behind it (the footer, page CTAs, etc).
      // Only the anchor itself opts back in via pointer-events-auto.
      className={cn(
        // Mobile: stretches edge-to-edge inset-x-4. Desktop: shrinks to
        // a centred pill (auto width via w-auto on the anchor below).
        "pointer-events-none fixed inset-x-4 bottom-[max(env(safe-area-inset-bottom),0.75rem)] z-40 flex justify-center transition-all duration-300 md:inset-x-0 md:bottom-6",
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={cn(
          "group pointer-events-auto relative inline-flex h-12 w-full max-w-md items-center justify-center gap-3 overflow-hidden rounded-full border border-white/30 bg-[#000000]/85 px-7 text-xs font-medium uppercase tracking-[0.22em] text-white shadow-2xl backdrop-blur-md transition-all duration-500 md:h-14 md:w-auto md:px-10",
          // Disable the anchor too when hidden so it can't steal focus
          // or be tab-activated while invisible.
          !show && "pointer-events-none",
        )}
        tabIndex={show ? undefined : -1}
        aria-hidden={show ? undefined : true}
      >
        <span
          aria-hidden
          className="absolute inset-0 -z-0 translate-y-full bg-white transition-transform duration-500 ease-out group-hover:translate-y-0"
        />
        <span className="relative z-10 transition-colors duration-500 group-hover:text-[#000000]">
          {label}
        </span>
        <ArrowUpRight
          aria-hidden
          className="relative z-10 h-4 w-4 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#000000]"
        />
      </a>
    </div>
  );
}
