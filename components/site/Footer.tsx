import Link from "next/link";
import type { Settings } from "@/lib/data/types";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Translator } from "@/lib/i18n/messages";
import { Logo } from "@/components/site/Logo";

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
  locale: Locale;
  t: Translator;
}

export function Footer({ settings, locale, t }: FooterProps) {
  const lp = (path: string) => localePath(locale, path);
  return (
    <footer className="relative z-20 border-t border-[var(--color-outline-variant)]/40 bg-[var(--color-surface-container-low)]">
      <div className="mx-auto max-w-(--spacing-container-max) px-5 py-16 md:px-10 md:py-20">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo variant="dark" height={44} alt="Sea Society Ibiza" />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
              {t("footer.summary")}
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

          <nav aria-label={t("footer.explore")}>
            <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
              {t("footer.explore")}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href={lp("/fleet")} className="hover:text-[var(--color-primary)]">
                  {t("nav.fleet")}
                </Link>
              </li>
              <li>
                <Link href={lp("/destinations")} className="hover:text-[var(--color-primary)]">
                  {t("nav.destinations")}
                </Link>
              </li>
              <li>
                <Link href={lp("/about")} className="hover:text-[var(--color-primary)]">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href={lp("/contact")} className="hover:text-[var(--color-primary)]">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
              {t("footer.visitUs")}
            </h2>
            <address className="mt-4 not-italic text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
              {settings.address}
            </address>
            {/* min-h-[44px] meets WCAG 2.5.5 AAA touch target (44×44). */}
            <p className="mt-3 text-sm">
              <a
                href={`mailto:${settings.email}`}
                className="inline-flex min-h-[44px] items-center py-2 hover:text-[var(--color-primary)]"
              >
                {settings.email}
              </a>
            </p>
            <p className="text-sm">
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex min-h-[44px] items-center py-2 hover:text-[var(--color-primary)]"
              >
                {settings.phone}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--color-outline-variant)]/40 pt-6 text-xs text-[var(--color-on-surface-variant)] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Sea Society Ibiza. By Ibimar.</p>
          <ul className="flex flex-wrap gap-4" aria-label="Legal and tools">
            <li>
              <Link href={lp("/privacy")} className="hover:text-[var(--color-primary)]">
                {t("footer.privacy")}
              </Link>
            </li>
            <li>
              <Link href={lp("/terms")} className="hover:text-[var(--color-primary)]">
                {t("footer.terms")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
