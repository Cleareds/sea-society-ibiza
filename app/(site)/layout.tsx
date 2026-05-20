import { getSettings } from "@/lib/data";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import { CookieBanner } from "@/components/site/CookieBanner";
import { Analytics } from "@/components/site/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationLd } from "@/lib/seo/jsonld";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <JsonLd data={organizationLd(settings)} />
      <Header transparentOnHero />
      <main id="main" className="pt-0">
        {children}
      </main>
      <Footer settings={settings} />
      <WhatsAppCTA number={settings.whatsappNumber} />
      <CookieBanner />
      <Analytics />
    </>
  );
}
