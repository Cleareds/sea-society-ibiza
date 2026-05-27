"use client";

import { usePathname } from "next/navigation";
import { StickyBookHere } from "@/components/site/BookHereCTA";

/**
 * Renders the sticky "Book here" CTA on every page EXCEPT
 * /parallax and /immersive (which run their own bespoke heroes).
 */
export function StickyCTAGate({ number }: { number: string }) {
  const pathname = usePathname() ?? "";
  // Pathname examples: "/" , "/en/fleet" , "/en/parallax". The locale
  // segment is optional - match the last segment.
  const isExcluded = /\/(parallax|immersive)(\/|$)/.test(pathname);
  if (isExcluded) return null;
  return <StickyBookHere number={number} />;
}
