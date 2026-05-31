import type { Locale } from "@/lib/i18n/config";

interface Spot {
  name: string;
  bullets: string[];
}

interface DestinationCopy {
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  introLead: string;
  introBody: string;
  introTagline: string;

  ibizaEyebrow: string;
  ibizaTitle: string;
  ibizaSub: string;
  ibizaCoves: Spot[];

  formenteraEyebrow: string;
  formenteraTitle: string;
  formenteraCoves: Spot[];

  routeEyebrow: string;
  routeTitle: string;
  routeStops: string[];
  routeCombinesTitle: string;
  routeCombines: string[];
  topFiveTitle: string;
  topFiveSub: string;
  topFive: string[];

  pasEyebrow: string;
  pasTitle: string;
  pasBody: string[];

  ibizaClubsEyebrow: string;
  ibizaClubsTitle: string;
  ibizaClubsSub: string;
  ibizaClubs: Spot[];

  formenteraClubsEyebrow: string;
  formenteraClubsTitle: string;
  formenteraClubs: Spot[];
  calaDuoTitle: string;
  calaDuoLead: string;
  calaDuoBullets: string[];
  calaDuoOutro: string;

  tipEyebrow: string;
  tipTitle: string;
  tipBody: string;
  tipItalic: string;
  tipCta: string;
}

