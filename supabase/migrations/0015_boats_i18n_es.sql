-- Spanish translations for the 8 lead boats (the ones with shipped
-- new photography). Fields not present in `es` fall back to the
-- English columns per-field via lib/data/supabase mapBoat.
--
-- Translated:
--   tagline, description, meta_title, meta_description, what_included
-- Not translated (intentional — proper nouns / technical):
--   name, brand, model_name, base_harbour, specs values, highlight values,
--   engine model strings, year numbers.
-- Highlight + spec LABELS are short technical terms (Length, Beam,
-- Engines, etc.); falling back to English on those is acceptable for
-- launch — population is straightforward later via the same i18n
-- column.

-- Common standard items reused below.
-- ES equivalents of standardIncluded array (lib/data/dummy/boats.ts):
--   "Capitán y tripulación profesionales"
--   "Base en Marina Botafoc"
--   "Equipo de snorkel"
--   "Toallas y tumbonas"
--   "Sistema de sonido Bose / premium"
--   "Wifi a bordo"

update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Poder noble que encarna la distinción más sublime en cada salida.',
  'description', 'Noble y virtuoso, Ariyas es un símbolo — un recordatorio para vivir con nobleza y abrazar cada aventura. Líneas elegantes, acabados opulentos y una presencia inquebrantable sobre el agua.',
  'meta_title', 'Charter Ariyas — Sunseeker Predator 84 en Ibiza',
  'meta_description', 'Alquila Ariyas, un Sunseeker Predator 84 de 27,5 m desde Marina Botafoc. 12 invitados, 25 nudos de crucero. Desde 7.650€/día + IVA.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'ariyas-sunseeker-predator-84';

update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Una silueta que deslumbra, un nombre que cautiva — donde el estilo se encuentra con el mar.',
  'description', 'Un sport cruiser Princess accesible y elegante, pensado para grupos que quieren un día refinado en el agua sin entrar en categoría superyate.',
  'meta_title', 'Charter Chloe — Princess V58 en Ibiza',
  'meta_description', 'Alquila Chloe, un Princess V58 desde Marina Botafoc. Elegancia sport cruiser para grupos íntimos en Ibiza y Formentera.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'chloe-princess-v58';

update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Tu escape estilo James Bond sobre el agua — emoción, velocidad y el estilo de un verdadero icono.',
  'description', 'Pershing 6X totalmente nuevo de 2025 — el barco más orientado al rendimiento de la flota. 48 nudos de máxima desde un casco de 19 metros y tres camarotes.',
  'meta_title', 'Charter Dr. No — Pershing 6X en Ibiza',
  'meta_description', 'Alquila Dr. No, un Pershing 6X de 19 m, 48 nudos de máxima, tres camarotes. Charter de alto rendimiento desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'dr-no-pershing-6x';

update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Una obra maestra de la navegación — sofisticación y distinción en alta mar.',
  'description', 'El Riva Argo 90 en su versión 2020: cuatro camarotes dobles, cinco baños, motores diesel MTU y los inconfundibles acabados artesanales Riva.',
  'meta_title', 'Charter Ella — Riva Argo 90 en Ibiza',
  'meta_description', 'Alquila Ella, un Riva Argo 90 de 27,9 m con cuatro camarotes dobles y motores MTU. Lujo Riva desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'ella-riva-argo-90';

update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Una musa que despierta la creatividad y la alegría en alta mar con su estética futurista.',
  'description', 'Pershing 90 en su versión más afilada — líneas futuristas con tintes carbono, cuatro suites y 42 nudos de máxima gracias a sus motores MTU gemelos.',
  'meta_title', 'Charter Inspiration — Pershing 90 en Ibiza',
  'meta_description', 'Alquila Inspiration, un Pershing 90 de 27,5 m con cuatro suites y 42 nudos de máxima. Charter Pershing desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'inspiration-pershing-90';

update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Líneas elegantes y modernas que ofrecen una experiencia inolvidable a bordo.',
  'description', 'Princess V53 con un interior cálido y elegante — pensado para días largos sobre el agua entre Ibiza y Formentera, con espacio para grupos íntimos.',
  'meta_title', 'Charter Manbero II — Princess V53 en Ibiza',
  'meta_description', 'Alquila Manbero II, un Princess V53 desde Marina Botafoc. Día completo en Ibiza y Formentera con todo incluido.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'manbero-ii-princess-v53';

update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Navegando con fuerza y dominio, cautivando a todos los que se cruzan con ella.',
  'description', 'Astondoa 80 con refit 2025 y motores nuevos de 2024 — una insignia española renacida para la temporada de Ibiza.',
  'meta_title', 'Charter Mazu — Astondoa 80 en Ibiza',
  'meta_description', 'Alquila Mazu, un Astondoa 80 con refit 2025 y motores nuevos. Charter de bandera española desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'mazu-astondoa-80';

update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{es}', jsonb_build_object(
  'tagline', 'Una experiencia de emociones intensas y placenteras en el mar.',
  'description', 'Velocidad de crucero de 35 nudos en un Pershing de 22 metros — refit 2023, dos MTU de 2.000 hp, tres suites y desalinizador a bordo.',
  'meta_title', 'Charter Sensation — Pershing 72 en Ibiza',
  'meta_description', 'Alquila Sensation, un Pershing 72 de 22 m con 35 nudos de crucero, tres suites y desalinizador. Charter Pershing desde Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitán y tripulación profesionales',
    'Base en Marina Botafoc',
    'Equipo de snorkel',
    'Toallas y tumbonas',
    'Sistema de sonido Bose / premium',
    'Wifi a bordo'
  )
), true) where slug = 'sensation-pershing-72';
