-- Spanish translations for the 4 experiences. Mallorca mentions are
-- kept here per the original copy — the destinations page hid them,
-- but experiences cross-reference Balearic itineraries broadly.

update experiences set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'title', 'Salidas de un día',
  'intro', 'Ocho horas, tu grupo, tu ruta. El charter clásico de Ibiza.',
  'body', 'La mayoría de nuestros charters son salidas de día completo — normalmente 9 o 10 horas desde Marina Botafoc, fondeados en una cala tranquila a media mañana, comida a bordo, baños y vuelta a puerto al atardecer. Las rutas las definimos con tu capitán por la mañana, según el viento y el día que quieras tener.',
  'long_description', 'Un día típico empieza en Marina Botafoc hacia las 10:00. Tu capitán tiene la previsión de viento de la mañana y una ruta en mente, pero nada está fijado — la decisión es tuya. Los clásicos de la costa sur como Cala d''Hort, Atlantis y Es Vedrà son los más solicitados; con poniente fuerte iremos hacia el norte, a Cala Salada y Portinatx. La comida se sirve a bordo sobre las 14:00, normalmente fondeados en una cala tranquila, y la tarde es para nadar, paddle surf, juguetes acuáticos o simplemente sentarse en la proa con algo fresco. Volvemos a puerto al atardecer.',
  'meta_title', 'Salidas de un día desde Ibiza — Sea Society',
  'meta_description', 'Charter privado de día completo desde Marina Botafoc. 9–10 horas, tu grupo, tu ruta. Ibiza, Formentera y las mejores calas.'
), true) where slug = 'day-trips';

update experiences set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'title', 'Cruceros al atardecer',
  'intro', 'Una salida corta y deliberada de tres horas por la costa oeste.',
  'body', 'Los cruceros al atardecer salen de Botafoc hacia las 18:00 y giran de vuelta cuando la última luz alcanza Es Vedrà. Las mejores fotos del viaje suelen salir en esta ventana. Disponible en la mayoría de los barcos de la flota.',
  'long_description', 'Los cruceros al atardecer son el charter más corto que ofrecemos — y el que más recomendamos a los huéspedes primerizos. Saliendo de Botafoc justo después de las 18:00, estaréis frente a la costa oeste a tiempo para ver la luz pasar del dorado al rosa al índigo detrás de Es Vedrà. El barco fondea brevemente para un baño y una copa de cava, y luego pone rumbo a casa por la costa iluminada. Tres horas de principio a fin. El champagne, la charcutería y el add-on de fotógrafo son muy populares en este formato.',
  'meta_title', 'Cruceros al atardecer en Ibiza — Sea Society',
  'meta_description', 'Tres horas de costa oeste y atardecer detrás de Es Vedrà. Champagne, baño rápido y vuelta a Botafoc con luz indigo.'
), true) where slug = 'sunset-cruises';

update experiences set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'title', 'Multidía por las Baleares',
  'intro', 'De dos a siete noches — Ibiza, Formentera, Mallorca, Cabrera.',
  'body', 'Los charters más largos abren el resto de las Baleares. Tres noches es el punto dulce para una ruta Ibiza → Formentera → Mallorca. Siete noches incluyen Cabrera, los fondeaderos más vírgenes del Mediterráneo y tiempo real de mar.',
  'long_description', 'Un charter de tres noches suele hacer Ibiza → Formentera → sur de Mallorca, con fondeaderos nocturnos y cenas en tierra. Cinco noches añaden Cabrera — parque nacional, sin barcos comerciales y el agua más clara de las Baleares. Siete noches dan tiempo real en el mar, con opción de llegar a la costa sur de Menorca. Yates hasta 30 m, tripulación de dos o tres, todas las comidas a bordo (o en tierra, tú decides). El itinerario se construye al ritmo de tu grupo.',
  'meta_title', 'Charters multidía por las Baleares — Sea Society',
  'meta_description', 'De dos a siete noches en yate por Ibiza, Formentera, Mallorca y Cabrera. Tripulación completa, todas las comidas, itinerario a medida.'
), true) where slug = 'multi-day-balearic';

update experiences set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'title', 'Experiencias Sea Society',
  'intro', 'Cumpleaños, pedidas, aniversarios, días corporativos.',
  'body', 'Organizamos cumpleaños señalados (a menudo con chef y azafata), pedidas (preparamos el champagne para que no tengas que pensarlo), y días corporativos para equipos de hasta veinte personas en dos barcos. Cuéntanos cómo tiene que ser el día y nos ocupamos del resto.',
  'long_description', 'Los cumpleaños señalados suelen incluir chef privado a bordo, azafata para el día y arreglos florales de nuestra floristería de confianza en Ibiza. Las pedidas son más íntimas — la mayoría de los clientes quieren el momento al atardecer frente a Es Vedrà, con una botella fría preparada y el capitán mirando hacia otro lado. Los días corporativos van en barcos más grandes o divididos en dos yates en convoy, con una comida estructurada a bordo y la opción de atracar en un beach club por la tarde. Cuéntanos cómo tiene que ser el día y nos ocupamos del resto.',
  'meta_title', 'Experiencias Sea Society — Ibiza',
  'meta_description', 'Pedidas, cumpleaños, aniversarios y eventos corporativos en yate. Chef privado, azafata, florales y todos los detalles organizados.'
), true) where slug = 'special-occasions';
