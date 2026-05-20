import Link from "next/link";
import type { Settings } from "@/lib/data/types";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

interface FooterProps {
  settings: Settings;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="border-t border-[var(--color-outline-variant)]/40 bg-[var(--color-surface-container-low)]">
      <div className="mx-auto max-w-(--spacing-container-max) px-5 py-16 md:px-10 md:py-20">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-serif text-2xl text-[var(--color-primary)]">Sea Society Ibiza</p>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
              by Ibimar
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
              Luxury yacht charter from Botafoc Marina, Ibiza. Nineteen boats, twenty years on the
              water, one phone call.
            </p>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--color-on-surface)] hover:text-[var(--color-primary)]"
            >
              <InstagramIcon className="h-4 w-4" />
              {settings.instagramHandle}
            </a>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
              Explore
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/fleet" className="hover:text-[var(--color-primary)]">
                  The Fleet
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="hover:text-[var(--color-primary)]">
                  Experiences
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-[var(--color-primary)]">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--color-primary)]">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--color-primary)]">
                  Contact &amp; FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
              Visit us
            </h2>
            <address className="mt-4 not-italic text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
              {settings.address}
            </address>
            <p className="mt-3 text-sm">
              <a href={`mailto:${settings.email}`} className="hover:text-[var(--color-primary)]">
                {settings.email}
              </a>
            </p>
            <p className="text-sm">
              <a href={`tel:${settings.phone}`} className="hover:text-[var(--color-primary)]">
                {settings.phone}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--color-outline-variant)]/40 pt-6 text-xs text-[var(--color-on-surface-variant)] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Sea Society Ibiza. By Ibimar.</p>
          <ul className="flex flex-wrap gap-4">
            <li>
              <Link href="/privacy" className="hover:text-[var(--color-primary)]">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[var(--color-primary)]">
                Terms &amp; cookies
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
