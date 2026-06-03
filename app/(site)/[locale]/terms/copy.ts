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

const fr: TermsCopy = {
  metaTitle: "Conditions d'utilisation — Sea Society Ibiza",
  metaDescription:
    "Conditions régissant l'utilisation de seasocietyibiza.com — un site marketing de Sea Society Ibiza (opérée par Ibimar). Aucune réservation n'est conclue sur le site ; les contrats de charter sont gérés séparément.",
  heroEyebrow: "Mentions légales",
  heroTitle: "Conditions d'utilisation",
  effectiveDate: "En vigueur depuis le 1er juin 2026",
  intro: [
    "Les présentes Conditions d'utilisation (« Conditions ») régissent votre utilisation de seasocietyibiza.com (« le site »), un site web marketing exploité par Sea Society Ibiza, nom commercial d'Ibimar Charter S.L. (« Sea Society », « nous »). En utilisant le site, vous acceptez ces Conditions.",
    "Le site est informatif. Aucune réservation, aucun contrat ni aucun paiement ne sont conclus sur le site. Si vous décidez d'affréter un bateau avec nous, ce contrat est géré séparément par Ibimar Charter S.L. selon ses propres conditions.",
  ],
  sections: [
    {
      heading: "1. À propos du site",
      body: [
        "Seasocietyibiza.com présente la flotte, les expériences et les destinations Sea Society et permet aux visiteurs de nous contacter via le formulaire ou WhatsApp. Toute information affichée — prix, disponibilités, caractéristiques des navires, itinéraires — est indicative et reste soumise à confirmation écrite dans le cadre d'un contrat de charter distinct.",
      ],
    },
    {
      heading: "2. Utilisation autorisée",
      body: [
        "Vous pouvez consulter et partager le site à des fins personnelles et non commerciales.",
      ],
      bullets: [
        "N'essayez pas d'accéder à des zones non publiques, à des endpoints d'administration ou aux données d'autres utilisateurs.",
        "Ne réalisez pas de scraping, de mirroring, de framing ni de copie systématique du site.",
        "N'introduisez pas de logiciels malveillants, n'effectuez pas de requêtes automatisées à un rythme affectant la disponibilité, et n'abusez pas de l'infrastructure.",
        "N'utilisez pas le site ni notre marque pour tromper, simuler une affiliation ou à des fins illégales.",
      ],
    },
    {
      heading: "3. Les demandes ne sont pas des contrats",
      body: [
        "L'envoi d'une demande via le formulaire, WhatsApp ou email est une demande d'information. En soi, elle ne crée aucun contrat de service. Un contrat de charter n'existe qu'une fois que Sea Society / Ibimar Charter S.L. et vous-même avez accordé séparément des conditions par écrit.",
        "Les informations que vous nous envoyez via le site sont traitées conformément à notre Politique de confidentialité.",
      ],
    },
    {
      heading: "4. Exactitude des informations",
      body: [
        "Nous mettons en œuvre des efforts raisonnables pour que les prix, disponibilités, caractéristiques des navires et itinéraires restent exacts, mais les informations du site peuvent évoluer sans préavis et peuvent contenir des erreurs. Le site ne constitue pas une offre contraignante.",
        "Les photographies, vidéos et autres visuels sont illustratifs et peuvent ne pas refléter exactement le navire, la configuration ou les conditions de mer que vous rencontrerez.",
      ],
    },
    {
      heading: "5. Propriété intellectuelle",
      body: [
        "Le site, son design, ses textes, ses photographies, ses vidéos, ses logos et ses marques appartiennent à Sea Society / Ibimar Charter S.L. ou nous sont concédés sous licence. Ils sont protégés par la législation sur la propriété intellectuelle.",
        "Vous ne pouvez ni les reproduire, ni les distribuer, ni les modifier, ni les afficher publiquement, ni les utiliser à des fins commerciales sans notre consentement écrit préalable. Partager un lien vers le site ou une page précise est bienvenu.",
      ],
    },
    {
      heading: "6. Contenu et liens de tiers",
      body: [
        "Le site peut renvoyer ou charger du contenu de tiers (Instagram, Google, Vercel, WhatsApp et autres). Nous ne contrôlons pas ces services et ne sommes pas responsables de leur contenu, de leurs politiques ni de leur disponibilité.",
        "En cliquant sur un bouton Réserver ici, vous êtes redirigé vers WhatsApp, qui est régi par ses propres conditions et sa propre politique de confidentialité.",
      ],
    },
    {
      heading: "7. Disponibilité et modifications",
      body: [
        "Nous mettons en œuvre des efforts raisonnables pour maintenir le site disponible mais ne garantissons pas un accès ininterrompu. Nous pouvons modifier, suspendre ou interrompre le site (ou toute partie) à tout moment, sans préavis.",
      ],
    },
    {
      heading: "8. Avertissement et limitation de responsabilité",
      body: [
        "Le site est fourni « en l'état » et « selon disponibilité ». Dans la mesure maximale autorisée par le droit espagnol, nous excluons les garanties implicites et toute responsabilité pour dommages indirects ou consécutifs découlant de votre utilisation du site.",
        "Rien dans les présentes Conditions ne limite la responsabilité en cas de décès, de dommages corporels causés par négligence, de fraude ou de toute responsabilité qui ne peut être limitée selon le droit espagnol. Les droits légaux des consommateurs ne sont pas affectés.",
      ],
    },
    {
      heading: "9. Confidentialité et cookies",
      body: [
        "L'utilisation du site est également régie par notre Politique de confidentialité, qui explique comment nous traitons les données personnelles, et par la bannière de cookies affichée lors de la première visite. Vous pouvez modifier vos préférences cookies à tout moment.",
      ],
    },
    {
      heading: "10. Droits des consommateurs",
      body: [
        "Rien dans les présentes Conditions ne limite vos droits légaux en tant que consommateur au titre du droit espagnol ou de l'UE, notamment la Loi générale pour la défense des consommateurs et usagers (TRLGDCU, Real Decreto Legislativo 1/2007) et la directive (UE) 2011/83.",
        "La plateforme de règlement en ligne des litiges de l'UE est disponible à l'adresse https://ec.europa.eu/consumers/odr.",
      ],
    },
    {
      heading: "11. Droit applicable et juridiction",
      body: [
        "Les présentes Conditions sont régies par le droit espagnol. Tout litige relatif au site relève de la compétence des tribunaux d'Ibiza, Îles Baléares (Juzgados de Ibiza), sans préjudice du droit du consommateur à saisir les tribunaux de son propre domicile au titre des règles de compétence consommateurs de l'UE.",
      ],
    },
    {
      heading: "12. Modifications des présentes Conditions",
      body: [
        "Nous pouvons mettre à jour ces Conditions de manière occasionnelle. La date d'entrée en vigueur en haut de cette page change lorsque nous le faisons. La poursuite de l'utilisation du site après une modification implique l'acceptation des Conditions mises à jour.",
      ],
    },
    {
      heading: "13. Contact",
      body: [
        "Questions sur ces Conditions ou sur le site : hello@seasocietyibiza.com.",
      ],
    },
  ],
};