const en: DestinationCopy = {
  metaTitle: "Destinations — Ibiza & Formentera by boat",
  metaDescription:
    "A Sea Society local guide to the Balearics: best coves, hidden anchorages, the day-charter route around Ibiza & Formentera, and the beach clubs we keep going back to.",
  heroTitle: "Discover Ibiza & Formentera Through Local Eyes",
  introLead: "The best memories don’t always happen on the water.",
  introBody:
    "Over the years, we’ve discovered hidden beach clubs, unforgettable restaurants, secret coves and beautiful spots that make these islands so special. From long lunches overlooking the sea to sunset drinks in places you won’t find in most travel guides, these are the locations we genuinely love and recommend.",
  introTagline: "Think of this as your personal Sea Society guide to the Balearics.",

  ibizaEyebrow: "From the sea",
  ibizaTitle: "Ibiza",
  ibizaSub: "Best experienced from the water:",
  ibizaCoves: [
    {
      name: "Cala Comte",
      bullets: [
        "Famous for its crystal-clear turquoise water and small offshore islets.",
        "One of the best swimming and snorkeling spots on the island.",
        "Spectacular sunset views.",
      ],
    },
    {
      name: "Cala d’Hort & Es Vedrà",
      bullets: [
        "Ibiza’s most iconic coastal scenery.",
        "Dramatic views of the legendary rocky island rising from the sea.",
        "Excellent anchorage for sunset.",
      ],
    },
    {
      name: "Atlantis (Sa Pedrera)",
      bullets: [
        "A unique landscape of carved rock pools and natural swimming basins.",
        "Much easier to access by boat than on foot.",
        "Great for snorkeling and photography.",
      ],
    },
    {
      name: "Cala Salada & Cala Saladeta",
      bullets: [
        "Surrounded by pine-covered cliffs.",
        "Calm, transparent water and a more secluded atmosphere.",
        "Particularly beautiful in the morning.",
      ],
    },
    {
      name: "Benirràs",
      bullets: [
        "Known for its distinctive offshore rock formation.",
        "Excellent anchorage for an afternoon swim.",
        "Beautiful sunset setting.",
      ],
    },
  ],

  formenteraEyebrow: "From the sea",
  formenteraTitle: "Formentera",
  formenteraCoves: [
    {
      name: "Ses Illetes",
      bullets: [
        "Frequently ranked among Europe’s most beautiful beaches.",
        "Powder-white sand and Caribbean-like water.",
        "A must-visit by boat.",
      ],
    },
    {
      name: "S’Espalmador",
      bullets: [
        "A small uninhabited island between Ibiza and Formentera.",
        "Accessible only by boat.",
        "Some of the clearest water in the Mediterranean.",
      ],
    },
    {
      name: "Caló des Mort",
      bullets: [
        "Tiny cove surrounded by rocky cliffs.",
        "Stunning turquoise water.",
        "One of the most photogenic spots on the island.",
      ],
    },
    {
      name: "Cala Saona",
      bullets: [
        "Protected bay framed by red cliffs.",
        "Excellent swimming and sunset anchorage.",
        "Popular with yachts and sailing boats.",
      ],
    },
    {
      name: "Cala en Baster",
      bullets: [
        "More rugged and less crowded.",
        "Sea caves, rock formations, and excellent snorkeling.",
        "A hidden gem compared to the more famous beaches.",
      ],
    },
  ],

  routeEyebrow: "Recommended boat route · full day",
  routeTitle: "Our signature Sea Society loop.",
  routeStops: [
    "Ibiza",
    "S’Espalmador",
    "Ses Illetes",
    "Caló des Mort",
    "Es Vedrà",
    "Sunset at Cala Comte",
  ],
  routeCombinesTitle: "What this route combines",
  routeCombines: [
    "The clearest waters around Formentera",
    "White-sand beaches and secluded swimming spots",
    "Ibiza’s most iconic landmark (Es Vedrà)",
    "One of the best sunsets in the Balearic Islands",
  ],
  topFiveTitle: "Top 5 wow-factor anchorages",
  topFiveSub: "For a luxury day on a yacht",
  topFive: [
    "S’Espalmador",
    "Ses Illetes",
    "Es Vedrà / Cala d’Hort",
    "Cala Comte",
    "Caló des Mort",
  ],

  pasEyebrow: "A must · Sea Society experience",
  pasTitle: "Pas des Trucadors.",
  pasBody: [
    "Between S’Espalmador and the northern tip of Ses Illetes lies a shallow sandbar known as Pas des Trucadors. On very calm days, many people walk or wade across it — the water is usually anywhere from knee-deep to waist-deep, depending on sea conditions and wind. The crossing is not always possible: currents and water levels can change.",
    "From a boat, it looks like two islands connected by a strip of white sand surrounded by crystal-clear turquoise water. This is one of the most photographed locations in the Balearic Islands. The combination of white sand, transparent water and the feeling of walking through the sea creates a scene that many visitors compare to the Maldives or the Caribbean.",
  ],

  ibizaClubsEyebrow: "Beach clubs · Ibiza",
  ibizaClubsTitle: "The ones we keep going back to.",
  ibizaClubsSub: "All reachable by boat — most accept tender drop-offs from your anchorage.",
  ibizaClubs: [
    {
      name: "Casa Jondal",
      bullets: [
        "Arguably the most sought-after lunch reservation on Ibiza.",
        "Exceptional seafood and elevated Mediterranean cuisine.",
        "Many guests arrive directly from their yachts.",
        "Elegant and fashionable without feeling overly clubby.",
      ],
    },
    {
      name: "Blue Marlin Ibiza",
      bullets: [
        "Ibiza’s most famous yacht-side beach club.",
        "Expect superyachts, DJs, cocktails, and a glamorous crowd.",
        "Great for lunch that transitions into an afternoon party.",
        "Best day of the week: Sunday.",
      ],
    },
    {
      name: "Amante Ibiza",
      bullets: [
        "Spectacular cliffside setting overlooking a secluded bay.",
        "More romantic and relaxed than the larger beach clubs.",
        "Excellent Mediterranean cuisine and stunning views.",
        "Ideal for couples or a quieter luxury experience.",
      ],
    },
    {
      name: "El Silencio Ibiza",
      bullets: [
        "Stylish design-focused beach club with an international crowd.",
        "Excellent cocktails and creative Mediterranean cuisine.",
        "Beautiful anchorage and a more contemporary atmosphere.",
      ],
    },
  ],

  formenteraClubsEyebrow: "Beach clubs · Formentera",
  formenteraClubsTitle: "Lunch on the water, the long way.",
  formenteraClubs: [
    {
      name: "Beso Beach Formentera",
      bullets: [
        "One of the most iconic beach clubs in the Balearics.",
        "Chic barefoot luxury, great music, and a lively atmosphere.",
        "Arrive by tender from your boat anchored off Ses Illetes.",
        "Famous for long lunches that often turn into afternoon celebrations.",
      ],
    },
    {
      name: "Juan y Andrea",
      bullets: [
        "A classic yacht lunch destination.",
        "Excellent fresh seafood, lobster, and Mediterranean cuisine.",
        "Located directly on the stunning sands of Ses Illetes.",
        "A favourite among yacht owners and celebrities for decades.",
      ],
    },
  ],
  calaDuoTitle: "Cala Duo",
  calaDuoLead:
    "One of the most talked-about new openings in Formentera over the last couple of seasons. It took over the former Sa Sequi location, right on the water near La Savina, and quickly positioned itself as a more glamorous, higher-energy alternative to places like Beso Beach. Think:",
  calaDuoBullets: [
    "Sunset DJs",
    "Yacht crowd",
    "Sushi, seafood, champagne",
    "Barefoot luxury with a stronger party atmosphere",
  ],
  calaDuoOutro:
    "A lot of visitors describe it as the closest thing Formentera has had to a true Ibiza-style beach club while still keeping the island’s aesthetic. Some travellers even mention it as the main alternative when Beso Beach Formentera is fully booked. Don’t forget to check out the Cala Duo staff — they seem like they’ve been scouted from the runway ;-)",

  tipEyebrow: "The Sea Society tip",
  tipTitle: "Not sure where to go?",
  tipBody:
    "Our team is always happy to share personalised recommendations based on your trip — whether you’re looking for a romantic dinner, a hidden beach, the best sushi on the island or a beach club with the perfect atmosphere.",
  tipItalic: "Because the best experiences are often the ones that aren’t on the itinerary yet.",
  tipCta: "Ask Sea Society",
};

