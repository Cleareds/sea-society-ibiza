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

  /** Tab labels shared by both island blocks. */
  seaTabLabel: string;
  clubsTabLabel: string;

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
  seaTabLabel: "From the sea",
  clubsTabLabel: "Beach clubs",
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
  seaTabLabel: "Desde el mar",
  clubsTabLabel: "Beach clubs",
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

const fr: DestinationCopy = {
  metaTitle: "Destinations — Ibiza et Formentera en bateau",
  metaDescription:
    "Un guide local Sea Society des Baléares : les plus belles criques, les mouillages cachés, l'itinéraire d'une journée parfaite autour d'Ibiza et Formentera, et les beach clubs où nous revenons sans cesse.",
  heroTitle: "Découvrez Ibiza et Formentera avec un regard local",
  seaTabLabel: "Depuis la mer",
  clubsTabLabel: "Beach clubs",
  introLead: "Les meilleurs souvenirs ne se font pas toujours sur l'eau.",
  introBody:
    "Au fil des années, nous avons découvert des beach clubs confidentiels, des restaurants inoubliables, des criques secrètes et des endroits magnifiques qui font le charme unique de ces îles. Des longs déjeuners face à la mer aux verres au coucher du soleil dans des lieux que vous ne trouverez pas dans la plupart des guides — voici les adresses que nous aimons vraiment et que nous recommandons.",
  introTagline: "Considérez ceci comme votre guide personnel Sea Society des Baléares.",

  ibizaEyebrow: "Depuis la mer",
  ibizaTitle: "Ibiza",
  ibizaSub: "À vivre depuis l'eau :",
  ibizaCoves: [
    {
      name: "Cala Comte",
      bullets: [
        "Célèbre pour son eau turquoise cristalline et ses petits îlots.",
        "L'un des meilleurs spots de baignade et de snorkeling de l'île.",
        "Couchers de soleil spectaculaires.",
      ],
    },
    {
      name: "Cala d'Hort et Es Vedrà",
      bullets: [
        "Le paysage côtier le plus iconique d'Ibiza.",
        "Vues spectaculaires sur le légendaire îlot rocheux qui émerge de la mer.",
        "Excellent mouillage pour le coucher de soleil.",
      ],
    },
    {
      name: "Atlantis (Sa Pedrera)",
      bullets: [
        "Un paysage unique de bassins naturels taillés dans la roche.",
        "Beaucoup plus accessible en bateau qu'à pied.",
        "Idéal pour le snorkeling et la photographie.",
      ],
    },
    {
      name: "Cala Salada et Cala Saladeta",
      bullets: [
        "Encerclée de falaises couvertes de pins.",
        "Eau calme et transparente, atmosphère plus confidentielle.",
        "Particulièrement belle le matin.",
      ],
    },
    {
      name: "Benirràs",
      bullets: [
        "Connue pour sa formation rocheuse caractéristique au large.",
        "Excellent mouillage pour une baignade en fin d'après-midi.",
        "Un superbe écrin au coucher du soleil.",
      ],
    },
  ],

  formenteraEyebrow: "Depuis la mer",
  formenteraTitle: "Formentera",
  formenteraCoves: [
    {
      name: "Ses Illetes",
      bullets: [
        "Régulièrement classée parmi les plus belles plages d'Europe.",
        "Sable blanc poudreux, eau digne des Caraïbes.",
        "À voir absolument en bateau.",
      ],
    },
    {
      name: "S'Espalmador",
      bullets: [
        "Petite île inhabitée entre Ibiza et Formentera.",
        "Accessible uniquement par bateau.",
        "Parmi les eaux les plus claires de Méditerranée.",
      ],
    },
    {
      name: "Caló des Mort",
      bullets: [
        "Crique minuscule entourée de falaises rocheuses.",
        "Eau turquoise éblouissante.",
        "L'un des endroits les plus photogéniques de l'île.",
      ],
    },
    {
      name: "Cala Saona",
      bullets: [
        "Baie protégée encadrée de falaises rouges.",
        "Excellente pour la baignade et le mouillage au coucher du soleil.",
        "Très prisée des yachts et des voiliers.",
      ],
    },
    {
      name: "Cala en Baster",
      bullets: [
        "Plus sauvage, moins fréquentée.",
        "Grottes marines, formations rocheuses et snorkeling excellent.",
        "Une perle cachée face aux plages plus connues.",
      ],
    },
  ],

  routeEyebrow: "Itinéraire recommandé · journée complète",
  routeTitle: "Notre boucle signature Sea Society.",
  routeStops: [
    "Ibiza",
    "S'Espalmador",
    "Ses Illetes",
    "Caló des Mort",
    "Es Vedrà",
    "Coucher de soleil à Cala Comte",
  ],
  routeCombinesTitle: "Ce que cet itinéraire combine",
  routeCombines: [
    "Les eaux les plus claires autour de Formentera",
    "Plages de sable blanc et criques préservées pour la baignade",
    "L'emblème côtier d'Ibiza (Es Vedrà)",
    "L'un des plus beaux couchers de soleil des Baléares",
  ],
  topFiveTitle: "Top 5 des mouillages spectaculaires",
  topFiveSub: "Pour une journée de luxe en yacht",
  topFive: [
    "S'Espalmador",
    "Ses Illetes",
    "Es Vedrà / Cala d'Hort",
    "Cala Comte",
    "Caló des Mort",
  ],

  pasEyebrow: "Incontournable · Expérience Sea Society",
  pasTitle: "Pas des Trucadors.",
  pasBody: [
    "Entre S'Espalmador et la pointe nord de Ses Illetes s'étend un banc de sable connu sous le nom de Pas des Trucadors. Les jours de mer très calme, beaucoup le traversent à pied — l'eau monte généralement du genou à la taille, selon le vent et l'état de la mer. La traversée n'est pas toujours possible : courants et niveau d'eau peuvent changer.",
    "Depuis le bateau, on dirait deux îles reliées par une bande de sable blanc entourée d'une eau turquoise cristalline. C'est l'un des lieux les plus photographiés des Baléares. La combinaison sable blanc, eau transparente et la sensation de marcher sur la mer crée une scène que beaucoup comparent aux Maldives ou aux Caraïbes.",
  ],

  ibizaClubsEyebrow: "Beach clubs · Ibiza",
  ibizaClubsTitle: "Ceux où nous retournons toujours.",
  ibizaClubsSub: "Tous accessibles en bateau — la plupart acceptent les arrivées en annexe depuis votre mouillage.",
  ibizaClubs: [
    {
      name: "Casa Jondal",
      bullets: [
        "Sans doute la réservation déjeuner la plus convoitée d'Ibiza.",
        "Produits de la mer d'exception et cuisine méditerranéenne haut de gamme.",
        "Beaucoup d'invités arrivent directement de leur yacht.",
        "Élégant et stylé, sans tomber dans le « clubby ».",
      ],
    },
    {
      name: "Blue Marlin Ibiza",
      bullets: [
        "Le beach club d'Ibiza le plus célèbre vu depuis l'eau.",
        "Attendez-vous à des superyachts, des DJ, des cocktails et une foule glamour.",
        "Idéal pour des déjeuners qui se prolongent en after de l'après-midi.",
        "Meilleur jour de la semaine : le dimanche.",
      ],
    },
    {
      name: "Amante Ibiza",
      bullets: [
        "Décor spectaculaire au sommet d'une falaise dominant une baie préservée.",
        "Plus romantique et détendu que les grands beach clubs.",
        "Excellente cuisine méditerranéenne et panorama saisissant.",
        "Parfait pour les couples ou une expérience de luxe plus tranquille.",
      ],
    },
    {
      name: "El Silencio Ibiza",
      bullets: [
        "Beach club au design soigné avec une clientèle internationale.",
        "Cocktails remarquables et cuisine méditerranéenne créative.",
        "Mouillage magnifique, atmosphère plus contemporaine.",
      ],
    },
  ],

  formenteraClubsEyebrow: "Beach clubs · Formentera",
  formenteraClubsTitle: "Déjeuner sur l'eau, sans presse.",
  formenteraClubs: [
    {
      name: "Beso Beach Formentera",
      bullets: [
        "L'un des beach clubs les plus iconiques des Baléares.",
        "Luxe pieds nus, belle musique et atmosphère animée.",
        "Arrivée en annexe depuis votre bateau mouillé à Ses Illetes.",
        "Célèbre pour ses longs déjeuners qui se terminent en fête l'après-midi.",
      ],
    },
    {
      name: "Juan y Andrea",
      bullets: [
        "Un classique du déjeuner en yacht.",
        "Poisson et fruits de mer ultra-frais, langouste, cuisine méditerranéenne.",
        "Posé directement sur les sables magnifiques de Ses Illetes.",
        "Favori des propriétaires de yachts et des célébrités depuis des décennies.",
      ],
    },
  ],
  calaDuoTitle: "Cala Duo",
  calaDuoLead:
    "L'une des ouvertures les plus commentées de Formentera ces dernières saisons. Le lieu a repris l'ancien emplacement de Sa Sequi, juste sur l'eau près de La Savina, et s'est rapidement positionné comme une alternative plus glamour et plus énergique à des adresses comme Beso Beach. Imaginez :",
  calaDuoBullets: [
    "DJ au coucher de soleil",
    "Foule yachting",
    "Sushi, fruits de mer, champagne",
    "Luxe pieds nus avec une ambiance de fête plus marquée",
  ],
  calaDuoOutro:
    "Beaucoup le décrivent comme ce qui se rapproche le plus d'un beach club « style Ibiza » que Formentera ait connu, tout en respectant l'esthétique de l'île. Certains voyageurs le mentionnent même comme l'alternative principale lorsque Beso Beach Formentera est complet. N'oubliez pas de jeter un œil au staff de Cala Duo — on dirait qu'ils sortent du défilé ;-)",

  tipEyebrow: "Le conseil Sea Society",
  tipTitle: "Vous ne savez pas où aller ?",
  tipBody:
    "Notre équipe se fera un plaisir de partager des recommandations personnalisées selon votre séjour — un dîner romantique, une plage cachée, le meilleur sushi de l'île ou un beach club avec l'ambiance parfaite.",
  tipItalic: "Parce que les meilleures expériences sont souvent celles qui ne figurent pas encore au programme.",
  tipCta: "Demandez à Sea Society",
};

