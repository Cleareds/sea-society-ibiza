import type { Locale } from "@/lib/i18n/config";

export interface ContactCopy {
  metaTitle: string;
  metaDescription: string;
  /** Hero title rendered with a `<span class="brand-accent">{accent}</span>`
   *  highlight word — `before` + accent + `after` are joined inline. */
  heroBefore: string;
  heroAccent: string;
  heroAfter: string;
  faqEyebrow: string;
  faqTitle: string;
  faqIntro: string;
  sidebarEyebrow: string;
  /** Sidebar heading also has a single accent word — same split pattern as hero. */
  sidebarHeadingBefore: string;
  sidebarHeadingAccent: string;
  sidebarHeadingAfter: string;
  sidebarBody: string;
}

const en: ContactCopy = {
  metaTitle: "Contact & FAQ",
  metaDescription:
    "Frequently asked questions about Sea Society Ibiza charters — pricing, what's included, departure, weather policy. Send us a WhatsApp to book.",
  heroBefore: "Have a ",
  heroAccent: "question",
  heroAfter: "?",
  faqEyebrow: "FAQ",
  faqTitle: "Frequently asked.",
  faqIntro:
    "Most enquiries cover the same handful of things — pricing, what is included, where we depart from, what happens if the weather turns. Everything is below.",
  sidebarEyebrow: "Contact",
  sidebarHeadingBefore: "Ready to ",
  sidebarHeadingAccent: "book",
  sidebarHeadingAfter: "?",
  sidebarBody:
    "Send us a WhatsApp with your dates and group size. We respond within a few hours from Botafoc Marina.",
};

const es: ContactCopy = {
  metaTitle: "Contacto y FAQ",
  metaDescription:
    "Preguntas frecuentes sobre los charters de Sea Society Ibiza — precios, qué incluye, salida y política meteorológica. Escríbenos por WhatsApp para reservar.",
  heroBefore: "¿Tienes una ",
  heroAccent: "pregunta",
  heroAfter: "?",
  faqEyebrow: "FAQ",
  faqTitle: "Preguntas frecuentes.",
  faqIntro:
    "La mayoría de las consultas son sobre lo mismo — precios, qué incluye el charter, desde dónde salimos, qué pasa si cambia el tiempo. Todo está aquí abajo.",
  sidebarEyebrow: "Contacto",
  sidebarHeadingBefore: "¿Listo para ",
  sidebarHeadingAccent: "reservar",
  sidebarHeadingAfter: "?",
  sidebarBody:
    "Escríbenos por WhatsApp con tus fechas y el tamaño del grupo. Respondemos en pocas horas desde Marina Botafoc.",
};

const fr: ContactCopy = {
  metaTitle: "Contact et FAQ",
  metaDescription:
    "Questions fréquentes sur les charters Sea Society Ibiza — tarifs, ce qui est inclus, départ, politique météo. Écrivez-nous sur WhatsApp pour réserver.",
  heroBefore: "Une ",
  heroAccent: "question",
  heroAfter: " ?",
  faqEyebrow: "FAQ",
  faqTitle: "Questions fréquentes.",
  faqIntro:
    "La plupart des demandes portent sur les mêmes points — tarifs, ce qui est inclus, le point de départ, ce qu'il se passe si la météo tourne. Tout est ci-dessous.",
  sidebarEyebrow: "Contact",
  sidebarHeadingBefore: "Prêt à ",
  sidebarHeadingAccent: "réserver",
  sidebarHeadingAfter: " ?",
  sidebarBody:
    "Envoyez-nous un WhatsApp avec vos dates et la taille de votre groupe. Nous répondons en quelques heures depuis Marina Botafoc.",
};

const nl: ContactCopy = {
  metaTitle: "Contact & FAQ",
  metaDescription:
    "Veelgestelde vragen over Sea Society Ibiza-charters — prijzen, wat is inbegrepen, vertrek, weersbeleid. Stuur ons een WhatsApp om te boeken.",
  heroBefore: "Een ",
  heroAccent: "vraag",
  heroAfter: "?",
  faqEyebrow: "FAQ",
  faqTitle: "Veelgestelde vragen.",
  faqIntro:
    "De meeste vragen gaan over dezelfde onderwerpen — prijzen, wat is inbegrepen, waar we vertrekken, wat er gebeurt als het weer omslaat. Alles staat hieronder.",
  sidebarEyebrow: "Contact",
  sidebarHeadingBefore: "Klaar om te ",
  sidebarHeadingAccent: "boeken",
  sidebarHeadingAfter: "?",
  sidebarBody:
    "Stuur ons een WhatsApp met uw data en gezelschap. We antwoorden binnen enkele uren vanuit Marina Botafoc.",
};

export function getContactCopy(locale: Locale): ContactCopy {
  if (locale === "es") return es;
  if (locale === "fr") return fr;
  if (locale === "nl") return nl;
  return en;
}
