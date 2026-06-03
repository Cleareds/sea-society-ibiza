import { notFound } from "next/navigation";
import { getSettings } from "@/lib/data";
import { Header, type HeaderLabels } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SiteCursor } from "@/components/site/SiteCursor";
import { StickyCTAGate } from "@/components/site/StickyCTAGate";
import { CookieBanner, type CookieLabels } from "@/components/site/CookieBanner";
import { Analytics } from "@/components/site/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { HtmlLang } from "@/components/site/HtmlLang";
import { organizationLd } from "@/lib/seo/jsonld";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const settings = await getSettings();
  const t = getMessages(lc);
  // EN-canonical settings; pages that show about/contact body apply
  // mergeI18n(settings.about, settings.aboutI18n, lc).

  const headerLabels: HeaderLabels = {
    fleet: t("nav.fleet"),
    experiences: t("nav.experiences"),
    destinations: t("nav.destinations"),
    about: t("nav.about"),
    contact: t("nav.contact"),
    menu: t("nav.menu"),
    openMenu: t("nav.openMenu"),
    bookHere: t("cta.bookHere"),
  };
  const cookieLabels: CookieLabels = {
    title: t("cookies.title"),
    body: t("cookies.body"),
    preferences: t("cookies.preferences"),
    necessary: t("cookies.necessary"),
    necessaryHint: t("cookies.necessaryHint"),
    analytics: t("cookies.analytics"),
    analyticsHint: t("cookies.analyticsHint"),
    marketing: t("cookies.marketing"),
    marketingHint: t("cookies.marketingHint"),
    acceptAll: t("cookies.acceptAll"),
    choose: t("cookies.choose"),
    saveSelection: t("cookies.saveSelection"),
    rejectAll: t("cookies.rejectAll"),
  };

  return (
    <>
      <HtmlLang locale={lc} />
      <JsonLd data={organizationLd(settings)} />
      <Header
        transparentOnHero
        locale={lc}
        labels={headerLabels}
        whatsappNumber={settings.whatsappNumber}
      />
      <main id="main" className="pt-0">
        {children}
      </main>
      <Footer settings={settings} locale={lc} t={t} />
      {/* Sticky "Book here" appears on mobile after the user has
          scrolled past the hero. Gated to exclude parallax/immersive
          routes. */}
      <StickyCTAGate number={settings.whatsappNumber} />
      <SiteCursor />
      <CookieBanner labels={cookieLabels} />
      <Analytics />
    </>
  );
}