const nl: TermsCopy = {
  metaTitle: "Gebruiksvoorwaarden — Sea Society Ibiza",
  metaDescription:
    "Voorwaarden voor het gebruik van seasocietyibiza.com — een marketingsite van Sea Society Ibiza (uitgebaat door Ibimar). Op de site worden geen boekingen afgesloten; chartercontracten worden apart afgehandeld.",
  heroEyebrow: "Juridisch",
  heroTitle: "Gebruiksvoorwaarden",
  effectiveDate: "Van kracht sinds 1 juni 2026",
  intro: [
    "Deze Gebruiksvoorwaarden (\"Voorwaarden\") regelen uw gebruik van seasocietyibiza.com (\"de site\"), een marketingwebsite uitgebaat door Sea Society Ibiza, handelsnaam van Ibimar Charter S.L. (\"Sea Society\", \"wij\"). Door de site te gebruiken aanvaardt u deze Voorwaarden.",
    "De site is informatief. Op de site worden geen boekingen, contracten of betalingen afgesloten. Als u beslist een charter bij ons te boeken, wordt dat contract apart afgehandeld door Ibimar Charter S.L. onder zijn eigen voorwaarden.",
  ],
  sections: [
    {
      heading: "1. Over de site",
      body: [
        "Seasocietyibiza.com toont de Sea Society-vloot, -ervaringen en -bestemmingen en laat bezoekers contact opnemen via het aanvraagformulier of WhatsApp. Alle getoonde informatie — prijzen, beschikbaarheid, schipspecificaties, routes — is indicatief en blijft onderhevig aan schriftelijke bevestiging in het kader van een afzonderlijke charterovereenkomst.",
      ],
    },
    {
      heading: "2. Toegestaan gebruik",
      body: [
        "U mag de site bekijken en delen voor persoonlijke, niet-commerciële doeleinden.",
      ],
      bullets: [
        "Probeer geen toegang te krijgen tot niet-openbare zones, admin-endpoints of gegevens van andere gebruikers.",
        "Doe geen scraping, mirroring, framing of systematische kopie van de site.",
        "Introduceer geen malware, voer geen geautomatiseerde verzoeken uit aan een tempo dat de beschikbaarheid aantast, en misbruik de infrastructuur niet.",
        "Gebruik de site of ons merk niet om te misleiden, een affiliatie te suggereren of voor onwettige doeleinden.",
      ],
    },
    {
      heading: "3. Aanvragen zijn geen contracten",
      body: [
        "Een aanvraag indienen via het formulier, via WhatsApp of via e-mail is een informatieverzoek. Op zich creëert het geen overeenkomst voor enige dienst. Een charterovereenkomst bestaat pas wanneer Sea Society / Ibimar Charter S.L. en u apart schriftelijk voorwaarden zijn overeengekomen.",
        "Informatie die u ons via de site stuurt wordt verwerkt volgens ons Privacybeleid.",
      ],
    },
    {
      heading: "4. Nauwkeurigheid van de informatie",
      body: [
        "We doen redelijke inspanningen om prijzen, beschikbaarheid, schipdetails en routes accuraat te houden, maar de informatie op de site kan zonder voorafgaande kennisgeving wijzigen en kan fouten bevatten. De site vormt geen bindend aanbod.",
        "Foto's, video's en andere beelden zijn illustratief en geven mogelijk niet het exacte schip, de configuratie of de zeecondities weer die u zult aantreffen.",
      ],
    },
    {
      heading: "5. Intellectuele eigendom",
      body: [
        "De site, het ontwerp, de teksten, foto's, video's, logo's en merknamen zijn eigendom van Sea Society / Ibimar Charter S.L. of in licentie aan ons gegeven. Ze worden beschermd door het recht op intellectuele eigendom.",
        "U mag ze niet reproduceren, verspreiden, wijzigen, publiekelijk vertonen of commercieel gebruiken zonder onze voorafgaande schriftelijke toestemming. Een link delen naar de site of naar een specifieke pagina is welkom.",
      ],
    },
    {
      heading: "6. Inhoud en links van derden",
      body: [
        "De site kan inhoud van derden bevatten of laden (Instagram, Google, Vercel, WhatsApp en andere). We hebben geen controle over die diensten en zijn niet verantwoordelijk voor hun inhoud, beleid of beschikbaarheid.",
        "Wanneer u op een Boek hier-knop klikt, wordt u doorgestuurd naar WhatsApp, dat valt onder de eigen voorwaarden en het privacybeleid van WhatsApp.",
      ],
    },
    {
      heading: "7. Beschikbaarheid en wijzigingen",
      body: [
        "We doen redelijke inspanningen om de site beschikbaar te houden, maar garanderen geen ononderbroken toegang. We kunnen de site (of enig onderdeel) op elk moment zonder voorafgaande kennisgeving wijzigen, opschorten of stopzetten.",
      ],
    },
    {
      heading: "8. Disclaimer en beperking van aansprakelijkheid",
      body: [
        "De site wordt geleverd \"zoals het is\" en \"naargelang beschikbaar\". Voor zover maximaal toegestaan onder het Spaanse recht sluiten we impliciete garanties uit, evenals elke aansprakelijkheid voor indirecte schade of gevolgschade die voortvloeit uit uw gebruik van de site.",
        "Niets in deze Voorwaarden beperkt de aansprakelijkheid voor overlijden, persoonlijk letsel door nalatigheid, fraude of enige aansprakelijkheid die onder Spaans recht niet kan worden beperkt. Wettelijke consumentenrechten blijven onaangetast.",
      ],
    },
    {
      heading: "9. Privacy en cookies",
      body: [
        "Het gebruik van de site valt ook onder ons Privacybeleid, dat uitlegt hoe we persoonsgegevens verwerken, en onder de cookiebanner die bij het eerste bezoek verschijnt. U kunt uw cookievoorkeuren op elk moment wijzigen.",
      ],
    },
    {
      heading: "10. Consumentenrechten",
      body: [
        "Niets in deze Voorwaarden beperkt uw wettelijke rechten als consument onder Spaans of EU-recht, met name de Algemene wet ter verdediging van consumenten en gebruikers (TRLGDCU, Real Decreto Legislativo 1/2007) en Richtlijn (EU) 2011/83.",
        "Het Europese platform voor online geschillenbeslechting is beschikbaar op https://ec.europa.eu/consumers/odr.",
      ],
    },
    {
      heading: "11. Toepasselijk recht en bevoegde rechter",
      body: [
        "Deze Voorwaarden vallen onder het Spaanse recht. Elk geschil met betrekking tot de site valt onder de bevoegdheid van de rechtbanken van Ibiza, Balearen (Juzgados de Ibiza), zonder afbreuk aan het recht van de consument om de zaak voor de rechtbanken van zijn eigen woonplaats te brengen onder de EU-consumentenbevoegdheidsregels.",
      ],
    },
    {
      heading: "12. Wijzigingen aan deze Voorwaarden",
      body: [
        "We kunnen deze Voorwaarden af en toe bijwerken. De ingangsdatum bovenaan deze pagina verandert wanneer we dat doen. Voortgezet gebruik van de site na een wijziging betekent dat u de bijgewerkte Voorwaarden aanvaardt.",
      ],
    },
    {
      heading: "13. Contact",
      body: [
        "Vragen over deze Voorwaarden of over de site: hello@seasocietyibiza.com.",
      ],
    },
  ],
};

export function getTermsCopy(locale: Locale): TermsCopy {
  if (locale === "es") return es;
  if (locale === "fr") return fr;
  if (locale === "nl") return nl;
  return en;
}
