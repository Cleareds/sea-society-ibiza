"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
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
  const sizeCls =
    size === "lg" ? "h-14 px-9 text-base" : "h-12 px-7 text-sm md:text-base";
  const toneCls =
    tone === "light"
      ? "border border-white/40 bg-white/5 text-white hover:bg-white/15"
      : "border border-[var(--color-on-surface)]/20 bg-[var(--color-on-surface)] text-[var(--color-surface)] hover:opacity-90";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex w-fit items-center justify-center gap-3 rounded-full font-medium tracking-wide backdrop-blur-sm transition-all",
        "hover:-translate-y-0.5",
        sizeCls,
        toneCls,
        className,
      )}
    >
      <span>{label}</span>
      <ArrowRight
        aria-hidden
        className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
        className="group inline-flex h-12 w-full max-w-md items-center justify-center gap-3 rounded-full border border-white/30 bg-[#06141a]/85 px-7 text-sm font-medium tracking-wide text-white shadow-2xl backdrop-blur-md transition-all hover:bg-[#06141a] md:h-14 md:w-auto md:px-10 md:text-base"
      >
        {label}
        <ArrowRight
          aria-hidden
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
        />
      </a>
    </div>
  );
}
