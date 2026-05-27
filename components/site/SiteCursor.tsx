"use client";

import * as React from "react";
import "./site-cursor.css";

/**
 * Site-wide elastic ring-dot cursor. Same elastic + velocity-stretch
 * model as the immersive hero's cursor, mounted globally via the
 * site layout. Hidden on coarse-pointer / touch / reduced-motion via
 * CSS media queries (see site-cursor.css).
 */
export function SiteCursor() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let vx = 0;
    let vy = 0;
    let pcx = cx;
    let pcy = cy;

    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      const dx = cx - pcx;
      const dy = cy - pcy;
      pcx = cx;
      pcy = cy;
      vx += (dx - vx) * 0.35;
      vy += (dy - vy) * 0.35;
      const speed = Math.hypot(vx, vy);
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);
      const stretch = Math.min(0.4, speed * 0.025);
      const sx = 1 + stretch;
      const sy = 1 - stretch * 0.65;
      el.style.transform =
        `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) ` +
        `rotate(${angle}deg) scale(${sx}, ${sy})`;
      const settled =
        Math.abs(tx - cx) < 0.3 &&
        Math.abs(ty - cy) < 0.3 &&
        speed < 0.05;
      if (settled) {
        raf = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      // Skip synthesized pointer events from touch.
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      const overInteractive = (e.target as HTMLElement | null)?.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor='hover']",
      );
      el.dataset.hover = overInteractive ? "true" : "false";
      el.dataset.visible = "true";
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      el.dataset.visible = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="site-cursor" data-visible="false" aria-hidden />;
}
