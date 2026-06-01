import type { Locale } from "@/lib/i18n/config";

export interface PrivacySection {
  heading: string;
  body: string[];
  bullets?: string[];
}

export interface PrivacyCopy {
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  effectiveDate: string;
  intro: string[];
  sections: PrivacySection[];
}

const en: PrivacyCopy = {
  metaTitle: "Privacy Policy — Sea Society Ibiza",
  metaDescription:
    "How Sea Society Ibiza (operated by Ibimar) collects, uses and protects personal data on seasocietyibiza.com. GDPR + Spanish LOPDGDD compliant.",
  heroEyebrow: "Legal",
  heroTitle: "Privacy Policy",
  effectiveDate: "Effective: 1 June 2026",
  intro: [
    "Sea Society Ibiza takes your privacy seriously. This Privacy Policy explains what personal data we collect when you use seasocietyibiza.com — a marketing website showcasing our fleet and services — why we collect it, how we use it, who we share it with, and the rights you have under the EU General Data Protection Regulation (GDPR — Regulation 2016/679) and Spain's organic data-protection law (LOPDGDD, Ley Orgánica 3/2018).",
    "No bookings or payments take place on this website. If you decide to charter with us, that contract is handled separately, under its own terms.",
  ],
  sections: [
    {
      heading: "1. Data controller",
      body: [
        "The data controller for personal data processed through this website is Sea Society Ibiza, a trading name of Ibimar Charter S.L. (\"Sea Society\", \"we\", \"us\").",
        "Registered address: Botafoc Marina, 07800 Ibiza Town, Balearic Islands, Spain.",
        "Contact for data-protection matters: hello@seasocietyibiza.com.",
      ],
    },
    {
      heading: "2. Personal data we collect",
      body: [
        "We collect only the data we need to respond to enquiries and operate the website.",
      ],
      bullets: [
        "Enquiry form: name, email, optional phone, and any information you choose to include in the message field.",
        "WhatsApp interactions: when you click any Book here button you are taken to WhatsApp and may choose to send us a message. We process the contents of that message.",
        "Technical data: IP address (truncated for analytics), device + browser type, pages visited, referring URL.",
        "Cookie + consent data: which cookie categories you have allowed (necessary / analytics / marketing).",
      ],
    },
    {
      heading: "3. Lawful bases (GDPR Article 6)",
      body: [
        "We process your data only on at least one of the following legal grounds:",
      ],
      bullets: [
        "Legitimate interest (Art. 6.1.f): replying to enquiries, qualifying leads, securing the site against abuse, internal record-keeping. Our legitimate interest is always balanced against your rights.",
        "Consent (Art. 6.1.a): analytics cookies and any marketing cookies. You can withdraw consent at any time without affecting prior processing.",
        "Legal obligation (Art. 6.1.c): retention required by applicable law, responding to lawful authority requests.",
      ],
    },
    {
      heading: "4. Third-party processors",
      body: [
        "We share data only with the service providers we need to operate this website. Each is bound by a data-processing agreement that meets GDPR requirements.",
      ],
      bullets: [
        "Supabase Inc. — database hosting + admin authentication. EU regions used where possible.",
        "Vercel Inc. — hosting + edge serving. EU-region edges serve EU traffic.",
        "Google LLC — Google Analytics 4 for anonymised site analytics, only with your consent.",
        "Meta Platforms Ireland Ltd. — marketing pixels if enabled, only with your consent.",
        "Resend Inc. — transactional email delivery for replies to enquiries.",
        "WhatsApp (Meta Platforms Ireland Ltd.) — only when you click a Book here button and choose to send a message. The message is governed by WhatsApp's own privacy policy.",
        "Ibimar Charter S.L. — our operating partner; receives enquiry data so we can follow up on a charter request.",
      ],
    },
    {
      heading: "5. International transfers",
      body: [
        "Some of our processors are based in or transfer data to countries outside the European Economic Area. For those transfers we rely on the European Commission's Standard Contractual Clauses and, where applicable, recognised adequacy mechanisms such as the EU–US Data Privacy Framework.",
        "You can request a copy of the safeguards in place by emailing hello@seasocietyibiza.com.",
      ],
    },
    {
      heading: "6. Retention",
      body: [
        "We keep your personal data only for as long as is necessary to fulfil the purpose for which it was collected and to comply with applicable legal obligations. After that, the data is deleted or anonymised.",
        "If you would like specific retention information for a category of data we hold about you, please contact us.",
      ],
    },
    {
      heading: "7. Your rights under GDPR",
      body: [
        "You have the right to:",
      ],
      bullets: [
        "Access — request a copy of the personal data we hold about you.",
        "Rectification — correct inaccurate or incomplete data.",
        "Erasure — ask us to delete your data, subject to legal retention obligations.",
        "Restriction — ask us to pause processing while a dispute is being resolved.",
        "Portability — receive your data in a structured, machine-readable format.",
        "Objection — object to processing based on legitimate interest, including direct marketing.",
        "Withdraw consent — at any time, without affecting prior processing.",
        "Complain — lodge a complaint with the Spanish Data Protection Authority (Agencia Española de Protección de Datos, www.aepd.es) or the supervisory authority in your country of residence.",
      ],
    },
    {
      heading: "8. How to exercise your rights",
      body: [
        "Send an email to hello@seasocietyibiza.com from the address on file with us. We will respond within the period required by GDPR (Art. 12.3).",
        "We may ask for proof of identity before disclosing personal data.",
      ],
    },
    {
      heading: "9. Cookies",
      body: [
        "We use cookies that are strictly necessary for the site to function (session, authentication, consent storage) and, with your separate consent, optional cookies for analytics + marketing.",
        "You can change your cookie preferences at any time through the banner that appears on first visit and via the \"Preferences\" link in the footer. Withdrawing consent does not erase past events; it stops new ones being collected.",
      ],
    },
    {
      heading: "10. Children",
      body: [
        "This site is intended for adults. We do not knowingly collect personal data from children below the age of digital consent set by Spanish law (LOPDGDD Art. 7). If you believe we hold such data, contact us and we will delete it.",
      ],
    },
    {
      heading: "11. Security",
      body: [
        "We apply industry-standard organisational and technical measures to protect personal data: encryption in transit (TLS), encryption at rest, role-based admin access, restricted credentials and audit logs.",
        "No system is fully secure. In the event of a personal-data breach that affects your rights, we will notify the AEPD and, where required, the individuals affected, in accordance with GDPR Articles 33–34.",
      ],
    },
    {
      heading: "12. Changes to this policy",
      body: [
        "We may update this Privacy Policy when our practices change or to reflect legal developments. The effective date at the top of this page changes when we do. Material changes are announced on the site for a reasonable period before they take effect.",
      ],
    },
    {
      heading: "13. Contact + complaints",
      body: [
        "For any data-protection question or to exercise a right: hello@seasocietyibiza.com.",
        "To complain to the supervisory authority directly: Agencia Española de Protección de Datos, C/ Jorge Juan 6, 28001 Madrid — www.aepd.es.",
      ],
    },
  ],
};

