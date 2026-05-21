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
import { LocaleSwitcher } from "@/components/site/LocaleSwitcher";
import { localePath, type Locale } from "@/lib/i18n/config";

export interface HeaderLabels {
  fleet: string;
  experiences: string;
  destinations: string;
  about: string;
  contact: string;
  enquireNow: string;
  menu: string;
  openMenu: string;
}

interface HeaderProps {
  transparentOnHero?: boolean;
  locale: Locale;
  labels: HeaderLabels;
}

export function Header({ transparentOnHero = false, locale, labels }: HeaderProps) {
  // Initialise from `transparentOnHero` so we never need a sync setState
  // inside the effect for the static-header case (React 19.2 forbids it).
  const [scrolled, setScrolled] = React.useState(!transparentOnHero);

  React.useEffect(() => {
    if (!transparentOnHero) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    queueMicrotask(onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnHero]);

  const isSolid = scrolled || !transparentOnHero;
  const lp = (path: string) => localePath(locale, path);

  const navLinks = [
    { href: lp("/fleet"), label: labels.fleet },
    { href: lp("/experiences"), label: labels.experiences },
    { href: lp("/destinations"), label: labels.destinations },
    { href: lp("/about"), label: labels.about },
  ];

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
          href={lp("/")}
          className={cn(
            "flex flex-col leading-none",
            isSolid ? "text-[var(--color-primary)]" : "text-white",
          )}
        >
          <span className="font-serif text-xl tracking-tight md:text-2xl">Sea Society Ibiza</span>
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

        <div className="hidden items-center gap-4 md:flex">
          <LocaleSwitcher currentLocale={locale} variant={isSolid ? "solid" : "transparent"} />
          <Button
            asChild
            variant="primary"
            size="sm"
            className={cn(!isSolid && "shadow-lg")}
          >
            <Link href={lp("/contact")}>{labels.enquireNow}</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label={labels.openMenu}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden",
                isSolid ? "text-[var(--color-on-surface)]" : "text-white",
              )}
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col gap-8">
            <SheetTitle className="text-3xl">{labels.menu}</SheetTitle>
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
                  <Link href={lp("/contact")} className="block py-2 font-serif">
                    {labels.contact}
                  </Link>
                </SheetClose>
              </li>
            </ul>
            <div className="mt-4">
              <LocaleSwitcher currentLocale={locale} variant="solid" />
            </div>
            <SheetClose asChild>
              <Button asChild variant="primary" size="lg" className="mt-auto">
                <Link href={lp("/contact")}>{labels.enquireNow}</Link>
              </Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
