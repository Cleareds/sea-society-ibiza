"use client";

/**
 * Thin wrapper around gtag for our custom GA4 events.
 *
 * Single source of truth so any UI component fires events with a
 * consistent name + parameter shape. GTM tags can listen on the same
 * event name (gtag('event', …) pushes to window.dataLayer under the
 * hood, so GTM Triggers of type "Custom Event" with the matching
 * name will fire).
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
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
 * gtag isn't loaded (e.g. user declined analytics in the cookie banner).
 *
 * The page path is read live from window.location; the device class
 * is computed from innerWidth at click time so it reflects current
 * viewport, not viewport at hydration.
 */
export function trackBookHereClick(ctx: BookHereContext): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "book_here_click", {
    placement: ctx.placement,
    page_path: window.location.pathname,
    device: detectDevice(),
    boat: ctx.boat,
    experience: ctx.experience,
    // sendBeacon transport so the request survives the navigation /
    // new-tab open without being aborted.
    transport_type: "beacon",
  });
}
