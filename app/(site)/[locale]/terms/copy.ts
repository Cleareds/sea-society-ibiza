import type { Locale } from "@/lib/i18n/config";

export interface TermsSection {
  heading: string;
  body: string[];
  bullets?: string[];
}

export interface TermsCopy {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  effectiveDate: string;
  intro: string[];
  sections: TermsSection[];
}

const en: TermsCopy = {
  metaTitle: "Terms of Use — Sea Society Ibiza",
  metaDescription:
    "Terms governing the use of seasocietyibiza.com — a marketing site for Sea Society Ibiza (operated by Ibimar). No bookings are concluded on the site; charter contracts are handled separately.",
  heroEyebrow: "Legal",
  heroTitle: "Terms of Use",
  effectiveDate: "Effective: 1 June 2026",
  intro: [
    "These Terms of Use (\"Terms\") govern your use of seasocietyibiza.com (\"the site\"), a marketing website operated by Sea Society Ibiza, a trading name of Ibimar Charter S.L. (\"Sea Society\", \"we\", \"us\"). By using the site you agree to these Terms.",
    "The site is informational. No bookings, contracts or payments are concluded on the site. If you decide to charter a vessel with us, that contract is handled separately by Ibimar Charter S.L. under its own terms.",
  ],
  sections: [
    {
      heading: "1. About the site",
      body: [
        "Seasocietyibiza.com presents the Sea Society fleet, experiences and destinations and lets visitors get in touch by enquiry form or WhatsApp. Any information shown — prices, availability, vessel specifications, itineraries — is indicative and subject to confirmation in writing as part of a separate charter agreement.",
      ],
    },
    {
      heading: "2. Permitted use",
      body: [
        "You may browse and share the site for personal, non-commercial purposes.",
      ],
      bullets: [
        "Do not attempt to access non-public areas, admin endpoints, or other users' data.",
        "Do not scrape, mirror, frame or systematically copy the site.",
        "Do not introduce malware, run automated requests at a rate that affects availability, or otherwise abuse the infrastructure.",
        "Do not use the site or our brand to deceive, misrepresent affiliation, or for unlawful purposes.",
      ],
    },
    {
      heading: "3. Enquiries are not contracts",
      body: [
        "Submitting an enquiry through the form, by WhatsApp or by email is a request for information. It does not, by itself, create a contract for any service. A charter contract only exists once Sea Society / Ibimar Charter S.L. and you have separately agreed terms in writing.",
        "Information you send us through the site is processed according to our Privacy Policy.",
      ],
    },
    {
      heading: "4. Accuracy of information",
      body: [
        "We make reasonable efforts to keep prices, availability, vessel details and itineraries accurate, but information on the site may change without notice and may contain errors. The site does not constitute a binding offer.",
        "Photographs, video and other imagery are illustrative and may not show the exact vessel, configuration or sea conditions you will encounter.",
      ],
    },
    {
      heading: "5. Intellectual property",
      body: [
        "The site, its design, text, photographs, video, logos and brand marks are owned by Sea Society / Ibimar Charter S.L. or licensed to us. They are protected by intellectual-property law.",
        "You may not reproduce, distribute, modify, publicly display or use them commercially without our prior written consent. Sharing a link to the site or to a specific page is welcome.",
      ],
    },
    {
      heading: "6. Third-party content + links",
      body: [
        "The site may link to or load content from third parties (Instagram, Google, Vercel, WhatsApp and others). We do not control those services and are not responsible for their content, policies or availability.",
        "When you click a Book here button you are taken to WhatsApp, which is governed by WhatsApp's own terms and privacy policy.",
      ],
    },
    {
      heading: "7. Availability + changes",
      body: [
        "We make reasonable efforts to keep the site available but do not guarantee uninterrupted access. We may modify, suspend or discontinue the site (or any part of it) at any time without notice.",
      ],
    },
    {
      heading: "8. Disclaimer + limitation of liability",
      body: [
        "The site is provided on an \"as is\" and \"as available\" basis. To the maximum extent permitted by Spanish law, we exclude implied warranties and any liability for indirect or consequential losses arising from your use of the site.",
        "Nothing in these Terms limits liability for death, personal injury caused by negligence, fraud, or any liability that cannot be limited under Spanish law. Statutory consumer rights are unaffected.",
      ],
    },
    {
      heading: "9. Privacy + cookies",
      body: [
        "Use of the site is also governed by our Privacy Policy, which explains how we process personal data, and by the cookie banner shown on first visit. You can change your cookie preferences at any time.",
      ],
    },
    {
      heading: "10. Consumer rights",
      body: [
        "Nothing in these Terms limits your statutory rights as a consumer under Spanish or EU law, in particular the General Law for the Defence of Consumers and Users (TRLGDCU, Real Decreto Legislativo 1/2007) and Directive (EU) 2011/83.",
        "The EU's Online Dispute Resolution platform is available at https://ec.europa.eu/consumers/odr.",
      ],
    },
    {
      heading: "11. Applicable law + jurisdiction",
      body: [
        "These Terms are governed by Spanish law. Any dispute relating to the site is subject to the jurisdiction of the courts of Ibiza, Balearic Islands (Juzgados de Ibiza), without prejudice to the consumer's right to bring the action before the courts of their own domicile under EU consumer jurisdiction rules.",
      ],
    },
    {
      heading: "12. Changes to these Terms",
      body: [
        "We may update these Terms occasionally. The effective date at the top of this page changes when we do. Continued use of the site after a change means you accept the updated Terms.",
      ],
    },
    {
      heading: "13. Contact",
      body: [
        "Questions about these Terms or about the site: hello@seasocietyibiza.com.",
      ],
    },
  ],
};