const nl: DestinationCopy = {
  metaTitle: "Bestemmingen — Ibiza en Formentera per boot",
  metaDescription:
    "Een lokale gids van Sea Society door de Balearen: de mooiste baaien, verborgen ankerplaatsen, de perfecte dagcharterroute rond Ibiza en Formentera, en de beach clubs waar we steeds opnieuw naartoe gaan.",
  heroTitle: "Ontdek Ibiza en Formentera met lokale ogen",
  seaTabLabel: "Vanaf de zee",
  clubsTabLabel: "Beach clubs",
  introLead: "De mooiste herinneringen ontstaan niet altijd op het water.",
  introBody:
    "In de loop der jaren hebben we verborgen beach clubs ontdekt, onvergetelijke restaurants, geheime baaien en prachtige plekken die deze eilanden zo bijzonder maken. Van lange lunches aan zee tot zonsondergangsborrels op plekken die u niet in de meeste reisgidsen vindt — dit zijn de adressen die wij oprecht aanraden.",
  introTagline: "Beschouw dit als uw persoonlijke Sea Society-gids door de Balearen.",

  ibizaEyebrow: "Vanaf de zee",
  ibizaTitle: "Ibiza",
  ibizaSub: "Op zijn best vanaf het water:",
  ibizaCoves: [
    {
      name: "Cala Comte",
      bullets: [
        "Beroemd om zijn kristalheldere turquoise water en kleine eilandjes.",
        "Een van de beste plekken op het eiland om te zwemmen en te snorkelen.",
        "Spectaculaire zonsondergangen.",
      ],
    },
    {
      name: "Cala d'Hort en Es Vedrà",
      bullets: [
        "Het meest iconische kustlandschap van Ibiza.",
        "Adembenemend uitzicht op het legendarische rotseiland dat oprijst uit zee.",
        "Uitstekende ankerplaats voor de zonsondergang.",
      ],
    },
    {
      name: "Atlantis (Sa Pedrera)",
      bullets: [
        "Een uniek landschap van uit de rots gehouwen natuurlijke zwembaden.",
        "Veel makkelijker bereikbaar per boot dan te voet.",
        "Geweldig om te snorkelen en te fotograferen.",
      ],
    },
    {
      name: "Cala Salada en Cala Saladeta",
      bullets: [
        "Omringd door met pijnbomen begroeide kliffen.",
        "Rustig, transparant water en een meer afgeschermde sfeer.",
        "Vooral 's ochtends bijzonder mooi.",
      ],
    },
    {
      name: "Benirràs",
      bullets: [
        "Bekend om zijn karakteristieke rotsformatie voor de kust.",
        "Uitstekende ankerplaats voor een namiddagduik.",
        "Prachtige zonsondergang.",
      ],
    },
  ],

  formenteraEyebrow: "Vanaf de zee",
  formenteraTitle: "Formentera",
  formenteraCoves: [
    {
      name: "Ses Illetes",
      bullets: [
        "Regelmatig onder de mooiste stranden van Europa gerekend.",
        "Poederwit zand en Caraïbisch aandoend water.",
        "Een must per boot.",
      ],
    },
    {
      name: "S'Espalmador",
      bullets: [
        "Een klein onbewoond eiland tussen Ibiza en Formentera.",
        "Enkel per boot bereikbaar.",
        "Een van de helderste wateren van de Middellandse Zee.",
      ],
    },
    {
      name: "Caló des Mort",
      bullets: [
        "Piepkleine baai omringd door rotskliffen.",
        "Adembenemend turquoise water.",
        "Een van de meest fotogenieke plekken van het eiland.",
      ],
    },
    {
      name: "Cala Saona",
      bullets: [
        "Beschutte baai ingelijst door rode kliffen.",
        "Uitstekend zwemwater en ankerplek bij zonsondergang.",
        "Populair bij jachten en zeilboten.",
      ],
    },
    {
      name: "Cala en Baster",
      bullets: [
        "Ruiger en minder druk.",
        "Zeegrotten, rotsformaties en uitzonderlijk snorkelen.",
        "Een verborgen pareltje tegenover de bekendere stranden.",
      ],
    },
  ],

  routeEyebrow: "Aanbevolen route · volledige dag",
  routeTitle: "Onze signatuur Sea Society-lus.",
  routeStops: [
    "Ibiza",
    "S'Espalmador",
    "Ses Illetes",
    "Caló des Mort",
    "Es Vedrà",
    "Zonsondergang bij Cala Comte",
  ],
  routeCombinesTitle: "Wat deze route combineert",
  routeCombines: [
    "Het helderste water rond Formentera",
    "Witte zandstranden en afgeschermde zwemplekken",
    "Het meest iconische landmark van Ibiza (Es Vedrà)",
    "Een van de mooiste zonsondergangen van de Balearen",
  ],
  topFiveTitle: "Top 5 wow-ankerplaatsen",
  topFiveSub: "Voor een luxedag op een jacht",
  topFive: [
    "S'Espalmador",
    "Ses Illetes",
    "Es Vedrà / Cala d'Hort",
    "Cala Comte",
    "Caló des Mort",
  ],

  pasEyebrow: "Een must · Sea Society-ervaring",
  pasTitle: "Pas des Trucadors.",
  pasBody: [
    "Tussen S'Espalmador en de noordpunt van Ses Illetes ligt een ondiepe zandbank, bekend als Pas des Trucadors. Op zeer rustige dagen lopen of waden veel mensen erover — het water staat meestal ergens tussen kniediep en taillehoogte, afhankelijk van zee en wind. De oversteek is niet altijd mogelijk: stromingen en waterstand kunnen veranderen.",
    "Vanaf een boot lijkt het op twee eilanden verbonden door een strook wit zand, omringd door kristalhelder turquoise water. Het is een van de meest gefotografeerde plekken van de Balearen. De combinatie van wit zand, transparant water en het gevoel door de zee te wandelen creëert een tafereel dat veel bezoekers vergelijken met de Malediven of de Caraïben.",
  ],

  ibizaClubsEyebrow: "Beach clubs · Ibiza",
  ibizaClubsTitle: "De plekken waar we steeds terugkeren.",
  ibizaClubsSub: "Allemaal per boot bereikbaar — de meeste aanvaarden aanlanding met de tender vanaf uw ankerplaats.",
  ibizaClubs: [
    {
      name: "Casa Jondal",
      bullets: [
        "Wellicht de meest begeerde lunchreservatie van Ibiza.",
        "Uitzonderlijke vis- en zeevruchten en verfijnde mediterrane keuken.",
        "Veel gasten komen rechtstreeks vanaf hun jacht.",
        "Elegant en stijlvol zonder al te clubby te worden.",
      ],
    },
    {
      name: "Blue Marlin Ibiza",
      bullets: [
        "De bekendste beach club van Ibiza gezien vanaf het water.",
        "Verwacht superjachten, dj's, cocktails en een glamoureus publiek.",
        "Ideaal voor een lunch die uitloopt in een namiddagfeest.",
        "Beste dag van de week: zondag.",
      ],
    },
    {
      name: "Amante Ibiza",
      bullets: [
        "Spectaculaire ligging op een klif boven een afgeschermde baai.",
        "Romantischer en relaxter dan de grote beach clubs.",
        "Uitstekende mediterrane keuken en adembenemend uitzicht.",
        "Ideaal voor koppels of een rustigere luxe-ervaring.",
      ],
    },
    {
      name: "El Silencio Ibiza",
      bullets: [
        "Stijlvolle, design-gerichte beach club met een internationaal publiek.",
        "Uitstekende cocktails en creatieve mediterrane keuken.",
        "Mooie ankerplek en een meer hedendaagse sfeer.",
      ],
    },
  ],

  formenteraClubsEyebrow: "Beach clubs · Formentera",
  formenteraClubsTitle: "Lunchen op het water, op uw gemak.",
  formenteraClubs: [
    {
      name: "Beso Beach Formentera",
      bullets: [
        "Een van de meest iconische beach clubs van de Balearen.",
        "Chique blootsvoetse luxe, sterke muziek en een levendige sfeer.",
        "Aankomst met de tender vanaf uw boot voor anker bij Ses Illetes.",
        "Beroemd om lange lunches die vaak uitlopen in een namiddagfeest.",
      ],
    },
    {
      name: "Juan y Andrea",
      bullets: [
        "Een klassieker voor de jachtlunch.",
        "Uitstekende verse vis, kreeft en mediterrane keuken.",
        "Direct gelegen op het schitterende zand van Ses Illetes.",
        "Al decennialang een favoriet bij jachteigenaars en celebrities.",
      ],
    },
  ],
  calaDuoTitle: "Cala Duo",
  calaDuoLead:
    "Een van de meest besproken nieuwe openingen op Formentera van de laatste seizoenen. De plek nam de voormalige Sa Sequi-locatie over, vlak aan het water bij La Savina, en positioneerde zich snel als een glamoureuzer, energieker alternatief voor plekken zoals Beso Beach. Denk:",
  calaDuoBullets: [
    "Zonsondergang-dj's",
    "Jachtpubliek",
    "Sushi, zeevruchten, champagne",
    "Blootsvoetse luxe met een sterker feestkarakter",
  ],
  calaDuoOutro:
    "Veel bezoekers omschrijven het als wat het dichtst in de buurt komt van een Ibiza-stijl beach club die Formentera ooit gehad heeft, zonder de esthetiek van het eiland te verraden. Sommige reizigers noemen het zelfs als hoofdalternatief wanneer Beso Beach Formentera volgeboekt is. Vergeet niet om eens naar het personeel van Cala Duo te kijken — alsof ze zo van de catwalk komen ;-)",

  tipEyebrow: "De Sea Society-tip",
  tipTitle: "Niet zeker waar naartoe?",
  tipBody:
    "Ons team deelt graag persoonlijke aanbevelingen op basis van uw trip — of het nu om een romantisch diner gaat, een verborgen strand, de beste sushi van het eiland of een beach club met de perfecte sfeer.",
  tipItalic: "Want de mooiste ervaringen zijn vaak die welke nog niet op het programma stonden.",
  tipCta: "Vraag het Sea Society",
};

export function getDestinationsCopy(locale: Locale): DestinationCopy {
  if (locale === "es") return es;
  if (locale === "fr") return fr;
  if (locale === "nl") return nl;
  return en;
}
