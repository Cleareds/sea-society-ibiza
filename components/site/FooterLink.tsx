"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface FooterLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Footer-only wrapper around next/link. If the destination matches
 * the current pathname, clicking scrolls the window to the top
 * (smooth) instead of being a silent no-op. Restricted to the
 * footer per product decision — header / in-page links keep their
 * default behaviour.
 */
export function FooterLink({ href, className, children }: FooterLinkProps) {
  const pathname = usePathname() ?? "";

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (cmd/ctrl/shift/meta/middle-click) fall
    // through to the browser so "open in new tab" still works.
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    // Normalise trailing slashes so "/about" and "/about/" match.
    const norm = (p: string) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p);
    if (norm(href) !== norm(pathname)) return;

    // Same-route click — Next.js already preventDefaults this and
    // no-ops the navigation, leaving the user staring at the page
    // they're already on. Scroll them to the top instead.
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