const es: DestinationCopy = {
  metaTitle: "Destinos — Ibiza y Formentera en barco",
  metaDescription:
    "Una guía local de Sea Society por las Baleares: las mejores calas, fondeaderos escondidos, la ruta perfecta para un día de charter por Ibiza y Formentera, y los beach clubs a los que volvemos siempre.",
  heroTitle: "Descubre Ibiza y Formentera con ojos locales",
  introLead: "Los mejores recuerdos no siempre ocurren en el agua.",
  introBody:
    "A lo largo de los años hemos descubierto beach clubs escondidos, restaurantes inolvidables, calas secretas y rincones preciosos que hacen únicas a estas islas. Desde comidas largas frente al mar hasta copas al atardecer en lugares que no encontrarás en la mayoría de las guías, estos son los sitios que de verdad nos encantan y recomendamos.",
  introTagline: "Considéralo tu guía personal Sea Society por las Baleares.",

  ibizaEyebrow: "Desde el mar",
  ibizaTitle: "Ibiza",
  ibizaSub: "Mejor disfrutada desde el agua:",
  ibizaCoves: [
    {
      name: "Cala Comte",
      bullets: [
        "Famosa por su agua turquesa cristalina y sus pequeños islotes.",
        "Uno de los mejores sitios para nadar y hacer snorkel en la isla.",
        "Atardeceres espectaculares.",
      ],
    },
    {
      name: "Cala d’Hort y Es Vedrà",
      bullets: [
        "El paisaje costero más icónico de Ibiza.",
        "Vistas espectaculares del legendario islote rocoso que emerge del mar.",
        "Fondeadero excelente para ver el atardecer.",
      ],
    },
    {
      name: "Atlantis (Sa Pedrera)",
      bullets: [
        "Un paisaje único de piscinas naturales talladas en la roca.",
        "Mucho más fácil de llegar en barco que a pie.",
        "Ideal para snorkel y fotografía.",
      ],
    },
    {
      name: "Cala Salada y Cala Saladeta",
      bullets: [
        "Rodeada de acantilados cubiertos de pinos.",
        "Agua tranquila y transparente, con un ambiente más reservado.",
        "Especialmente bonita por la mañana.",
      ],
    },
    {
      name: "Benirràs",
      bullets: [
        "Conocida por su característica formación rocosa en alta mar.",
        "Excelente fondeadero para un baño por la tarde.",
        "Un escenario precioso al atardecer.",
      ],
    },
  ],

  formenteraEyebrow: "Desde el mar",
  formenteraTitle: "Formentera",
  formenteraCoves: [
    {
      name: "Ses Illetes",
      bullets: [
        "Habitualmente entre las playas más bonitas de Europa.",
        "Arena blanca como el polvo y agua tipo Caribe.",
        "Imprescindible visitarla en barco.",
      ],
    },
    {
      name: "S’Espalmador",
      bullets: [
        "Una pequeña isla deshabitada entre Ibiza y Formentera.",
        "Solo accesible en barco.",
        "Algunas de las aguas más claras del Mediterráneo.",
      ],
    },
    {
      name: "Caló des Mort",
      bullets: [
        "Una cala diminuta rodeada de acantilados rocosos.",
        "Agua turquesa impresionante.",
        "Uno de los rincones más fotogénicos de la isla.",
      ],
    },
    {
      name: "Cala Saona",
      bullets: [
        "Bahía protegida enmarcada por acantilados rojizos.",
        "Excelente para nadar y fondear al atardecer.",
        "Muy popular entre yates y veleros.",
      ],
    },
    {
      name: "Cala en Baster",
      bullets: [
        "Más salvaje y menos concurrida.",
        "Cuevas marinas, formaciones rocosas y snorkel excepcional.",
        "Una joya escondida frente a las playas más conocidas.",
      ],
    },
  ],

  routeEyebrow: "Ruta recomendada · día completo",
  routeTitle: "Nuestra ruta insignia Sea Society.",
  routeStops: [
    "Ibiza",
    "S’Espalmador",
    "Ses Illetes",
    "Caló des Mort",
    "Es Vedrà",
    "Atardecer en Cala Comte",
  ],
  routeCombinesTitle: "Lo que combina esta ruta",
  routeCombines: [
    "Las aguas más claras alrededor de Formentera",
    "Playas de arena blanca y calas reservadas para nadar",
    "El icono costero de Ibiza (Es Vedrà)",
    "Uno de los mejores atardeceres de las Baleares",
  ],
  topFiveTitle: "Top 5 fondeaderos wow-factor",
  topFiveSub: "Para un día de lujo en yate",
  topFive: [
    "S’Espalmador",
    "Ses Illetes",
    "Es Vedrà / Cala d’Hort",
    "Cala Comte",
    "Caló des Mort",
  ],

  pasEyebrow: "Imprescindible · Experiencia Sea Society",
  pasTitle: "Pas des Trucadors.",
  pasBody: [
    "Entre S’Espalmador y el extremo norte de Ses Illetes hay un banco de arena conocido como Pas des Trucadors. En los días de mar calmada, mucha gente lo cruza caminando — el agua suele estar entre la rodilla y la cintura, dependiendo del viento y del estado del mar. El cruce no siempre es posible: las corrientes y el nivel del agua pueden cambiar.",
    "Desde el barco parece dos islas conectadas por una franja de arena blanca rodeada de agua turquesa cristalina. Es uno de los rincones más fotografiados de las Baleares. La combinación de arena blanca, agua transparente y la sensación de caminar sobre el mar crea una escena que muchos visitantes comparan con las Maldivas o el Caribe.",
  ],

  ibizaClubsEyebrow: "Beach clubs · Ibiza",
  ibizaClubsTitle: "Los que repetimos siempre.",
  ibizaClubsSub: "Todos accesibles en barco — la mayoría acepta llegadas en tender desde tu fondeadero.",
  ibizaClubs: [
    {
      name: "Casa Jondal",
      bullets: [
        "Posiblemente la reserva de comida más codiciada de Ibiza.",
        "Marisco excepcional y alta cocina mediterránea.",
        "Muchos clientes llegan directamente desde su yate.",
        "Elegante y con estilo, sin caer en lo “clubby”.",
      ],
    },
    {
      name: "Blue Marlin Ibiza",
      bullets: [
        "El beach club más famoso de Ibiza visto desde el agua.",
        "Espera megayates, DJs, cócteles y un ambiente muy glamuroso.",
        "Ideal para comidas que se convierten en fiesta de tarde.",
        "Mejor día de la semana: domingo.",
      ],
    },
    {
      name: "Amante Ibiza",
      bullets: [
        "Ubicación espectacular en acantilado sobre una bahía reservada.",
        "Más romántico y relajado que los grandes beach clubs.",
        "Excelente cocina mediterránea y vistas impresionantes.",
        "Perfecto para parejas o para una experiencia de lujo más tranquila.",
      ],
    },
    {
      name: "El Silencio Ibiza",
      bullets: [
        "Beach club con un diseño muy cuidado y público internacional.",
        "Cócteles excepcionales y cocina mediterránea creativa.",
        "Fondeadero precioso y ambiente más contemporáneo.",
      ],
    },
  ],

  formenteraClubsEyebrow: "Beach clubs · Formentera",
  formenteraClubsTitle: "Comer sobre el mar, sin prisa.",
  formenteraClubs: [
    {
      name: "Beso Beach Formentera",
      bullets: [
        "Uno de los beach clubs más icónicos de las Baleares.",
        "Lujo descalzo, buena música y un ambiente animado.",
        "Llegada en tender desde tu barco fondeado en Ses Illetes.",
        "Famoso por comidas largas que terminan en fiesta de tarde.",
      ],
    },
    {
      name: "Juan y Andrea",
      bullets: [
        "Un clásico de la comida en yate.",
        "Marisco fresco excelente, langosta y cocina mediterránea.",
        "Justo sobre las arenas espectaculares de Ses Illetes.",
        "Favorito de armadores de yates y celebrities desde hace décadas.",
      ],
    },
  ],
  calaDuoTitle: "Cala Duo",
  calaDuoLead:
    "Una de las aperturas más comentadas de Formentera de las últimas temporadas. Ocupó la antigua ubicación de Sa Sequi, justo sobre el agua cerca de La Savina, y rápidamente se ha posicionado como una alternativa más glamurosa y de mayor energía que sitios como Beso Beach. Imagina:",
  calaDuoBullets: [
    "DJs al atardecer",
    "Público de yate",
    "Sushi, marisco, champagne",
    "Lujo descalzo con un ambiente de fiesta más marcado",
  ],
  calaDuoOutro:
    "Muchos visitantes lo describen como lo más parecido a un beach club estilo Ibiza que ha tenido Formentera, sin dejar de respetar la estética de la isla. Algunos lo mencionan incluso como la alternativa principal cuando Beso Beach Formentera está completo. No te olvides de fijarte en el staff de Cala Duo — parece sacado de una pasarela ;-)",

  tipEyebrow: "El consejo Sea Society",
  tipTitle: "¿No sabes a dónde ir?",
  tipBody:
    "Nuestro equipo siempre está encantado de compartir recomendaciones personalizadas según tu viaje — ya sea una cena romántica, una playa escondida, el mejor sushi de la isla o un beach club con el ambiente perfecto.",
  tipItalic: "Porque las mejores experiencias son a menudo las que todavía no están en el itinerario.",
  tipCta: "Pregunta a Sea Society",
};

export function getDestinationsCopy(locale: Locale): DestinationCopy {
  return locale === "es" ? es : en;
}
