-- Spanish translations for the remaining 13 boats (everything not
-- covered in 0015). Same shape per row: tagline, description,
-- meta_title, meta_description, what_included. Highlight/spec
-- labels still fall back to English per-field (acceptable for the
-- technical specs grid; standard terms read fine cross-language).

-- belisa
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Líneas esbeltas y bellas, de elegancia atemporal que cautivan todos los sentidos.',
  'description', 'Belisa es el maxi-open Mangusta en su forma más destilada — largo, bajo, rápido y con un acabado de un nivel que impresiona en silencio.',
  'meta_title', 'Charter Belisa — Mangusta 108 en Ibiza',
  'meta_description', 'Alquila Belisa, un Mangusta 108 maxi-open de 32,9 m desde Marina Botafoc. 12 invitados, 10 a bordo de noche, 36 nudos. Desde 11.000€/día + IVA.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'belisa-mangusta-108';

-- eternity-44
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Un santuario en el mar, donde el espacio se convierte en experiencia.',
  'description', 'El Arcadia 85 cambia la velocidad punta por interiores acristalados muy amplios, paneles solares y una serenidad que envidian tanto los catamaranes como los yates a motor.',
  'meta_title', 'Charter Eternity 44 — Arcadia 85 en Ibiza',
  'meta_description', 'Alquila Eternity 44, un Arcadia 85 con interiores acristalados, paneles solares y un confort excepcional. Charter elegante desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'eternity-44-arcadia-85';

-- georgia
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Refinamiento y distinción, un yate que evoca la gracia del mar.',
  'description', 'Sunseeker Predator 82 con refit 2025 — cuatro suites, plataforma hidráulica y la inconfundible silueta Predator.',
  'meta_title', 'Charter Georgia — Sunseeker Predator 82 en Ibiza',
  'meta_description', 'Alquila Georgia, un Sunseeker Predator 82 con refit 2025, cuatro suites y plataforma hidráulica. Charter desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'georgia-sunseeker-predator-82';

-- invictus
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Fuerte y poderosa, desafía los límites con su espíritu invencible.',
  'description', 'Un Riva Rivale 52 con refit 2025 — el ADN del day-boat italiano llevado a un charter real con dos camarotes y 37 nudos de máxima.',
  'meta_title', 'Charter Invictus — Riva Rivale 52 en Ibiza',
  'meta_description', 'Alquila Invictus, un Riva Rivale 52 con refit 2025, dos camarotes y 37 nudos de máxima. Charter Riva desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'invictus-riva-rivale-52';

-- number-9
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Líneas deportivas y elegantes que ofrecen una experiencia cautivadora.',
  'description', 'Un Predator 72 con refit 2025 — tres camarotes, plataforma hidráulica y la silueta Sunseeker a uno de los precios más accesibles de la flota.',
  'meta_title', 'Charter Number 9 — Sunseeker Predator 72 en Ibiza',
  'meta_description', 'Alquila Number 9, un Sunseeker Predator 72 con refit 2025 y tres camarotes. Charter deportivo desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'number-9-sunseeker-predator-72';

-- ruby-tuesday
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'La esencia del lujo y la pasión que cautiva a todos.',
  'description', 'Princess V72 con refit 2022 y motores Caterpillar diesel — 22 metros, tres suites, plataforma hidráulica y desalinizador.',
  'meta_title', 'Charter Ruby Tuesday — Princess V72 en Ibiza',
  'meta_description', 'Alquila Ruby Tuesday, un Princess V72 de 22 m con tres suites, motores Caterpillar y desalinizador. Charter desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'ruby-tuesday-princess-v72';

-- tranquility-iii
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Una calma única y relajante — paz y serenidad en su mejor expresión.',
  'description', 'Un Sunseeker Predator 68 de 21 metros — refit 2022 con revisión completa de motores, plataforma hidráulica y desalinizador.',
  'meta_title', 'Charter Tranquility III — Sunseeker Predator 68 en Ibiza',
  'meta_description', 'Alquila Tranquility III, un Sunseeker Predator 68 de 21 m con refit 2022. Charter elegante desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'tranquility-iii-sunseeker-predator-68';

-- yolo
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Una llamada a vivir cada momento con la intensidad de las olas.',
  'description', 'Catamarán a vela Sunreef 70+ construido para su armador en 2022 — Starlink, 39 kW de paneles solares, flybridge de 50 m² y cuatro suites dobles.',
  'meta_title', 'Charter Yolo — Catamarán Sunreef 70+ en Ibiza',
  'meta_description', 'Alquila Yolo, un catamarán a vela Sunreef 70+ con Starlink, energía solar y cuatro suites dobles. Charter sostenible desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'yolo-sunreef-70';

-- black-jax
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Elegante, clásico, versátil — la máxima expresión de calidad y excepcionalidad.',
  'description', 'Sunseeker Predator 74 con un casco oscuro distintivo. Tres camarotes, plataforma hidráulica y el confort Sunseeker en una de las siluetas más reconocibles del puerto.',
  'meta_title', 'Charter Black Jax — Sunseeker Predator 74 en Ibiza',
  'meta_description', 'Alquila Black Jax, un Sunseeker Predator 74 con casco oscuro y tres camarotes. Charter desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'black-jax-sunseeker-predator-74';

-- django
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Una puerta de entrada para explorar lugares remotos con estilo y funcionalidad.',
  'description', 'Noah 29 FB — una embarcación ágil pensada para alcanzar calas a las que los yates más grandes no llegan, con la elegancia y los detalles que esperarías de un charter Sea Society.',
  'meta_title', 'Charter Django — Noah 29 FB RIB en Ibiza',
  'meta_description', 'Alquila Django, una RIB Noah 29 FB ágil para explorar las calas más escondidas de Ibiza y Formentera. Charter desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'django-noah-29fb';

-- floppy
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Donde cada momento se convierte en un homenaje a la libertad y la conexión con el mar.',
  'description', 'SACS Stratos 42 — una maxi-RIB italiana que combina velocidad, espacio y un estilo limpio. Ideal para grupos que quieren un día rápido entre calas sin renunciar al confort.',
  'meta_title', 'Charter Floppy — SACS Stratos 42 maxi-RIB en Ibiza',
  'meta_description', 'Alquila Floppy, una maxi-RIB SACS Stratos 42 italiana. Velocidad, espacio y confort para un día de calas. Charter desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'floppy-sacs-stratos-42';

-- majestic
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Una embarcación refinada para navegar con elegancia y sofisticación.',
  'description', 'VanDutch 40 — el day-boat más reconocible del Mediterráneo. Líneas escultóricas, terraza abierta y la sensación inconfundible de un VanDutch al timón.',
  'meta_title', 'Charter Majestic — VanDutch 40 en Ibiza',
  'meta_description', 'Alquila Majestic, un VanDutch 40 con líneas escultóricas y terraza abierta. El day-boat más icónico desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'majestic-vandutch-40';

-- shaka-laka
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Un nombre que evoca las olas del mar — un diseño de calma y excelencia.',
  'description', 'Princess V58 con interiores cálidos y elegantes — pensado para días largos en el agua entre Ibiza y Formentera con grupos íntimos.',
  'meta_title', 'Charter Shaka Laka — Princess V58 en Ibiza',
  'meta_description', 'Alquila Shaka Laka, un Princess V58 con interiores cálidos para grupos íntimos. Charter desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'shaka-laka-princess-v58';