const es: PrivacyCopy = {
  metaTitle: "Política de privacidad — Sea Society Ibiza",
  metaDescription:
    "Cómo Sea Society Ibiza (operada por Ibimar) recopila, utiliza y protege los datos personales en seasocietyibiza.com. Conforme al RGPD y la LOPDGDD.",
  heroEyebrow: "Legal",
  heroTitle: "Política de privacidad",
  effectiveDate: "En vigor desde el 1 de junio de 2026",
  intro: [
    "Sea Society Ibiza se toma tu privacidad en serio. Esta Política de Privacidad explica qué datos personales recopilamos cuando utilizas seasocietyibiza.com — un sitio de marketing que presenta nuestra flota y nuestros servicios —, por qué los recopilamos, cómo los usamos, con quién los compartimos y los derechos que tienes en virtud del Reglamento General de Protección de Datos de la UE (RGPD — Reglamento 2016/679) y de la Ley Orgánica de Protección de Datos y Garantía de los Derechos Digitales española (LOPDGDD, Ley Orgánica 3/2018).",
    "En este sitio web no se realizan reservas ni pagos. Si decides contratar un charter con nosotros, ese contrato se gestiona por separado, bajo sus propios términos.",
  ],
  sections: [
    {
      heading: "1. Responsable del tratamiento",
      body: [
        "El responsable del tratamiento de los datos personales recopilados a través de este sitio es Sea Society Ibiza, nombre comercial de Ibimar Charter S.L. (\"Sea Society\", \"nosotros\").",
        "Domicilio social: Marina Botafoc, 07800 Ibiza, Islas Baleares, España.",
        "Contacto para asuntos de protección de datos: hello@seasocietyibiza.com.",
      ],
    },
    {
      heading: "2. Datos personales que recopilamos",
      body: [
        "Recopilamos únicamente los datos que necesitamos para responder a las consultas y operar el sitio.",
      ],
      bullets: [
        "Formulario de consulta: nombre, email, teléfono opcional y cualquier información que decidas incluir en el mensaje.",
        "Interacciones por WhatsApp: al pulsar cualquier botón Reservar aquí se abre WhatsApp y puedes elegir enviarnos un mensaje. Tratamos el contenido de ese mensaje.",
        "Datos técnicos: dirección IP (truncada para analítica), tipo de dispositivo y navegador, páginas visitadas, URL de referencia.",
        "Datos de cookies y consentimiento: qué categorías de cookies has aceptado (necesarias / analítica / marketing).",
      ],
    },
    {
      heading: "3. Bases legales (Artículo 6 RGPD)",
      body: [
        "Tratamos tus datos únicamente sobre la base de al menos uno de los siguientes fundamentos legales:",
      ],
      bullets: [
        "Interés legítimo (Art. 6.1.f): responder a consultas, cualificar leads, asegurar el sitio frente a abusos, registro interno. Nuestro interés legítimo se pondera siempre frente a tus derechos.",
        "Consentimiento (Art. 6.1.a): cookies de analítica y, en su caso, cookies de marketing. Puedes retirar el consentimiento en cualquier momento sin afectar al tratamiento previo.",
        "Obligación legal (Art. 6.1.c): conservación exigida por la legislación aplicable, respuesta a requerimientos legales de autoridades competentes.",
      ],
    },
    {
      heading: "4. Encargados del tratamiento",
      body: [
        "Sólo compartimos datos con los proveedores de servicios que necesitamos para operar este sitio. Cada uno está sujeto a un contrato de encargado del tratamiento conforme al RGPD.",
      ],
      bullets: [
        "Supabase Inc. — alojamiento de la base de datos y autenticación del panel de administración. Regiones europeas siempre que sea posible.",
        "Vercel Inc. — hosting y servido en el edge. Los nodos europeos sirven el tráfico europeo.",
        "Google LLC — Google Analytics 4 para analítica anonimizada, sólo con tu consentimiento.",
        "Meta Platforms Ireland Ltd. — píxeles de marketing si están activados, sólo con tu consentimiento.",
        "Resend Inc. — envío de correos electrónicos transaccionales para respuestas a consultas.",
        "WhatsApp (Meta Platforms Ireland Ltd.) — sólo cuando pulsas un botón Reservar aquí y eliges enviar un mensaje. El mensaje se rige por la política de privacidad de WhatsApp.",
        "Ibimar Charter S.L. — nuestro socio operativo; recibe los datos de la consulta para dar seguimiento a una solicitud de charter.",
      ],
    },
    {
      heading: "5. Transferencias internacionales",
      body: [
        "Algunos de nuestros encargados están basados o realizan transferencias a países fuera del Espacio Económico Europeo. Para esas transferencias nos basamos en las Cláusulas Contractuales Tipo de la Comisión Europea y, cuando es aplicable, en mecanismos reconocidos de adecuación como el EU–US Data Privacy Framework.",
        "Puedes solicitar una copia de las salvaguardas en vigor escribiendo a hello@seasocietyibiza.com.",
      ],
    },
    {
      heading: "6. Conservación",
      body: [
        "Conservamos tus datos personales únicamente durante el tiempo necesario para cumplir con la finalidad para la que fueron recopilados y para cumplir con las obligaciones legales aplicables. Después se eliminan o anonimizan.",
        "Si deseas información concreta sobre el periodo de conservación de alguna categoría de datos, por favor contáctanos.",
      ],
    },
    {
      heading: "7. Tus derechos bajo el RGPD",
      body: [
        "Tienes derecho a:",
      ],
      bullets: [
        "Acceso — solicitar una copia de los datos personales que conservamos sobre ti.",
        "Rectificación — corregir datos inexactos o incompletos.",
        "Supresión — pedirnos que eliminemos tus datos, sujeto a obligaciones legales de conservación.",
        "Limitación — pedirnos que pausemos el tratamiento mientras se resuelve una discrepancia.",
        "Portabilidad — recibir tus datos en un formato estructurado y legible por máquina.",
        "Oposición — oponerte al tratamiento basado en interés legítimo, incluida la mercadotecnia directa.",
        "Retirar el consentimiento — en cualquier momento, sin afectar al tratamiento previo.",
        "Reclamar — presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) o ante la autoridad de control de tu país de residencia.",
      ],
    },
    {
      heading: "8. Cómo ejercer tus derechos",
      body: [
        "Envía un email a hello@seasocietyibiza.com desde la dirección registrada con nosotros. Responderemos en el plazo exigido por el RGPD (Art. 12.3).",
        "Podemos pedirte una prueba de identidad antes de revelar datos personales.",
      ],
    },
    {
      heading: "9. Cookies",
      body: [
        "Utilizamos cookies estrictamente necesarias para que el sitio funcione (sesión, autenticación, almacenamiento de consentimiento) y, con tu consentimiento separado, cookies opcionales de analítica y marketing.",
        "Puedes cambiar tus preferencias de cookies en cualquier momento mediante el banner que aparece en la primera visita y a través del enlace \"Preferencias\" en el pie de página. La retirada del consentimiento no borra los eventos pasados; sólo impide la recopilación de nuevos.",
      ],
    },
    {
      heading: "10. Menores",
      body: [
        "Este sitio está dirigido a adultos. No recopilamos datos personales a sabiendas de menores por debajo de la edad de consentimiento digital fijada por la legislación española (Art. 7 LOPDGDD). Si crees que tenemos datos así, contáctanos y los eliminaremos.",
      ],
    },
    {
      heading: "11. Seguridad",
      body: [
        "Aplicamos medidas organizativas y técnicas estándar para proteger los datos personales: cifrado en tránsito (TLS), cifrado en reposo, control de acceso por roles, credenciales restringidas y logs de auditoría.",
        "Ningún sistema es completamente seguro. En caso de una violación de datos personales que afecte a tus derechos, notificaremos a la AEPD y, cuando proceda, a las personas afectadas, conforme a los Arts. 33–34 RGPD.",
      ],
    },
    {
      heading: "12. Cambios en esta política",
      body: [
        "Podemos actualizar esta Política de Privacidad cuando cambien nuestras prácticas o para reflejar novedades legales. La fecha de entrada en vigor al inicio de esta página cambia cuando lo hacemos. Los cambios materiales se anuncian en el sitio durante un periodo razonable antes de que entren en vigor.",
      ],
    },
    {
      heading: "13. Contacto y reclamaciones",
      body: [
        "Para cualquier consulta sobre protección de datos o para ejercer un derecho: hello@seasocietyibiza.com.",
        "Para reclamar directamente ante la autoridad de control: Agencia Española de Protección de Datos, C/ Jorge Juan 6, 28001 Madrid — www.aepd.es.",
      ],
    },
  ],
};

export function getPrivacyCopy(locale: Locale): PrivacyCopy {
  return locale === "es" ? es : en;
}
