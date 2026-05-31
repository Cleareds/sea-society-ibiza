"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Logo } from "@/components/site/Logo";
import { localePath, type Locale } from "@/lib/i18n/config";
import { whatsappLink } from "@/lib/whatsapp";
import { trackBookHereClick } from "@/lib/analytics";

export interface HeaderLabels {
  fleet: string;
  experiences: string;
  destinations: string;
  about: string;
  contact: string;
  menu: string;
  openMenu: string;
}

interface HeaderProps {
  transparentOnHero?: boolean;
  locale: Locale;
  labels: HeaderLabels;
  /** When provided, renders a Book here pill in the header next to the nav. */
  whatsappNumber?: string;
}

export function Header({ transparentOnHero = false, locale, labels, whatsappNumber }: HeaderProps) {
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
          className="inline-flex items-center leading-none"
          aria-label="Sea Society Ibiza — home"
        >
          <Logo
            variant={isSolid ? "dark" : "light"}
            height={40}
            priority
            alt="Sea Society Ibiza"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8">
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

          {whatsappNumber && (
            <>
            <a
              href={whatsappLink({ number: whatsappNumber })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackBookHereClick({ placement: "header_pill" })}
              className={cn(
                // Luxe pill — thin gold border, sliding fill on hover, never a
                // generic button. Same height as the nav so it sits inside
                // the optical baseline.
                "group relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-full border px-5 text-xs font-medium uppercase tracking-[0.22em] transition-all duration-500",
                isSolid
                  ? "border-[var(--color-primary)]/40 text-[var(--color-primary)] hover:border-[var(--color-primary)]"
                  : "border-white/80 text-white hover:border-white",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-0 -z-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0",
                  isSolid ? "bg-[var(--color-primary)]" : "bg-white",
                )}
              />
              <span
                className={cn(
                  "relative z-10 transition-colors duration-500",
                  isSolid
                    ? "group-hover:text-white"
                    : "group-hover:text-[#000000]",
                )}
              >
                Book here
              </span>
              <ArrowUpRight
                aria-hidden
                className={cn(
                  "relative z-10 h-3.5 w-3.5 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                  isSolid
                    ? "group-hover:text-white"
                    : "group-hover:text-[#000000]",
                )}
              />
            </a>
            {/* SS brand mark — sits next to the pill, baseline-aligned. */}
            <Link
              href={lp("/")}
              aria-label="Sea Society Ibiza — home"
              className="inline-flex h-10 w-10 items-center justify-center"
            >
              <Image
                src={isSolid ? "/brand/icon-dark-180.webp" : "/brand/icon-light-180.webp"}
                alt=""
                width={40}
                height={40}
                priority
                className="h-10 w-10 object-contain"
              />
            </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={labels.openMenu}
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-full",
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
          </SheetContent>
          </Sheet>
          <Link
            href={lp("/")}
            aria-label="Sea Society Ibiza — home"
            className="relative inline-flex h-10 w-10 items-center justify-center"
          >
            <Image
              src={isSolid ? "/brand/icon-dark-180.webp" : "/brand/icon-light-180.webp"}
              alt=""
              width={36}
              height={36}
              priority
              className="h-9 w-9 object-contain"
            />
          </Link>
        </div>
      </nav>
    </header>
  );
}
