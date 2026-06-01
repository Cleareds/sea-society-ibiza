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
  metaTitle: "Terms & Conditions — Sea Society Ibiza",
  metaDescription:
    "Terms governing yacht charter bookings with Sea Society Ibiza (operated by Ibimar): pricing, cancellation, captain's authority, conduct, liability and Spanish law.",
  heroEyebrow: "Legal",
  heroTitle: "Terms & Conditions",
  effectiveDate: "Effective: 1 June 2026",
  intro: [
    "These Terms & Conditions (\"Terms\") govern your use of seasocietyibiza.com and any charter you book through Sea Society Ibiza, a trading name of Ibimar Charter S.L. (\"Sea Society\", \"we\", \"us\"). By submitting an enquiry or making a booking you agree to these Terms.",
    "Please read them carefully alongside our Privacy Policy and Cookie Policy. They are written in plain language but form a binding contract under Spanish law.",
  ],
  sections: [
    {
      heading: "1. Our role + the service",
      body: [
        "Sea Society Ibiza is the customer-facing platform of Ibimar Charter S.L. We act as the operator and contracting party for every charter booked through this site. The vessel, the captain and the day-of operation are ours; you contract directly with us rather than through a third-party broker.",
        "All charters depart from and return to Marina Botafoc, Ibiza Town, unless we agree otherwise in writing.",
      ],
    },
    {
      heading: "2. Booking process",
      body: [
        "A charter is confirmed only when we have (a) sent you a written confirmation by email + WhatsApp, and (b) received the agreed deposit. Until both occur, dates and vessels remain provisional and may be reallocated.",
      ],
      bullets: [
        "Enquiry — you contact us via the form, WhatsApp or email with dates, group size and any preferences.",
        "Quote — we reply within a few hours during the season (April–October), within one business day off-season, with a quote that includes the vessel, base rate, taxes, recommended extras, and any captain/crew gratuity guideline.",
        "Confirmation — once you accept, we issue a written confirmation summarising the booking.",
        "Deposit — 30% of the charter fee is payable within 48 hours of confirmation to secure the booking.",
        "Balance — the remaining 70% is payable no later than 14 days before the charter date. For bookings made inside 14 days, the full amount is due at confirmation.",
      ],
    },
    {
      heading: "3. Pricing, VAT + extras",
      body: [
        "All prices are quoted in euros (EUR) and exclude Spanish VAT (\"IVA\") at 21% unless explicitly stated otherwise. The base rate includes captain, professional crew, fuel for the agreed itinerary, snorkel equipment, towels, sun loungers, on-board sound system, and Wi-Fi where available.",
        "Catering, water toys hire, photographer, florals, drinks above the welcome bottle, and additional fuel for extended itineraries are quoted separately and added to your booking on acceptance.",
        "An advance provisioning allowance (APA) may apply for multi-day charters; the unused balance is refunded after the charter.",
      ],
    },
    {
      heading: "4. Cancellation + refunds",
      body: [
        "Cancellations are graduated by how far in advance they occur. Calendar days from the start of the charter:",
      ],
      bullets: [
        "More than 30 days before: 90% refund (we retain a 10% administrative fee).",
        "15–30 days before: 50% refund.",
        "8–14 days before: 25% refund.",
        "7 days or fewer: no refund, but we will make reasonable efforts to reschedule within the same season.",
      ],
    },
    {
      heading: "5. Weather + force majeure",
      body: [
        "Maritime safety is non-negotiable. If the captain considers conditions unsafe (wind, sea state, storm warning issued by AEMET or Salvamento Marítimo, or comparable authority), we reserve the right to alter the itinerary, shorten the charter, depart later, or — in serious cases — cancel.",
        "If we cancel for safety reasons, you receive a full refund or the option to reschedule within the same season at no additional cost. If the charter has partially taken place when conditions deteriorate, the refund is proportional to the time not used.",
        "Force majeure events (strikes, civil unrest, public-health restrictions, port closure, government order, infrastructure failure outside our control) are treated the same as a weather cancellation.",
      ],
    },
    {
      heading: "6. Captain's authority",
      body: [
        "The captain has full authority over the vessel at all times. They may refuse boarding, alter the route, return to port, or refuse service if anyone on board is intoxicated, threatening, or disregards safety instructions.",
        "All children must be accompanied by a responsible adult and supervised at all times. Life jackets in appropriate sizes are provided.",
      ],
    },
    {
      heading: "7. Guest count, children + pets",
      body: [
        "The maximum guest count is set by the vessel's certificate and Spanish maritime regulations. We will tell you the limit at quote stage and it is binding — additional guests will not be allowed to board.",
        "Children of any age are welcome and counted toward the maximum guest count. Please let us know children's ages at booking so we can provide the correct life-jacket sizes.",
        "Pets are allowed on most vessels with prior written agreement and a small additional cleaning fee. Service animals are always accommodated.",
      ],
    },
    {
      heading: "8. Conduct on board",
      body: [
        "We expect guests to treat the vessel, crew and other guests with respect.",
      ],
      bullets: [
        "No smoking inside cabins or saloons. Smoking is allowed on open exterior decks at the captain's discretion.",
        "No illegal substances on board, ever. This is a Spanish-flag vessel; Spanish drug laws apply.",
        "Music played through the on-board system is fine; portable speakers are at the captain's discretion to maintain neighbourly relations at anchor.",
        "Wet swimwear stays on the exterior decks. Inside areas must remain dry.",
      ],
    },
    {
      heading: "9. Damage + security deposit",
      body: [
        "For multi-day charters we may request a refundable security deposit, payable by card pre-authorisation 24 hours before departure. It is released within 5 business days after the charter, less any cost of damage caused by guest negligence.",
        "Normal wear and tear is not chargeable. Significant damage (broken glassware beyond a normal level, damaged upholstery, lost equipment, accidental harm to the vessel) is. Repair invoices will be shared transparently.",
      ],
    },
    {
      heading: "10. Watersports + on-board equipment",
      body: [
        "Watersports equipment (paddleboards, snorkel gear, towed inflatables, jet skis where licensed) is offered at your own risk and only under the captain's supervision. Guests must follow all safety instructions.",
        "Jet ski use requires the operator to hold a Spanish PNB or equivalent licence; we can arrange a licensed operator on request.",
      ],
    },
    {
      heading: "11. Insurance",
      body: [
        "All our vessels carry mandatory civil liability insurance under Spanish law. We strongly recommend you take out personal travel insurance covering trip cancellation, medical events and personal belongings — our insurance does not extend to your possessions or to events outside the vessel's normal operation.",
      ],
    },
    {
      heading: "12. Photography + intellectual property",
      body: [
        "Photos and videos you take during your charter are yours. If you choose to share content tagging Sea Society or Ibimar, we may re-share with credit unless you explicitly ask us not to.",
        "If a Sea Society photographer is on board, separate model-release terms apply — see § 7 of the Privacy Policy.",
        "The seasocietyibiza.com website, its design, copy, images and brand marks are protected by intellectual-property law. You may not reproduce or use them commercially without our prior written consent.",
      ],
    },
    {
      heading: "13. Consumer rights",
      body: [
        "Nothing in these Terms limits your statutory rights as a consumer under Spanish or EU law, in particular the General Law for the Defence of Consumers and Users (TRLGDCU, Real Decreto Legislativo 1/2007) and Directive (EU) 2011/83.",
        "Spanish consumers may submit disputes to the local Junta Arbitral de Consumo as an alternative to court action. The EU's Online Dispute Resolution platform is available at https://ec.europa.eu/consumers/odr.",
      ],
    },
    {
      heading: "14. Limitation of liability",
      body: [
        "To the maximum extent permitted by law, our liability is limited to the total amount paid for your charter. We do not limit liability for death, personal injury caused by negligence, gross negligence, wilful misconduct, or any liability that cannot be limited under Spanish law.",
        "We are not liable for indirect or consequential losses (missed connecting transport, missed events, loss of enjoyment) unless caused by our negligence.",
      ],
    },
    {
      heading: "15. Applicable law + jurisdiction",
      body: [
        "These Terms are governed by Spanish law. Any dispute arising from a charter booked through us is subject to the exclusive jurisdiction of the courts of Ibiza, Balearic Islands (Juzgados de Ibiza), without prejudice to the consumer's right to bring the action before the courts of their own domicile under EU consumer jurisdiction rules.",
      ],
    },
    {
      heading: "16. Severability + entire agreement",
      body: [
        "If any clause of these Terms is held invalid, the remainder stays in force. The booking confirmation + these Terms + the Privacy Policy constitute the entire agreement between you and Sea Society for the charter in question; prior communications are superseded.",
      ],
    },
    {
      heading: "17. Changes to these Terms",
      body: [
        "We may amend these Terms occasionally. The Terms applicable to your booking are those in force on the date the booking confirmation is issued. Changes are not retroactive.",
      ],
    },
    {
      heading: "18. Contact",
      body: [
        "Questions about these Terms or about a specific booking: hello@seasocietyibiza.com or via WhatsApp on the number shown in the footer of the site.",
      ],
    },
  ],
};

