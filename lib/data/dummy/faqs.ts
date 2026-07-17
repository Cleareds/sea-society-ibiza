import type { Faq } from "../types";

export const faqs: Faq[] = [
  {
    id: "f-01",
    question: "How do I book a charter?",
    answer:
      "Send us a WhatsApp with your dates and group size. We respond within a few hours with availability across the fleet, a tailored quote, and a route suggestion shaped around what you want from the day.",
    category: "Booking",
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: "f-02",
    question: "How much does a charter cost?",
    answer:
      "Day-charter pricing ranges roughly €1,600 to €14,000 depending on the yacht and the season. The largest day boats (Princess, Pershing, Sunseeker flagships) sit at the top of the range; sporty 35–45 ft motoryachts come in around €2,500–€4,500/day. Multi-day Balearic charters are priced separately. The exact quote depends on dates, group size, and which yacht you choose.",
    category: "Booking",
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: "f-03",
    question: "What is included in the price?",
    answer:
      "Every charter includes a professional captain, fuel for the planned route, snorkel equipment, a cooler with ice, Bluetooth audio, towels and sun loungers. Larger yachts (60 ft and up) include stewardess service and optional chef on board. Mooring fees outside Marina Botafoc, food & drink, water-toy rentals and the security deposit are quoted separately.",
    category: "What's included",
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: "f-04",
    question: "Where do we depart from?",
    answer:
      "All charters depart from and return to Botafoc Marina in Ibiza Town — ten minutes from the airport and walking distance from Pacha and the old town. Your captain will share a WhatsApp location pin on the morning, and we will meet you on the pier.",
    category: "Logistics",
    sortOrder: 4,
    isPublished: true,
  },
  {
    id: "f-05",
    question: "What about food and drinks on board?",
    answer:
      "Most groups bring their own provisions, or pre-order from one of our preferred Ibiza Town kitchens — we arrange delivery to the boat before departure. For full-day and multi-day charters, an on-board chef is bookable as an add-on. Champagne packages from Brut to vintage Krug are quoted separately.",
    category: "Onboard",
    sortOrder: 5,
    isPublished: true,
  },
  {
    id: "f-06",
    question: "Can we visit Formentera or Mallorca?",
    answer:
      "Yes. Formentera is twenty minutes south and the most popular destination for a full-day charter — S'Espalmador, Illetes, and Es Caló are the typical stops. Mallorca is a multi-day proposition (six to eight hours across) and works best as part of a three- or four-night charter.",
    category: "Routes",
    sortOrder: 6,
    isPublished: true,
  },
  {
    id: "f-07",
    question: "Is there a security deposit?",
    answer:
      "Yes. The security deposit varies by yacht — typically €1,500 for day boats up to €10,000 for the larger flagships. It is held against accidental damage and refunded after the charter if no incidents occur.",
    category: "Booking",
    sortOrder: 7,
    isPublished: true,
  },
  {
    id: "f-08",
    question: "What if the weather is bad?",
    answer:
      "Captain's call. If conditions are unsafe we will rebook to another day in the season or refund the charter. We never sail in conditions we wouldn't take our own families out in.",
    category: "Booking",
    sortOrder: 8,
    isPublished: true,
  },
  {
    id: "f-09",
    question: "Are children welcome?",
    answer:
      "Of course. Most of our charters include families. Children's life jackets are on board every yacht. Tell us the group composition and we'll match you to a yacht with the right deck layout — a wide bathing platform, a shaded saloon, and an easy ladder.",
    category: "Onboard",
    sortOrder: 9,
    isPublished: true,
  },
  {
    id: "f-10",
    question: "Can we charter for a corporate or special event?",
    answer:
      "Yes — birthdays, proposals, anniversaries, and corporate days are a regular booking shape. For groups of more than 12 we typically run a two-boat raft-up. We can arrange florals, on-board chef, photography (drone + on-board), and the right captain/stewardess combination.",
    category: "Booking",
    sortOrder: 10,
    isPublished: true,
  },
];

