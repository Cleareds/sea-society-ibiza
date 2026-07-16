import type { Locale } from "@/lib/i18n/config";

export interface FaqCopy {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSub: string;
  /** Short prompt above the WhatsApp/contact link at the foot of the page. */
  contactPrompt: string;
  contactCta: string;
  /** Shown when there are no published FAQs yet. */
  empty: string;
  /** Localised labels for the known FAQ categories (English key → label).
   *  Any category not listed falls back to its raw English value. */
  categoryLabels: Record<string, string>;
}

const en: FaqCopy = {
  metaTitle: "FAQ — Sea Society Ibiza yacht charter",
  metaDescription:
    "Answers to the questions we get most about chartering a yacht with Sea Society Ibiza — booking, what's included, routes and life on board.",
  heroEyebrow: "Good to know",
  heroTitle: "Frequently asked questions",
  heroSub: "Everything worth knowing before your day on the water.",
  contactPrompt: "Still have a question?",
  contactCta: "Talk to us",
  empty: "We're putting our FAQs together — in the meantime, just message us.",
  categoryLabels: {},
};

const es: FaqCopy = {
  metaTitle: "Preguntas frecuentes — Sea Society Ibiza",
  metaDescription:
    "Respuestas a las preguntas más habituales sobre alquilar un yate con Sea Society Ibiza: reservas, qué incluye, rutas y la vida a bordo.",
  heroEyebrow: "Información útil",
  heroTitle: "Preguntas frecuentes",
  heroSub: "Todo lo que conviene saber antes de tu día en el mar.",
  contactPrompt: "¿Tienes otra pregunta?",
  contactCta: "Habla con nosotros",
  empty: "Estamos preparando nuestras preguntas frecuentes — mientras tanto, escríbenos.",
  categoryLabels: {
    Booking: "Reservas",
    "What's included": "Qué incluye",
    Logistics: "Logística",
    Onboard: "A bordo",
    Routes: "Rutas",
  },
};

const fr: FaqCopy = {
  metaTitle: "FAQ — Sea Society Ibiza",
  metaDescription:
    "Réponses aux questions les plus fréquentes sur la location d'un yacht avec Sea Society Ibiza : réservation, prestations incluses, itinéraires et vie à bord.",
  heroEyebrow: "Bon à savoir",
  heroTitle: "Questions fréquentes",
  heroSub: "Tout ce qu'il faut savoir avant votre journée en mer.",
  contactPrompt: "Une autre question ?",
  contactCta: "Parlez-nous",
  empty: "Nous préparons notre FAQ — en attendant, écrivez-nous.",
  categoryLabels: {
    Booking: "Réservation",
    "What's included": "Prestations incluses",
    Logistics: "Logistique",
    Onboard: "À bord",
    Routes: "Itinéraires",
  },
};

const nl: FaqCopy = {
  metaTitle: "Veelgestelde vragen — Sea Society Ibiza",
  metaDescription:
    "Antwoorden op de vragen die we het vaakst krijgen over het charteren van een jacht bij Sea Society Ibiza — boeken, inbegrepen, routes en het leven aan boord.",
  heroEyebrow: "Goed om te weten",
  heroTitle: "Veelgestelde vragen",
  heroSub: "Alles wat u wilt weten voordat u het water op gaat.",
  contactPrompt: "Nog een vraag?",
  contactCta: "Neem contact op",
  empty: "We stellen onze veelgestelde vragen samen — stuur ons intussen gerust een bericht.",
  categoryLabels: {
    Booking: "Boeken",
    "What's included": "Inbegrepen",
    Logistics: "Logistiek",
    Onboard: "Aan boord",
    Routes: "Routes",
  },
};

const copy: Record<Locale, FaqCopy> = { en, es, fr, nl };

export function getFaqCopy(locale: Locale): FaqCopy {
  return copy[locale] ?? en;
}