const es: TermsCopy = {
  metaTitle: "Términos y condiciones — Sea Society Ibiza",
  metaDescription:
    "Términos que rigen las reservas de charter con Sea Society Ibiza (operada por Ibimar): precios, cancelación, autoridad del capitán, conducta, responsabilidad y ley aplicable española.",
  heroEyebrow: "Legal",
  heroTitle: "Términos y condiciones",
  effectiveDate: "En vigor desde el 1 de junio de 2026",
  intro: [
    "Estos Términos y Condiciones (\"Términos\") rigen el uso de seasocietyibiza.com y cualquier charter que reserves a través de Sea Society Ibiza, nombre comercial de Ibimar Charter S.L. (\"Sea Society\", \"nosotros\"). Al enviar una consulta o realizar una reserva aceptas estos Términos.",
    "Por favor léelos con atención junto con nuestra Política de Privacidad y Política de Cookies. Están redactados en lenguaje claro pero forman un contrato vinculante conforme al derecho español.",
  ],
  sections: [
    {
      heading: "1. Nuestro papel y el servicio",
      body: [
        "Sea Society Ibiza es la plataforma orientada al cliente de Ibimar Charter S.L. Actuamos como operador y parte contratante de cada charter reservado a través del sitio. La embarcación, el capitán y la operación del día son nuestros; contratas directamente con nosotros y no con un bróker externo.",
        "Todos los charters salen y regresan a Marina Botafoc, Ibiza, salvo acuerdo por escrito en contrario.",
      ],
    },
    {
      heading: "2. Proceso de reserva",
      body: [
        "Un charter queda confirmado únicamente cuando (a) te hemos enviado una confirmación escrita por email y WhatsApp y (b) hemos recibido el depósito acordado. Hasta que se cumplan ambas condiciones, las fechas y la embarcación se consideran provisionales y pueden reasignarse.",
      ],
      bullets: [
        "Consulta — nos contactas vía formulario, WhatsApp o email con fechas, tamaño de grupo y preferencias.",
        "Cotización — respondemos en pocas horas en temporada (abril–octubre), en un día laborable fuera de temporada, con cotización que incluye embarcación, tarifa base, impuestos, extras recomendados y orientación sobre propina del capitán/tripulación.",
        "Confirmación — al aceptar, emitimos una confirmación escrita que resume la reserva.",
        "Depósito — un 30% de la tarifa del charter es pagadero en las 48 horas siguientes a la confirmación para asegurar la reserva.",
        "Saldo — el 70% restante es pagadero a más tardar 14 días antes de la fecha del charter. Para reservas realizadas con menos de 14 días de antelación, el importe total se abona en la confirmación.",
      ],
    },
    {
      heading: "3. Precios, IVA y extras",
      body: [
        "Todos los precios se expresan en euros (EUR) y excluyen el IVA español del 21% salvo indicación expresa en contrario. La tarifa base incluye capitán, tripulación profesional, combustible para el itinerario acordado, equipo de snorkel, toallas, tumbonas, sistema de sonido a bordo y Wi-Fi cuando esté disponible.",
        "Catering, alquiler de juguetes acuáticos, fotógrafo, decoración floral, bebidas más allá de la botella de bienvenida y combustible adicional para itinerarios extendidos se cotizan por separado y se añaden a la reserva al aceptarlos.",
        "Para charters de varios días puede aplicarse un APA (Advance Provisioning Allowance); el saldo no utilizado se devuelve después del charter.",
      ],
    },
    {
      heading: "4. Cancelación y reembolsos",
      body: [
        "Las cancelaciones se gradúan según la antelación. Días naturales antes del inicio del charter:",
      ],
      bullets: [
        "Más de 30 días antes: reembolso del 90% (retenemos un 10% en concepto de gestión).",
        "15–30 días antes: reembolso del 50%.",
        "8–14 días antes: reembolso del 25%.",
        "7 días o menos: sin reembolso, pero haremos esfuerzos razonables para reprogramar dentro de la misma temporada.",
      ],
    },
    {
      heading: "5. Meteorología y fuerza mayor",
      body: [
        "La seguridad marítima no es negociable. Si el capitán considera que las condiciones no son seguras (viento, estado de la mar, aviso de temporal de AEMET o Salvamento Marítimo o autoridad equivalente), nos reservamos el derecho a modificar el itinerario, acortar el charter, retrasar la salida o, en casos graves, cancelar.",
        "Si cancelamos por motivos de seguridad, recibes un reembolso completo o la opción de reprogramar dentro de la misma temporada sin coste adicional. Si el charter ha comenzado parcialmente cuando empeoran las condiciones, el reembolso es proporcional al tiempo no utilizado.",
        "Los eventos de fuerza mayor (huelgas, disturbios civiles, restricciones sanitarias, cierre portuario, orden gubernamental, fallo de infraestructura fuera de nuestro control) se tratan igual que una cancelación por meteorología.",
      ],
    },
    {
      heading: "6. Autoridad del capitán",
      body: [
        "El capitán tiene plena autoridad sobre la embarcación en todo momento. Puede denegar el embarque, modificar la ruta, regresar a puerto o suspender el servicio si alguien a bordo está intoxicado, amenazante o no respeta las instrucciones de seguridad.",
        "Todos los menores deben ir acompañados de un adulto responsable y supervisados en todo momento. Se proporcionan chalecos salvavidas de las tallas adecuadas.",
      ],
    },
    {
      heading: "7. Aforo, menores y mascotas",
      body: [
        "El aforo máximo lo fija el certificado de la embarcación y la normativa marítima española. Te indicaremos el límite en la cotización y es vinculante — no se permitirá el embarque a invitados adicionales.",
        "Los menores son bienvenidos a cualquier edad y cuentan en el aforo máximo. Por favor indícanos las edades en el momento de la reserva para que podamos proporcionar las tallas correctas de chalecos.",
        "Las mascotas se permiten en la mayoría de las embarcaciones con acuerdo previo por escrito y una pequeña tasa adicional de limpieza. Los animales de asistencia se aceptan siempre.",
      ],
    },
    {
      heading: "8. Conducta a bordo",
      body: [
        "Esperamos que los invitados traten la embarcación, la tripulación y a los demás invitados con respeto.",
      ],
      bullets: [
        "Prohibido fumar dentro de los camarotes o salones. Se permite fumar en las cubiertas exteriores abiertas a discreción del capitán.",
        "Prohibidas las sustancias ilegales a bordo en cualquier circunstancia. Esta es una embarcación de bandera española; rige la legislación española sobre drogas.",
        "Música a través del sistema de a bordo está permitida; los altavoces portátiles quedan a discreción del capitán para mantener buenas relaciones de vecindad en fondeo.",
        "El bañador mojado se queda en las cubiertas exteriores. Las zonas interiores deben permanecer secas.",
      ],
    },
    {
      heading: "9. Daños y fianza",
      body: [
        "Para charters de varios días podemos solicitar una fianza reembolsable, retenida en tarjeta 24 horas antes de la salida. Se libera en los 5 días hábiles posteriores al charter, descontados los costes de daños causados por negligencia del invitado.",
        "El desgaste normal no es facturable. Los daños relevantes (rotura de cristalería más allá de lo razonable, daños en tapicería, equipamiento perdido, daño accidental a la embarcación) sí lo son. Las facturas de reparación se comparten de forma transparente.",
      ],
    },
    {
      heading: "10. Deportes acuáticos y equipamiento de a bordo",
      body: [
        "El equipamiento acuático (paddle surf, equipo de snorkel, hinchables remolcados, motos de agua donde corresponda) se ofrece bajo tu propia responsabilidad y siempre bajo la supervisión del capitán. Los invitados deben seguir todas las instrucciones de seguridad.",
        "El uso de moto de agua requiere que el conductor disponga de PNB español o licencia equivalente; podemos organizar un piloto con licencia bajo petición.",
      ],
    },
    {
      heading: "11. Seguro",
      body: [
        "Todas nuestras embarcaciones cuentan con seguro obligatorio de responsabilidad civil conforme al derecho español. Te recomendamos encarecidamente contratar un seguro de viaje personal que cubra cancelaciones, asistencia médica y efectos personales — nuestro seguro no se extiende a tus pertenencias ni a eventos fuera de la operación normal de la embarcación.",
      ],
    },
    {
      heading: "12. Fotografía y propiedad intelectual",
      body: [
        "Las fotos y vídeos que hagas durante tu charter son tuyos. Si decides compartir contenido etiquetando a Sea Society o a Ibimar, podemos volver a compartirlo con la atribución correspondiente, salvo que nos pidas expresamente que no lo hagamos.",
        "Si hay un fotógrafo de Sea Society a bordo, se aplican condiciones de cesión de imagen independientes — ver § 7 de la Política de Privacidad.",
        "El sitio seasocietyibiza.com, su diseño, textos, imágenes y marca están protegidos por la legislación de propiedad intelectual. No puedes reproducirlos ni usarlos comercialmente sin nuestro consentimiento previo por escrito.",
      ],
    },
    {
      heading: "13. Derechos del consumidor",
      body: [
        "Nada en estos Términos limita tus derechos legales como consumidor conforme al derecho español o de la UE, en particular la Ley General para la Defensa de los Consumidores y Usuarios (TRLGDCU, Real Decreto Legislativo 1/2007) y la Directiva (UE) 2011/83.",
        "Los consumidores en España pueden someter disputas a la Junta Arbitral de Consumo local como alternativa al procedimiento judicial. La plataforma de Resolución de Litigios en Línea de la UE está disponible en https://ec.europa.eu/consumers/odr.",
      ],
    },
    {
      heading: "14. Limitación de responsabilidad",
      body: [
        "En la máxima medida permitida por la ley, nuestra responsabilidad se limita al importe total pagado por el charter. No limitamos la responsabilidad por muerte, lesiones personales causadas por negligencia, negligencia grave, dolo o cualquier responsabilidad que no pueda limitarse conforme al derecho español.",
        "No respondemos por daños indirectos o consecuentes (transporte de conexión perdido, eventos perdidos, pérdida de disfrute) salvo que sean causados por nuestra negligencia.",
      ],
    },
    {
      heading: "15. Ley aplicable y jurisdicción",
      body: [
        "Estos Términos se rigen por el derecho español. Cualquier controversia derivada de un charter reservado a través de nosotros se someterá a la jurisdicción exclusiva de los Juzgados de Ibiza, Islas Baleares, sin perjuicio del derecho del consumidor a presentar la acción ante los tribunales de su propio domicilio conforme a las normas de jurisdicción consumerista de la UE.",
      ],
    },
    {
      heading: "16. Divisibilidad y contrato íntegro",
      body: [
        "Si alguna cláusula de estos Términos se considera inválida, el resto continúa en vigor. La confirmación de reserva, estos Términos y la Política de Privacidad constituyen el acuerdo íntegro entre tú y Sea Society para el charter en cuestión; las comunicaciones previas quedan superadas.",
      ],
    },
    {
      heading: "17. Cambios en estos Términos",
      body: [
        "Podemos modificar estos Términos ocasionalmente. Los Términos aplicables a tu reserva son los vigentes en la fecha de emisión de la confirmación. Los cambios no tienen efecto retroactivo.",
      ],
    },
    {
      heading: "18. Contacto",
      body: [
        "Para preguntas sobre estos Términos o sobre una reserva específica: hello@seasocietyibiza.com o vía WhatsApp en el número indicado en el pie del sitio.",
      ],
    },
  ],
};

export function getTermsCopy(locale: Locale): TermsCopy {
  return locale === "es" ? es : en;
}
