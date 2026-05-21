"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/fleet", label: "The Fleet" },
  { href: "/experiences", label: "Experiences" },
  { href: "/destinations", label: "Destinations" },
  { href: "/about", label: "About" },
];

interface HeaderProps {
  transparentOnHero?: boolean;
}

export function Header({ transparentOnHero = false }: HeaderProps) {
  // Initialise from `transparentOnHero` so we never need a sync setState
  // inside the effect for the static-header case (React 19.2 forbids it).
  const [scrolled, setScrolled] = React.useState(!transparentOnHero);

  React.useEffect(() => {
    if (!transparentOnHero) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Sync once on mount, deferred via microtask so we never set state inside
    // the effect body (react-hooks/set-state-in-effect).
    queueMicrotask(onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnHero]);

  const isSolid = scrolled || !transparentOnHero;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        isSolid
          ? "bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-outline-variant)]/30"
          : "bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-(--spacing-container-max) items-center justify-between px-5 md:h-20 md:px-10"
      >
        <Link
          href="/"
          className={cn(
            "flex flex-col leading-none",
            isSolid ? "text-[var(--color-primary)]" : "text-white",
          )}
        >
          <span className="font-serif text-xl md:text-2xl tracking-tight">Sea Society Ibiza</span>
          <span className="text-[10px] uppercase tracking-[0.25em] opacity-70">by Ibimar</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "text-sm transition-colors",
                  isSolid
                    ? "text-[var(--color-on-surface)] hover:text-[var(--color-primary)]"
                    : "text-white/90 hover:text-white",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button
            asChild
            variant="primary"
            size="sm"
            className={cn(!isSolid && "shadow-lg")}
          >
            <Link href="/contact">Enquire now</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden",
                isSolid ? "text-[var(--color-on-surface)]" : "text-white",
              )}
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col gap-8">
            <SheetTitle className="text-3xl">Menu</SheetTitle>
            <ul className="flex flex-col gap-2 text-2xl">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <SheetClose asChild>
                    <Link href={l.href} className="block py-2 font-serif">
                      {l.label}
                    </Link>
                  </SheetClose>
                </li>
              ))}
              <li>
                <SheetClose asChild>
                  <Link href="/contact" className="block py-2 font-serif">
                    Contact
                  </Link>
                </SheetClose>
              </li>
            </ul>
            <SheetClose asChild>
              <Button asChild variant="primary" size="lg" className="mt-auto">
                <Link href="/contact">Enquire now</Link>
              </Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
