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

const fr: PrivacyCopy = {
  metaTitle: "Politique de confidentialité — Sea Society Ibiza",
  metaDescription:
    "Comment Sea Society Ibiza (opérée par Ibimar) collecte, utilise et protège les données personnelles sur seasocietyibiza.com. Conforme au RGPD et à la LOPDGDD espagnole.",
  heroEyebrow: "Mentions légales",
  heroTitle: "Politique de confidentialité",
  effectiveDate: "En vigueur depuis le 1er juin 2026",
  intro: [
    "Sea Society Ibiza prend votre vie privée au sérieux. La présente Politique de confidentialité explique quelles données personnelles nous collectons lorsque vous utilisez seasocietyibiza.com — un site marketing présentant notre flotte et nos services —, pourquoi nous les collectons, comment nous les utilisons, avec qui nous les partageons, et les droits dont vous disposez au titre du Règlement général sur la protection des données de l'UE (RGPD — Règlement 2016/679) et de la loi organique espagnole sur la protection des données (LOPDGDD, Loi organique 3/2018).",
    "Aucune réservation ni paiement ne sont effectués sur ce site. Si vous décidez d'affréter un bateau avec nous, ce contrat est géré séparément, selon ses propres conditions.",
  ],
  sections: [
    {
      heading: "1. Responsable du traitement",
      body: [
        "Le responsable du traitement des données personnelles collectées via ce site est Sea Society Ibiza, nom commercial d'Ibimar Charter S.L. (« Sea Society », « nous »).",
        "Adresse enregistrée : Marina Botafoc, 07800 Ibiza-Ville, Îles Baléares, Espagne.",
        "Contact pour les questions de protection des données : hello@seasocietyibiza.com.",
      ],
    },
    {
      heading: "2. Données personnelles que nous collectons",
      body: [
        "Nous collectons uniquement les données nécessaires pour répondre aux demandes et faire fonctionner le site.",
      ],
      bullets: [
        "Formulaire de demande : nom, email, téléphone facultatif, et toute information que vous choisissez d'inclure dans le champ message.",
        "Interactions WhatsApp : lorsque vous cliquez sur un bouton Réserver ici, vous êtes redirigé vers WhatsApp et pouvez choisir de nous envoyer un message. Nous traitons le contenu de ce message.",
        "Données techniques : adresse IP (tronquée pour l'analytique), type d'appareil et navigateur, pages consultées, URL de provenance.",
        "Données de cookies et de consentement : les catégories de cookies que vous avez autorisées (nécessaires / statistiques / marketing).",
      ],
    },
    {
      heading: "3. Bases légales (Article 6 RGPD)",
      body: [
        "Nous traitons vos données uniquement sur la base d'au moins l'un des fondements juridiques suivants :",
      ],
      bullets: [
        "Intérêt légitime (Art. 6.1.f) : répondre aux demandes, qualifier les prospects, sécuriser le site contre les abus, tenue de registres internes. Notre intérêt légitime est toujours pondéré par rapport à vos droits.",
        "Consentement (Art. 6.1.a) : cookies statistiques et, le cas échéant, cookies marketing. Vous pouvez retirer votre consentement à tout moment, sans incidence sur le traitement antérieur.",
        "Obligation légale (Art. 6.1.c) : conservation imposée par la loi applicable, réponse aux demandes légitimes des autorités.",
      ],
    },
    {
      heading: "4. Sous-traitants tiers",
      body: [
        "Nous ne partageons les données qu'avec les prestataires nécessaires au fonctionnement de ce site. Chacun est lié par un accord de sous-traitance conforme au RGPD.",
      ],
      bullets: [
        "Supabase Inc. — hébergement de la base de données et authentification de l'administration. Régions UE privilégiées.",
        "Vercel Inc. — hébergement et diffusion en edge. Les nœuds UE servent le trafic UE.",
        "Google LLC — Google Analytics 4 pour des statistiques anonymisées, uniquement avec votre consentement.",
        "Meta Platforms Ireland Ltd. — pixels marketing si activés, uniquement avec votre consentement.",
        "Resend Inc. — envoi d'emails transactionnels en réponse aux demandes.",
        "WhatsApp (Meta Platforms Ireland Ltd.) — uniquement lorsque vous cliquez sur un bouton Réserver ici et choisissez d'envoyer un message. Le message est régi par la politique de confidentialité de WhatsApp.",
        "Ibimar Charter S.L. — notre partenaire opérationnel ; reçoit les données de la demande pour donner suite à une demande de charter.",
      ],
    },
    {
      heading: "5. Transferts internationaux",
      body: [
        "Certains de nos sous-traitants sont établis hors de l'Espace économique européen ou y transfèrent des données. Pour ces transferts, nous nous appuyons sur les clauses contractuelles types de la Commission européenne et, le cas échéant, sur des mécanismes d'adéquation reconnus tels que le EU–US Data Privacy Framework.",
        "Vous pouvez demander une copie des garanties mises en place en écrivant à hello@seasocietyibiza.com.",
      ],
    },
    {
      heading: "6. Conservation",
      body: [
        "Nous conservons vos données personnelles uniquement pendant la durée nécessaire à la finalité pour laquelle elles ont été collectées et au respect des obligations légales applicables. Au-delà, les données sont supprimées ou anonymisées.",
        "Pour des informations spécifiques sur la durée de conservation d'une catégorie de données vous concernant, veuillez nous contacter.",
      ],
    },
    {
      heading: "7. Vos droits au titre du RGPD",
      body: [
        "Vous avez le droit de :",
      ],
      bullets: [
        "Accès — demander une copie des données personnelles que nous détenons à votre sujet.",
        "Rectification — corriger des données inexactes ou incomplètes.",
        "Effacement — nous demander de supprimer vos données, sous réserve des obligations légales de conservation.",
        "Limitation — nous demander de suspendre le traitement pendant la résolution d'un litige.",
        "Portabilité — recevoir vos données dans un format structuré et lisible par machine.",
        "Opposition — vous opposer au traitement fondé sur l'intérêt légitime, y compris la prospection directe.",
        "Retrait du consentement — à tout moment, sans incidence sur le traitement antérieur.",
        "Plainte — introduire une réclamation auprès de l'autorité espagnole de protection des données (Agencia Española de Protección de Datos, www.aepd.es) ou de l'autorité de votre pays de résidence.",
      ],
    },
    {
      heading: "8. Comment exercer vos droits",
      body: [
        "Envoyez un email à hello@seasocietyibiza.com depuis l'adresse enregistrée chez nous. Nous répondrons dans le délai prévu par le RGPD (Art. 12.3).",
        "Nous pouvons demander une preuve d'identité avant de divulguer des données personnelles.",
      ],
    },
    {
      heading: "9. Cookies",
      body: [
        "Nous utilisons des cookies strictement nécessaires au fonctionnement du site (session, authentification, stockage du consentement) et, avec votre consentement séparé, des cookies optionnels de statistiques et de marketing.",
        "Vous pouvez modifier vos préférences de cookies à tout moment via la bannière qui apparaît lors de la première visite et via le lien « Préférences » dans le pied de page. Le retrait du consentement n'efface pas les événements passés ; il empêche la collecte de nouveaux.",
      ],
    },
    {
      heading: "10. Mineurs",
      body: [
        "Ce site s'adresse aux adultes. Nous ne collectons pas sciemment de données personnelles concernant des mineurs en dessous de l'âge de consentement numérique fixé par la loi espagnole (Art. 7 LOPDGDD). Si vous pensez que nous détenons de telles données, contactez-nous et nous les supprimerons.",
      ],
    },
    {
      heading: "11. Sécurité",
      body: [
        "Nous appliquons des mesures organisationnelles et techniques conformes aux standards de l'industrie pour protéger les données personnelles : chiffrement en transit (TLS), chiffrement au repos, accès administrateur basé sur les rôles, identifiants restreints et journaux d'audit.",
        "Aucun système n'est totalement sécurisé. En cas de violation de données personnelles affectant vos droits, nous notifierons l'AEPD et, le cas échéant, les personnes concernées, conformément aux articles 33–34 RGPD.",
      ],
    },
    {
      heading: "12. Modifications de cette politique",
      body: [
        "Nous pouvons mettre à jour la présente politique en cas d'évolution de nos pratiques ou pour refléter des évolutions légales. La date d'entrée en vigueur en haut de cette page change lorsque nous le faisons. Les modifications importantes sont annoncées sur le site pendant une période raisonnable avant leur prise d'effet.",
      ],
    },
    {
      heading: "13. Contact et réclamations",
      body: [
        "Pour toute question relative à la protection des données ou pour exercer un droit : hello@seasocietyibiza.com.",
        "Pour saisir directement l'autorité de contrôle : Agencia Española de Protección de Datos, C/ Jorge Juan 6, 28001 Madrid — www.aepd.es.",
      ],
    },
  ],
};

