import type { Settings } from "@/lib/data/types";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Translator } from "@/lib/i18n/messages";
import { FooterLink } from "@/components/site/FooterLink";
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

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9.05a8.16 8.16 0 0 0 4.83 1.55v-3.45a4.74 4.74 0 0 1-1.9-.46z" />
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
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 py-2 text-[var(--color-on-surface)] transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:underline focus-visible:outline-none"
                aria-label="Sea Society on Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
                {settings.instagramHandle}
              </a>
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 py-2 text-[var(--color-on-surface)] transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:underline focus-visible:outline-none"
                  aria-label="Sea Society on Facebook"
                >
                  <FacebookIcon className="h-4 w-4" />
                  Facebook
                </a>
              )}
              {settings.tiktokUrl && (
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 py-2 text-[var(--color-on-surface)] transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:underline focus-visible:outline-none"
                  aria-label="Sea Society on TikTok"
                >
                  <TikTokIcon className="h-4 w-4" />
                  TikTok
                </a>
              )}
            </div>
          </div>

          <nav aria-label={t("footer.explore")}>
            <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
              {t("footer.explore")}
            </h2>
            {/*
             * Each link is an inline-flex 44px-tall row so the tap
             * target meets WCAG 2.5.5 AAA / Apple HIG. Bare text-sm
             * lines were too easy to miss on a trackpad, especially
             * when the sticky CTA wrapper sat over the page bottom.
             */}
            <ul className="mt-2 flex flex-col text-sm">
              <li>
                <FooterLink
                  href={lp("/fleet")}
                  className="inline-flex min-h-[44px] items-center py-2 transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:underline focus-visible:outline-none"
                >
                  {t("nav.fleet")}
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  href={lp("/destinations")}
                  className="inline-flex min-h-[44px] items-center py-2 transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:underline focus-visible:outline-none"
                >
                  {t("nav.destinations")}
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  href={lp("/about")}
                  className="inline-flex min-h-[44px] items-center py-2 transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:underline focus-visible:outline-none"
                >
                  {t("nav.about")}
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  href={lp("/contact")}
                  className="inline-flex min-h-[44px] items-center py-2 transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:outline-none focus-visible:underline"
                >
                  {t("nav.contact")}
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  href={lp("/faq")}
                  className="inline-flex min-h-[44px] items-center py-2 transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:outline-none focus-visible:underline"
                >
                  {t("nav.faq")}
                </FooterLink>
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
          <ul className="flex flex-wrap gap-x-4" aria-label="Legal and tools">
            <li>
              <FooterLink
                href={lp("/privacy")}
                className="inline-flex min-h-[44px] items-center py-2 transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:underline focus-visible:outline-none"
              >
                {t("footer.privacy")}
              </FooterLink>
            </li>
            <li>
              <FooterLink
                href={lp("/terms")}
                className="inline-flex min-h-[44px] items-center py-2 transition-colors hover:text-[var(--color-primary)] focus-visible:text-[var(--color-primary)] focus-visible:underline focus-visible:outline-none"
              >
                {t("footer.terms")}
              </FooterLink>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
