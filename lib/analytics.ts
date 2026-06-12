"use client";

/**
 * Thin wrapper for our custom GTM dataLayer events.
 *
 * Single source of truth so any UI component fires events with a
 * consistent name + parameter shape. GTM Triggers of type "Custom
 * Event" matching the `event` name pick these up and fan out to
 * GA4 / Meta Pixel / etc.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

type Device = "mobile" | "tablet" | "desktop";

function detectDevice(): Device {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1100) return "tablet";
  return "desktop";
}

export interface BookHereContext {
  /**
   * Required. Identifies WHERE on the site the button was clicked.
   * Use the canonical taxonomy in components/site/BookHereCTA.tsx —
   * one of:
   *   header_pill           — top-nav WhatsApp pill
   *   sticky_mobile         — bottom-fixed mobile CTA (StickyBookHere)
   *   home_hero             — homepage 3D water hero
   *   boat_detail_hero      — /fleet/[slug] above-fold hero
   *   boat_detail_below_specs — /fleet/[slug] CTA below the spec block
   *   experience_detail_hero — /experiences/[slug] hero
   *   experience_detail_cta — /experiences/[slug] body-of-page CTA
   *   about_cta             — /about page CTA section
   *   contact_sidebar       — /contact page right rail
   *
   * New placements are fine; keep them snake_case and use a stable
   * value (don't include translated label text).
   */
  placement: string;
  /** Optional: boat slug when the click happens on a boat-specific surface. */
  boat?: string;
  /** Optional: experience slug when the click is on an experience surface. */
  experience?: string;
}

/**
 * Fire a `book_here_click` event. Always safe to call — no-ops if
 * GTM hasn't loaded (e.g. user declined consent in the cookie banner,
 * so the dataLayer was never initialised).
 *
 * The page path is read live from window.location; the device class
 * is computed from innerWidth at click time so it reflects current
 * viewport, not viewport at hydration.
 */
export function trackBookHereClick(ctx: BookHereContext): void {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push({
    event: "book_here_click",
    placement: ctx.placement,
    page_path: window.location.pathname,
    device: detectDevice(),
    boat: ctx.boat,
    experience: ctx.experience,
  });
}