export const faqI18n: Record<string, Partial<Record<string, { question?: string; answer?: string }>>> = {
  "f-01": {
    "es": {
      "question": "¿Cómo reservo?",
      "answer": "Escríbenos por WhatsApp o rellena el formulario de contacto de esta web. Respondemos en pocas horas con la disponibilidad, un presupuesto a medida y una propuesta de ruta según tus fechas y tu grupo."
    },
    "fr": {
      "question": "Comment réserver ?",
      "answer": "Envoyez-nous un WhatsApp ou remplissez le formulaire de demande sur ce site. Nous répondons en quelques heures avec les disponibilités, un devis sur mesure et une suggestion d'itinéraire selon vos dates et votre groupe."
    },
    "nl": {
      "question": "Hoe boek ik?",
      "answer": "Stuur ons een WhatsApp of vul het aanvraagformulier op deze site in. We reageren binnen enkele uren met de beschikbaarheid, een offerte op maat en een routevoorstel op basis van uw data en gezelschap."
    }
  },
  "f-03": {
    "es": {
      "question": "¿Qué incluye el precio?",
      "answer": "Todos los chárteres incluyen un capitán profesional, combustible, equipo de snorkel, una nevera con hielo, audio Bluetooth, toallas y tumbonas. Los yates más grandes incluyen servicio de azafata y chef a bordo."
    },
    "fr": {
      "question": "Qu'est-ce qui est inclus dans le prix ?",
      "answer": "Toutes les locations incluent un capitaine professionnel, le carburant, du matériel de snorkeling, une glacière avec glaçons, un système audio Bluetooth, des serviettes et des transats. Les plus grands yachts incluent un service d'hôtesse et un chef à bord."
    },
    "nl": {
      "question": "Wat is inbegrepen in de prijs?",
      "answer": "Alle charters zijn inclusief een professionele kapitein, brandstof, snorkeluitrusting, een koelbox met ijs, Bluetooth-audio, handdoeken en ligbedden. Grotere jachten zijn inclusief stewardessservice en chef aan boord."
    }
  },
  "f-04": {
    "es": {
      "question": "¿Desde dónde salimos?",
      "answer": "Todos los chárteres salen de Marina Botafoc, en la ciudad de Ibiza, a poca distancia del aeropuerto y de la mayoría de los hoteles. Tu capitán te enviará la ubicación por WhatsApp esa misma mañana."
    },
    "fr": {
      "question": "D'où partons-nous ?",
      "answer": "Toutes les locations partent de Marina Botafoc, à Ibiza-ville, à quelques minutes de l'aéroport et de la plupart des complexes hôteliers. Votre capitaine vous enverra la localisation par WhatsApp le matin même."
    },
    "nl": {
      "question": "Waar vertrekken we?",
      "answer": "Alle charters vertrekken vanaf Marina Botafoc in Ibiza-stad, op korte afstand van de luchthaven en de meeste resorts. Uw kapitein deelt 's ochtends een WhatsApp-locatie."
    }
  },
  "f-05": {
    "es": {
      "question": "¿Y la comida y las bebidas?",
      "answer": "La mayoría de los grupos trae sus propias provisiones o las encarga por adelantado en una de nuestras cocinas de confianza (podemos organizar la entrega en el barco). Para chárteres de día completo y viajes más largos, un chef a bordo es una opción."
    },
    "fr": {
      "question": "Et la nourriture et les boissons ?",
      "answer": "La plupart des groupes apportent leurs propres provisions ou les commandent à l'avance auprès de l'une de nos cuisines partenaires (nous pouvons organiser la livraison au bateau). Pour les locations à la journée complète et les séjours plus longs, un chef à bord est possible."
    },
    "nl": {
      "question": "Hoe zit het met eten en drinken?",
      "answer": "De meeste groepen nemen hun eigen proviand mee of bestellen vooraf bij een van onze vaste keukens (we kunnen levering aan de boot regelen). Voor volledige charters en langere trips is een chef aan boord een optie."
    }
  },
  "f-06": {
    "es": {
      "question": "¿Podemos visitar Formentera?",
      "answer": "Sí. Formentera está a unos veinte minutos al sur de Ibiza y es el destino más habitual para un chárter de día completo. S'Espalmador, Illetes y Es Caló son las paradas típicas."
    },
    "fr": {
      "question": "Pouvons-nous visiter Formentera ?",
      "answer": "Oui. Formentera se trouve à une vingtaine de minutes au sud d'Ibiza et c'est la destination la plus courante pour une location à la journée. S'Espalmador, Illetes et Es Caló sont les escales typiques."
    },
    "nl": {
      "question": "Kunnen we Formentera bezoeken?",
      "answer": "Ja. Formentera ligt ongeveer twintig minuten ten zuiden van Ibiza en is de populairste bestemming voor een dagcharter. S'Espalmador, Illetes en Es Caló zijn de gebruikelijke stops."
    }
  },
  "f-07": {
    "es": {
      "question": "¿Hay una fianza?",
      "answer": "Sí. La fianza varía según el barco (normalmente entre 1.500 € y 10.000 €) y se retiene como garantía por daños accidentales. Es totalmente reembolsable tras el chárter si no hay incidencias."
    },
    "fr": {
      "question": "Y a-t-il une caution ?",
      "answer": "Oui. La caution varie selon le bateau (généralement entre 1 500 € et 10 000 €) et sert de garantie contre les dommages accidentels. Elle est entièrement remboursable après la location si aucun incident ne survient."
    },
    "nl": {
      "question": "Is er een borg?",
      "answer": "Ja. De borg verschilt per boot (doorgaans € 1.500–€ 10.000) en dient als waarborg tegen onopzettelijke schade. Volledig terugbetaalbaar na de charter als er geen incidenten zijn."
    }
  },
  "f-08": {
    "es": {
      "question": "¿Qué pasa si hace mal tiempo?",
      "answer": "Lo decide el capitán: si las condiciones no son seguras, reprogramamos el chárter para otro día de la temporada u ofrecemos un reembolso. Nunca navegamos en condiciones en las que no sacaríamos a nuestras propias familias."
    },
    "fr": {
      "question": "Que se passe-t-il en cas de mauvais temps ?",
      "answer": "C'est le capitaine qui décide : si les conditions ne sont pas sûres, nous reprogrammons la location à un autre jour de la saison ou proposons un remboursement. Nous ne naviguons jamais dans des conditions où nous n'emmènerions pas nos propres familles."
    },
    "nl": {
      "question": "Wat als het weer slecht is?",
      "answer": "De kapitein beslist: als de omstandigheden onveilig zijn, verplaatsen we de charter naar een andere dag in het seizoen of bieden we een terugbetaling. We varen nooit in omstandigheden waarin we onze eigen familie niet zouden meenemen."
    }
  },
  "f-09": {
    "es": {
      "question": "¿Se admiten niños?",
      "answer": "Por supuesto. La mayoría de nuestros chárteres son con familias. En todos los barcos hay chalecos salvavidas de tallas infantiles; dinos cómo es tu grupo y te asignaremos un yate adecuado."
    },
    "fr": {
      "question": "Les enfants sont-ils les bienvenus ?",
      "answer": "Bien sûr. La plupart de nos locations se font en famille. Des gilets de sauvetage taille enfant sont présents sur chaque bateau ; indiquez-nous la composition de votre groupe et nous vous proposerons un yacht adapté."
    },
    "nl": {
      "question": "Zijn kinderen welkom?",
      "answer": "Natuurlijk. De meeste van onze charters zijn met gezinnen. Op elke boot zijn reddingsvesten in kindermaten aanwezig; laat ons weten hoe uw gezelschap is samengesteld en we koppelen u aan een geschikt jacht."
    }
  }
};
