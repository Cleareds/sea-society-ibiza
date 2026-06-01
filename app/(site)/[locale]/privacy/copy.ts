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
    "How Sea Society Ibiza (operated by Ibimar) collects, uses and protects your personal data — GDPR + Spanish LOPDGDD compliant.",
  heroEyebrow: "Legal",
  heroTitle: "Privacy Policy",
  effectiveDate: "Effective: 1 June 2026",
  intro: [
    "Sea Society Ibiza takes your privacy seriously. This Privacy Policy explains what personal data we collect when you use seasocietyibiza.com, why we collect it, how we use it, who we share it with, and the rights you have under the EU General Data Protection Regulation (GDPR — Regulation 2016/679) and Spain's organic data-protection law (LOPDGDD, Ley Orgánica 3/2018).",
    "By using our website, sending us an enquiry, or chartering through us you agree to the processing described below. If you do not agree, please do not use the site.",
  ],
  sections: [
    {
      heading: "1. Data controller",
      body: [
        "The data controller responsible for your personal data is Sea Society Ibiza, a trading name of Ibimar Charter S.L. (\"Sea Society\", \"we\", \"us\").",
        "Registered address: Botafoc Marina, 07800 Ibiza Town, Balearic Islands, Spain.",
        "Contact for data-protection matters: hello@seasocietyibiza.com.",
      ],
    },
    {
      heading: "2. Personal data we collect",
      body: [
        "We collect only the data we need to respond to your enquiry, operate a charter, and run the site.",
      ],
      bullets: [
        "Identification + contact data: name, email, phone number, country.",
        "Charter enquiry details: dates, group size, boat preference, special requests, message text.",
        "WhatsApp messages you send us when you click any Book here button.",
        "Booking + transactional data: invoice details, deposit + balance amounts, dates.",
        "Technical data: IP address (truncated for analytics), device + browser type, pages visited, referring URL.",
        "Cookie + consent data: which cookie categories you have allowed (necessary / analytics / marketing).",
        "Photos + video footage you share or that we capture on the day, if you have given separate written consent (see § 7).",
      ],
    },
    {
      heading: "3. Lawful bases (GDPR Article 6)",
      body: [
        "We process your data only on at least one of the following legal grounds:",
      ],
      bullets: [
        "Performance of a contract (Art. 6.1.b): processing necessary to quote, book, deliver and follow up on your charter.",
        "Legitimate interest (Art. 6.1.f): responding to enquiries that have not yet become a contract, internal record-keeping, fraud prevention, securing the site. Our legitimate interest is always balanced against your rights.",
        "Consent (Art. 6.1.a): analytics cookies, marketing cookies, optional photo + video usage in our marketing. You can withdraw consent at any time without affecting prior processing.",
        "Legal obligation (Art. 6.1.c): tax + accounting record retention (Spanish General Tax Law), maritime safety records, replying to lawful authority requests.",
      ],
    },
    {
      heading: "4. Third-party processors + international transfers",
      body: [
        "We share data only with the service providers we need to operate the platform. Each is bound by a data-processing agreement that meets GDPR requirements.",
      ],
      bullets: [
        "Supabase Inc. (USA / EU regions) — database hosting + authentication for the admin panel. EU data is stored in EU regions where possible.",
        "Vercel Inc. (USA) — hosting + edge serving of the website. EU-region edges serve EU traffic; transfers to the US are protected by the EU–US Data Privacy Framework + Standard Contractual Clauses (SCCs).",
        "Google LLC (USA) — Google Analytics 4 for anonymised site analytics. Only if you have accepted analytics in the cookie banner. IP is anonymised; SCCs in place.",
        "Meta Platforms Ireland Ltd. — Meta Pixel for ad measurement, only if you have accepted marketing cookies. Currently not active on the site.",
        "Resend Inc. (USA) — transactional email delivery for booking confirmations + replies.",
        "WhatsApp (Meta Platforms Ireland Ltd.) — only when you click a Book here button and choose to send us a message. The link opens WhatsApp; your message is governed by WhatsApp's own privacy policy.",
        "Ibimar Charter S.L. (Spain) — our operating partner; receives the data needed to deliver your charter (name, contact, dates, group size, special requests).",
      ],
    },
    {
      heading: "5. International transfers",
      body: [
        "Some of our processors are based in or transfer data to countries outside the European Economic Area (mainly the United States). For those transfers we rely on the European Commission's Standard Contractual Clauses (Decision 2021/914) and, where applicable, the EU–US Data Privacy Framework adequacy decision.",
        "You can request a copy of the safeguards in place by emailing hello@seasocietyibiza.com.",
      ],
    },
    {
      heading: "6. Retention periods",
      body: [
        "We keep your data only for as long as we need it:",
      ],
      bullets: [
        "Enquiries that do not become bookings: 12 months from last contact.",
        "Booking + charter records: 6 years from the end of the relevant tax year (Spanish accounting + tax law).",
        "Marketing consent + cookie preferences: 12 months, then re-prompted.",
        "Analytics events (GA4): default 14-month retention, then automatic deletion.",
        "Photo + video material with consent: until you withdraw consent, then deleted from active marketing within 30 days.",
      ],
    },
    {
      heading: "7. Photography + video on the day",
      body: [
        "If a Sea Society photographer or videographer is on board during your charter, you will be asked to sign a separate model-release form before any image of a recognisable person is used in our marketing. You may decline; declining will not affect the charter.",
        "Images of the boat, sea, food and equipment without identifiable people are not subject to model release.",
      ],
    },
    {
      heading: "8. Your rights under GDPR",
      body: [
        "You have the right to:",
      ],
      bullets: [
        "Access — request a copy of the personal data we hold about you.",
        "Rectification — correct inaccurate or incomplete data.",
        "Erasure (\"right to be forgotten\") — ask us to delete your data, subject to legal retention obligations.",
        "Restriction — ask us to pause processing while a dispute is being resolved.",
        "Portability — receive your data in a structured, machine-readable format.",
        "Objection — object to processing based on legitimate interest, including direct marketing.",
        "Withdraw consent — at any time, without affecting prior processing.",
        "Complain — lodge a complaint with the Spanish Data Protection Authority (Agencia Española de Protección de Datos, www.aepd.es) or the supervisory authority in your country of residence.",
      ],
    },
    {
      heading: "9. How to exercise your rights",
      body: [
        "Send an email to hello@seasocietyibiza.com from the address on file with us. We will respond within one month (extendable to three months for complex requests under GDPR Art. 12.3).",
        "We may ask for proof of identity before disclosing personal data.",
      ],
    },
    {
      heading: "10. Cookies",
      body: [
        "We use cookies that are strictly necessary for the site to function (session, authentication, consent storage) and, with your separate consent, optional cookies for analytics + marketing.",
        "You can change your cookie preferences at any time through the banner that appears on first visit and via the \"Preferences\" link in the footer. Withdrawing consent does not erase past analytics events; it stops new ones being collected.",
      ],
    },
    {
      heading: "11. Children",
      body: [
        "Spain has lowered the GDPR age of digital consent to 14 (LOPDGDD Art. 7). The site is intended for adult charter customers; we do not knowingly collect data from children under 14 without parental consent. If you believe we hold such data, contact us and we will delete it.",
      ],
    },
    {
      heading: "12. Security",
      body: [
        "We apply industry-standard organisational + technical measures to protect personal data: encryption in transit (TLS), encryption at rest in our database, role-based access for staff, regular backups, restricted admin access, audit logs.",
        "No system is 100% secure. In the event of a personal-data breach affecting your rights, we will notify the AEPD within 72 hours and, where likely to cause high risk, contact affected individuals directly (GDPR Art. 33–34).",
      ],
    },
    {
      heading: "13. Changes to this policy",
      body: [
        "We may update this Privacy Policy when our practices change or to reflect legal developments. The effective date at the top of this page changes when we do. Material changes are announced on the site for 30 days before they take effect.",
      ],
    },
    {
      heading: "14. Contact + complaints",
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
    "Cómo Sea Society Ibiza (operada por Ibimar) recopila, utiliza y protege tus datos personales — conforme al RGPD y la LOPDGDD.",
  heroEyebrow: "Legal",
  heroTitle: "Política de privacidad",
  effectiveDate: "En vigor desde el 1 de junio de 2026",
  intro: [
    "Sea Society Ibiza se toma tu privacidad en serio. Esta Política de Privacidad explica qué datos personales recopilamos cuando utilizas seasocietyibiza.com, por qué los recopilamos, cómo los usamos, con quién los compartimos y los derechos que tienes en virtud del Reglamento General de Protección de Datos de la UE (RGPD — Reglamento 2016/679) y de la Ley Orgánica de Protección de Datos y Garantía de los Derechos Digitales española (LOPDGDD, Ley Orgánica 3/2018).",
    "Al utilizar nuestro sitio web, enviarnos una consulta o contratar un charter, aceptas el tratamiento descrito a continuación. Si no estás de acuerdo, por favor no utilices el sitio.",
  ],
  sections: [
    {
      heading: "1. Responsable del tratamiento",
      body: [
        "El responsable del tratamiento de tus datos personales es Sea Society Ibiza, nombre comercial de Ibimar Charter S.L. (\"Sea Society\", \"nosotros\").",
        "Domicilio social: Marina Botafoc, 07800 Ibiza, Islas Baleares, España.",
        "Contacto para asuntos de protección de datos: hello@seasocietyibiza.com.",
      ],
    },
    {
      heading: "2. Datos personales que recopilamos",
      body: [
        "Recopilamos únicamente los datos que necesitamos para responder a tu consulta, operar un charter y mantener el sitio.",
      ],
      bullets: [
        "Datos de identificación y contacto: nombre, email, número de teléfono, país.",
        "Detalles de la consulta de charter: fechas, tamaño del grupo, barco preferido, peticiones especiales, mensaje.",
        "Mensajes de WhatsApp que nos envíes al pulsar cualquier botón Reservar aquí.",
        "Datos de reserva y transaccionales: datos de facturación, importes de depósito y saldo, fechas.",
        "Datos técnicos: dirección IP (truncada para analítica), tipo de dispositivo y navegador, páginas visitadas, URL de referencia.",
        "Datos de cookies y consentimiento: qué categorías de cookies has aceptado (necesarias / analítica / marketing).",
        "Fotografías y vídeos que compartas o que captemos durante la jornada, siempre que hayas otorgado consentimiento por escrito (ver § 7).",
      ],
    },
    {
      heading: "3. Bases legales (Artículo 6 RGPD)",
      body: [
        "Tratamos tus datos únicamente sobre la base de al menos uno de los siguientes fundamentos legales:",
      ],
      bullets: [
        "Ejecución de un contrato (Art. 6.1.b): tratamiento necesario para cotizar, reservar, prestar y dar seguimiento a tu charter.",
        "Interés legítimo (Art. 6.1.f): responder a consultas que aún no se han convertido en contrato, registro interno, prevención del fraude, seguridad del sitio. Nuestro interés legítimo se pondera siempre frente a tus derechos.",
        "Consentimiento (Art. 6.1.a): cookies de analítica, cookies de marketing, uso opcional de foto y vídeo en nuestro marketing. Puedes retirar el consentimiento en cualquier momento sin afectar al tratamiento previo.",
        "Obligación legal (Art. 6.1.c): conservación de registros contables y fiscales (Ley General Tributaria), registros de seguridad marítima, respuesta a requerimientos legales de autoridades competentes.",
      ],
    },
    {
      heading: "4. Encargados del tratamiento (terceros)",
      body: [
        "Sólo compartimos datos con los proveedores de servicios que necesitamos para operar la plataforma. Cada uno está sujeto a un contrato de encargado del tratamiento conforme al RGPD.",
      ],
      bullets: [
        "Supabase Inc. (EE. UU. / regiones de la UE) — alojamiento de la base de datos y autenticación del panel de administración. Los datos de la UE se almacenan en regiones europeas siempre que sea posible.",
        "Vercel Inc. (EE. UU.) — hosting y servido en el edge del sitio web. Los nodos europeos sirven el tráfico europeo; las transferencias a EE. UU. están protegidas por el EU–US Data Privacy Framework y por las Cláusulas Contractuales Tipo (CCT).",
        "Google LLC (EE. UU.) — Google Analytics 4 para analítica anonimizada del sitio. Sólo si has aceptado analítica en el banner de cookies. La IP se anonimiza; CCT en vigor.",
        "Meta Platforms Ireland Ltd. — Meta Pixel para medición publicitaria, sólo si has aceptado cookies de marketing. Actualmente no activo en el sitio.",
        "Resend Inc. (EE. UU.) — envío de correos electrónicos transaccionales para confirmaciones de reserva y respuestas.",
        "WhatsApp (Meta Platforms Ireland Ltd.) — sólo cuando pulsas un botón Reservar aquí y eliges enviarnos un mensaje. El enlace abre WhatsApp; tu mensaje se rige por la política de privacidad de WhatsApp.",
        "Ibimar Charter S.L. (España) — nuestro socio operativo; recibe los datos necesarios para prestar tu charter (nombre, contacto, fechas, tamaño del grupo, peticiones especiales).",
      ],
    },
    {
      heading: "5. Transferencias internacionales",
      body: [
        "Algunos de nuestros encargados están basados o realizan transferencias a países fuera del Espacio Económico Europeo (principalmente Estados Unidos). Para esas transferencias nos basamos en las Cláusulas Contractuales Tipo de la Comisión Europea (Decisión 2021/914) y, cuando es aplicable, en la decisión de adecuación del EU–US Data Privacy Framework.",
        "Puedes solicitar una copia de las salvaguardas en vigor escribiendo a hello@seasocietyibiza.com.",
      ],
    },
    {
      heading: "6. Plazos de conservación",
      body: [
        "Conservamos tus datos sólo durante el tiempo necesario:",
      ],
      bullets: [
        "Consultas que no se convierten en reserva: 12 meses desde el último contacto.",
        "Registros de reserva y charter: 6 años desde el cierre del ejercicio fiscal correspondiente (Ley General Tributaria).",
        "Consentimiento de marketing y preferencias de cookies: 12 meses, después se solicita de nuevo.",
        "Eventos de analítica (GA4): retención por defecto de 14 meses, después se eliminan automáticamente.",
        "Material fotográfico/vídeo con consentimiento: hasta que retires el consentimiento; tras la retirada, se elimina del marketing activo en un plazo de 30 días.",
      ],
    },
    {
      heading: "7. Fotografía y vídeo durante el charter",
      body: [
        "Si un fotógrafo o videógrafo de Sea Society está a bordo durante tu charter, te pediremos que firmes un formulario de cesión de imagen independiente antes de utilizar cualquier imagen de una persona reconocible en nuestro marketing. Puedes negarte; no afectará al charter.",
        "Las imágenes del barco, el mar, la gastronomía o el material sin personas identificables no requieren cesión de imagen.",
      ],
    },
    {
      heading: "8. Tus derechos bajo el RGPD",
      body: [
        "Tienes derecho a:",
      ],
      bullets: [
        "Acceso — solicitar una copia de los datos personales que conservamos sobre ti.",
        "Rectificación — corregir datos inexactos o incompletos.",
        "Supresión (\"derecho al olvido\") — pedirnos que eliminemos tus datos, sujeto a obligaciones legales de conservación.",
        "Limitación — pedirnos que pausemos el tratamiento mientras se resuelve una discrepancia.",
        "Portabilidad — recibir tus datos en un formato estructurado y legible por máquina.",
        "Oposición — oponerte al tratamiento basado en interés legítimo, incluida la mercadotecnia directa.",
        "Retirar el consentimiento — en cualquier momento, sin afectar al tratamiento previo.",
        "Reclamar — presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) o ante la autoridad de control de tu país de residencia.",
      ],
    },
    {
      heading: "9. Cómo ejercer tus derechos",
      body: [
        "Envía un email a hello@seasocietyibiza.com desde la dirección registrada con nosotros. Responderemos en el plazo de un mes (ampliable a tres meses para solicitudes complejas conforme al Art. 12.3 RGPD).",
        "Podemos pedirte una prueba de identidad antes de revelar datos personales.",
      ],
    },
    {
      heading: "10. Cookies",
      body: [
        "Utilizamos cookies estrictamente necesarias para que el sitio funcione (sesión, autenticación, almacenamiento de consentimiento) y, con tu consentimiento separado, cookies opcionales de analítica y marketing.",
        "Puedes cambiar tus preferencias de cookies en cualquier momento mediante el banner que aparece en la primera visita y a través del enlace \"Preferencias\" en el pie de página. La retirada del consentimiento no borra los eventos pasados de analítica; sólo impide la recopilación de nuevos.",
      ],
    },
    {
      heading: "11. Menores",
      body: [
        "España ha rebajado la edad de consentimiento digital del RGPD a 14 años (Art. 7 LOPDGDD). El sitio está dirigido a clientes adultos de charter; no recopilamos datos a sabiendas de menores de 14 años sin consentimiento parental. Si crees que tenemos datos así, contáctanos y los eliminaremos.",
      ],
    },
    {
      heading: "12. Seguridad",
      body: [
        "Aplicamos medidas organizativas y técnicas estándar para proteger los datos personales: cifrado en tránsito (TLS), cifrado en reposo en la base de datos, control de acceso por roles para el personal, copias de seguridad periódicas, acceso de administrador restringido, logs de auditoría.",
        "Ningún sistema es 100% seguro. En caso de una violación de datos personales que afecte a tus derechos, notificaremos a la AEPD en un plazo de 72 horas y, cuando exista alto riesgo, contactaremos directamente con las personas afectadas (Art. 33–34 RGPD).",
      ],
    },
    {
      heading: "13. Cambios en esta política",
      body: [
        "Podemos actualizar esta Política de Privacidad cuando cambien nuestras prácticas o para reflejar novedades legales. La fecha de entrada en vigor al inicio de esta página cambia cuando lo hacemos. Los cambios materiales se anuncian en el sitio durante 30 días antes de que entren en vigor.",
      ],
    },
    {
      heading: "14. Contacto y reclamaciones",
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