const nl: PrivacyCopy = {
  metaTitle: "Privacybeleid — Sea Society Ibiza",
  metaDescription:
    "Hoe Sea Society Ibiza (uitgebaat door Ibimar) persoonsgegevens verzamelt, gebruikt en beschermt op seasocietyibiza.com. AVG- en Spaanse LOPDGDD-compliant.",
  heroEyebrow: "Juridisch",
  heroTitle: "Privacybeleid",
  effectiveDate: "Van kracht sinds 1 juni 2026",
  intro: [
    "Sea Society Ibiza neemt uw privacy ernstig. Dit Privacybeleid legt uit welke persoonsgegevens we verzamelen wanneer u seasocietyibiza.com gebruikt — een marketingwebsite die onze vloot en diensten toont —, waarom we ze verzamelen, hoe we ze gebruiken, met wie we ze delen, en welke rechten u hebt op grond van de Algemene Verordening Gegevensbescherming van de EU (AVG/GDPR — Verordening 2016/679) en de Spaanse organieke wet op de gegevensbescherming (LOPDGDD, Wet 3/2018).",
    "Op deze website worden geen boekingen of betalingen verricht. Als u beslist een charter bij ons te boeken, wordt dat contract apart afgehandeld onder zijn eigen voorwaarden.",
  ],
  sections: [
    {
      heading: "1. Verwerkingsverantwoordelijke",
      body: [
        "De verwerkingsverantwoordelijke voor de persoonsgegevens die via deze website worden verwerkt is Sea Society Ibiza, handelsnaam van Ibimar Charter S.L. (\"Sea Society\", \"wij\").",
        "Geregistreerd adres: Marina Botafoc, 07800 Ibiza-Stad, Balearen, Spanje.",
        "Contact voor gegevensbescherming: hello@seasocietyibiza.com.",
      ],
    },
    {
      heading: "2. Persoonsgegevens die we verzamelen",
      body: [
        "We verzamelen enkel de gegevens die we nodig hebben om vragen te beantwoorden en de website te laten werken.",
      ],
      bullets: [
        "Aanvraagformulier: naam, e-mail, optioneel telefoonnummer en alle informatie die u in het berichtveld opneemt.",
        "WhatsApp-interacties: wanneer u op een Boek hier-knop klikt wordt u naar WhatsApp geleid en kunt u kiezen om ons een bericht te sturen. We verwerken de inhoud van dat bericht.",
        "Technische gegevens: IP-adres (afgekapt voor analytics), type apparaat en browser, bezochte pagina's, verwijzende URL.",
        "Cookie- en toestemmingsgegevens: welke cookiecategorieën u hebt toegestaan (noodzakelijk / analytics / marketing).",
      ],
    },
    {
      heading: "3. Rechtsgronden (Artikel 6 AVG)",
      body: [
        "We verwerken uw gegevens uitsluitend op basis van ten minste één van de volgende rechtsgronden:",
      ],
      bullets: [
        "Gerechtvaardigd belang (Art. 6.1.f): vragen beantwoorden, leads kwalificeren, de site beveiligen tegen misbruik, interne registratie. Ons gerechtvaardigd belang wordt steeds afgewogen tegen uw rechten.",
        "Toestemming (Art. 6.1.a): analytics-cookies en eventuele marketingcookies. U kunt uw toestemming op elk moment intrekken zonder dat dit de eerder verrichte verwerking aantast.",
        "Wettelijke verplichting (Art. 6.1.c): bewaring die door toepasselijke wetgeving wordt vereist, beantwoording van rechtmatige verzoeken van autoriteiten.",
      ],
    },
    {
      heading: "4. Externe verwerkers",
      body: [
        "We delen gegevens enkel met de dienstverleners die we nodig hebben om deze website te laten werken. Elk is gebonden door een verwerkersovereenkomst die voldoet aan de AVG.",
      ],
      bullets: [
        "Supabase Inc. — databasehosting en admin-authenticatie. EU-regio's worden gebruikt waar mogelijk.",
        "Vercel Inc. — hosting en edge-serving. EU-edges bedienen EU-verkeer.",
        "Google LLC — Google Analytics 4 voor geanonimiseerde site-statistieken, alleen met uw toestemming.",
        "Meta Platforms Ireland Ltd. — marketingpixels indien geactiveerd, alleen met uw toestemming.",
        "Resend Inc. — transactionele e-mailverzending voor antwoorden op aanvragen.",
        "WhatsApp (Meta Platforms Ireland Ltd.) — enkel wanneer u op een Boek hier-knop klikt en kiest om een bericht te sturen. Het bericht valt onder het privacybeleid van WhatsApp zelf.",
        "Ibimar Charter S.L. — onze operationele partner; ontvangt aanvraaggegevens om een charteraanvraag op te volgen.",
      ],
    },
    {
      heading: "5. Internationale doorgiften",
      body: [
        "Een aantal van onze verwerkers is gevestigd in landen buiten de Europese Economische Ruimte of geeft gegevens daarheen door. Voor die doorgiften baseren we ons op de modelcontractbepalingen van de Europese Commissie en, waar van toepassing, op erkende adequaatheidsmechanismen zoals het EU–US Data Privacy Framework.",
        "U kunt een kopie van de geldende waarborgen opvragen via hello@seasocietyibiza.com.",
      ],
    },
    {
      heading: "6. Bewaring",
      body: [
        "We bewaren uw persoonsgegevens enkel zolang dat nodig is voor het doel waarvoor ze werden verzameld en om aan de toepasselijke wettelijke verplichtingen te voldoen. Daarna worden de gegevens verwijderd of geanonimiseerd.",
        "Wenst u specifieke bewaartermijnen voor een categorie van gegevens die wij over u bewaren, neem dan contact met ons op.",
      ],
    },
    {
      heading: "7. Uw rechten onder de AVG",
      body: [
        "U hebt het recht op:",
      ],
      bullets: [
        "Toegang — een kopie opvragen van de persoonsgegevens die we over u bewaren.",
        "Rectificatie — onjuiste of onvolledige gegevens laten corrigeren.",
        "Wissing — vragen om uw gegevens te verwijderen, onder voorbehoud van wettelijke bewaarplichten.",
        "Beperking — vragen om de verwerking te pauzeren terwijl een geschil wordt opgelost.",
        "Overdraagbaarheid — uw gegevens ontvangen in een gestructureerd, machineleesbaar formaat.",
        "Bezwaar — bezwaar maken tegen verwerking op basis van gerechtvaardigd belang, met inbegrip van direct marketing.",
        "Toestemming intrekken — op elk moment, zonder afbreuk aan eerder verwerkte gegevens.",
        "Klacht — een klacht indienen bij de Spaanse gegevensbeschermingsautoriteit (Agencia Española de Protección de Datos, www.aepd.es) of bij de toezichthouder van uw land van verblijf.",
      ],
    },
    {
      heading: "8. Hoe u uw rechten uitoefent",
      body: [
        "Stuur een e-mail naar hello@seasocietyibiza.com vanaf het adres dat bij ons bekend is. We antwoorden binnen de termijn die de AVG voorschrijft (Art. 12.3).",
        "We kunnen om een identiteitsbewijs vragen voordat we persoonsgegevens vrijgeven.",
      ],
    },
    {
      heading: "9. Cookies",
      body: [
        "We gebruiken cookies die strikt noodzakelijk zijn om de site te laten werken (sessie, authenticatie, opslag van toestemming) en, met uw aparte toestemming, optionele cookies voor analytics en marketing.",
        "U kunt uw cookievoorkeuren op elk moment wijzigen via de banner die bij het eerste bezoek verschijnt en via de link \"Voorkeuren\" in de footer. Het intrekken van toestemming wist geen eerdere gebeurtenissen; het stopt de verzameling van nieuwe.",
      ],
    },
    {
      heading: "10. Minderjarigen",
      body: [
        "Deze site is bedoeld voor volwassenen. We verzamelen niet bewust persoonsgegevens van kinderen onder de leeftijd voor digitale toestemming zoals bepaald door de Spaanse wet (Art. 7 LOPDGDD). Als u meent dat we dergelijke gegevens bewaren, neem contact op en we verwijderen ze.",
      ],
    },
    {
      heading: "11. Beveiliging",
      body: [
        "We passen organisatorische en technische maatregelen toe volgens de industriestandaarden om persoonsgegevens te beschermen: versleuteling tijdens transit (TLS), versleuteling at rest, rolgebaseerde admin-toegang, beperkte inloggegevens en auditlogs.",
        "Geen enkel systeem is volledig veilig. In het geval van een datalek dat uw rechten aantast, melden we dit aan de AEPD en, indien vereist, aan de betrokken personen, conform artikelen 33–34 AVG.",
      ],
    },
    {
      heading: "12. Wijzigingen aan dit beleid",
      body: [
        "We kunnen dit Privacybeleid bijwerken wanneer onze praktijken veranderen of om wettelijke ontwikkelingen te weerspiegelen. De ingangsdatum bovenaan deze pagina verandert wanneer we dat doen. Belangrijke wijzigingen worden gedurende een redelijke termijn op de site aangekondigd voordat ze van kracht worden.",
      ],
    },
    {
      heading: "13. Contact en klachten",
      body: [
        "Voor elke vraag over gegevensbescherming of om een recht uit te oefenen: hello@seasocietyibiza.com.",
        "Om rechtstreeks klacht in te dienen bij de toezichthouder: Agencia Española de Protección de Datos, C/ Jorge Juan 6, 28001 Madrid — www.aepd.es.",
      ],
    },
  ],
};

export function getPrivacyCopy(locale: Locale): PrivacyCopy {
  if (locale === "es") return es;
  if (locale === "fr") return fr;
  if (locale === "nl") return nl;
  return en;
}