const es: TermsCopy = {
  metaTitle: "Términos de uso — Sea Society Ibiza",
  metaDescription:
    "Términos que rigen el uso de seasocietyibiza.com — un sitio de marketing de Sea Society Ibiza (operada por Ibimar). En el sitio no se cierran reservas; los contratos de charter se gestionan por separado.",
  heroEyebrow: "Legal",
  heroTitle: "Términos de uso",
  effectiveDate: "En vigor desde el 1 de junio de 2026",
  intro: [
    "Estos Términos de Uso (\"Términos\") rigen el uso de seasocietyibiza.com (\"el sitio\"), un sitio web de marketing operado por Sea Society Ibiza, nombre comercial de Ibimar Charter S.L. (\"Sea Society\", \"nosotros\"). Al utilizar el sitio aceptas estos Términos.",
    "El sitio es informativo. En él no se cierran reservas, contratos ni pagos. Si decides contratar un charter con nosotros, ese contrato se gestiona por separado por Ibimar Charter S.L. conforme a sus propios términos.",
  ],
  sections: [
    {
      heading: "1. Sobre el sitio",
      body: [
        "Seasocietyibiza.com presenta la flota, las experiencias y los destinos de Sea Society y permite a los visitantes ponerse en contacto mediante el formulario o por WhatsApp. Cualquier información mostrada — precios, disponibilidad, especificaciones de las embarcaciones, itinerarios — es indicativa y queda sujeta a confirmación por escrito como parte de un acuerdo de charter independiente.",
      ],
    },
    {
      heading: "2. Uso permitido",
      body: [
        "Puedes navegar y compartir el sitio con fines personales y no comerciales.",
      ],
      bullets: [
        "No intentes acceder a áreas no públicas, endpoints de administración o datos de otros usuarios.",
        "No hagas scraping, mirroring, framing ni copies el sitio de forma sistemática.",
        "No introduzcas malware, no realices solicitudes automatizadas a un ritmo que afecte la disponibilidad, ni abuses de la infraestructura.",
        "No utilices el sitio ni nuestra marca para engañar, simular afiliación o para fines ilícitos.",
      ],
    },
    {
      heading: "3. Las consultas no son contratos",
      body: [
        "Enviar una consulta mediante el formulario, por WhatsApp o por email es una solicitud de información. Por sí sola no crea un contrato de servicio. Un contrato de charter sólo existe una vez que Sea Society / Ibimar Charter S.L. y tú habéis acordado los términos por escrito de forma separada.",
        "La información que nos envíes a través del sitio se trata conforme a nuestra Política de Privacidad.",
      ],
    },
    {
      heading: "4. Exactitud de la información",
      body: [
        "Hacemos esfuerzos razonables para mantener actualizados los precios, la disponibilidad, los detalles de las embarcaciones y los itinerarios, pero la información del sitio puede cambiar sin previo aviso y puede contener errores. El sitio no constituye una oferta vinculante.",
        "Las fotografías, vídeos y demás imágenes son ilustrativos y pueden no mostrar la embarcación exacta, la configuración o las condiciones del mar que encontrarás.",
      ],
    },
    {
      heading: "5. Propiedad intelectual",
      body: [
        "El sitio, su diseño, textos, fotografías, vídeos, logotipos y marca son propiedad de Sea Society / Ibimar Charter S.L. o están licenciados a nosotros. Están protegidos por la legislación de propiedad intelectual.",
        "No puedes reproducirlos, distribuirlos, modificarlos, exhibirlos públicamente ni usarlos comercialmente sin nuestro consentimiento previo por escrito. Compartir un enlace al sitio o a una página concreta es bienvenido.",
      ],
    },
    {
      heading: "6. Contenido y enlaces de terceros",
      body: [
        "El sitio puede enlazar o cargar contenido de terceros (Instagram, Google, Vercel, WhatsApp y otros). No controlamos esos servicios y no somos responsables de su contenido, sus políticas ni su disponibilidad.",
        "Al pulsar un botón Reservar aquí se abre WhatsApp, que se rige por los propios términos y política de privacidad de WhatsApp.",
      ],
    },
    {
      heading: "7. Disponibilidad y cambios",
      body: [
        "Hacemos esfuerzos razonables para mantener el sitio disponible pero no garantizamos un acceso ininterrumpido. Podemos modificar, suspender o discontinuar el sitio (o cualquier parte) en cualquier momento sin previo aviso.",
      ],
    },
    {
      heading: "8. Exención y limitación de responsabilidad",
      body: [
        "El sitio se ofrece \"tal cual\" y \"según disponibilidad\". En la máxima medida permitida por el derecho español, excluimos las garantías implícitas y toda responsabilidad por daños indirectos o consecuentes derivados de tu uso del sitio.",
        "Nada en estos Términos limita la responsabilidad por muerte, lesiones personales causadas por negligencia, dolo o cualquier responsabilidad que no pueda limitarse conforme al derecho español. Los derechos legales del consumidor no se ven afectados.",
      ],
    },
    {
      heading: "9. Privacidad y cookies",
      body: [
        "El uso del sitio también se rige por nuestra Política de Privacidad, que explica cómo tratamos los datos personales, y por el banner de cookies que aparece en la primera visita. Puedes cambiar tus preferencias de cookies en cualquier momento.",
      ],
    },
    {
      heading: "10. Derechos del consumidor",
      body: [
        "Nada en estos Términos limita tus derechos legales como consumidor conforme al derecho español o de la UE, en particular la Ley General para la Defensa de los Consumidores y Usuarios (TRLGDCU, Real Decreto Legislativo 1/2007) y la Directiva (UE) 2011/83.",
        "La plataforma de Resolución de Litigios en Línea de la UE está disponible en https://ec.europa.eu/consumers/odr.",
      ],
    },
    {
      heading: "11. Ley aplicable y jurisdicción",
      body: [
        "Estos Términos se rigen por el derecho español. Cualquier controversia relativa al sitio se someterá a la jurisdicción de los Juzgados de Ibiza, Islas Baleares, sin perjuicio del derecho del consumidor a presentar la acción ante los tribunales de su propio domicilio conforme a las normas de jurisdicción consumerista de la UE.",
      ],
    },
    {
      heading: "12. Cambios en estos Términos",
      body: [
        "Podemos actualizar estos Términos ocasionalmente. La fecha de entrada en vigor al inicio de esta página cambia cuando lo hacemos. El uso continuado del sitio tras un cambio implica la aceptación de los Términos actualizados.",
      ],
    },
    {
      heading: "13. Contacto",
      body: [
        "Preguntas sobre estos Términos o sobre el sitio: hello@seasocietyibiza.com.",
      ],
    },
  ],
};

export function getTermsCopy(locale: Locale): TermsCopy {
  return locale === "es" ? es : en;
}
