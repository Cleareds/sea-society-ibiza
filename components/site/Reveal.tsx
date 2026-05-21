"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article" | "li" | "ul" | "header" | "footer";
  /** ms delay applied via inline style so we can stagger siblings */
  delay?: number;
}

/**
 * Fades a block in from below the first time it enters the viewport.
 * Pure CSS transition driven by a `data-revealed` attribute flipped by
 * IntersectionObserver — no per-frame work, GPU-only opacity + transform.
 *
 * Respects `prefers-reduced-motion` automatically (see globals.css).
 */
export function Reveal({
  as = "div",
  className,
  delay,
  children,
  ...rest
}: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      node.setAttribute("data-revealed", "true");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            // Defer the attribute flip to satisfy react-hooks/set-state-in-effect
            // and to let the browser batch the paint.
            queueMicrotask(() => e.target.setAttribute("data-revealed", "true"));
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  const style: React.CSSProperties | undefined = delay
    ? { transitionDelay: `${delay}ms` }
    : undefined;

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      data-reveal=""
      style={style}
      className={cn(className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
