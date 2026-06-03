-- French + Dutch translations for all 21 boats. Mirrors the EN/ES
-- columns translated in 0015 + 0019 — tagline, description,
-- meta_title, meta_description, what_included. Highlight + spec
-- LABELS still fall back to English; they're short technical terms
-- (Length / Beam / Engines) and read fine cross-language.
--
-- Standard included items (FR):
--   "Capitaine et équipage professionnels"
--   "Basé à Marina Botafoc"
--   "Équipement de snorkeling"
--   "Serviettes et transats"
--   "Système audio Bose / premium"
--   "Wifi à bord"
--
-- Standard included items (NL):
--   "Professionele kapitein en bemanning"
--   "Thuishaven Marina Botafoc"
--   "Snorkeluitrusting"
--   "Handdoeken en ligbedden"
--   "Bose / premium audiosysteem"
--   "Wifi aan boord"

-- ============================================================
-- FRENCH
-- ============================================================

-- ariyas
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Une puissance noble qui incarne la distinction la plus aboutie à chaque sortie.',
  'description', 'Noble et raffiné, Ariyas est un symbole — un rappel de vivre avec noblesse et d''embrasser chaque aventure. Lignes élégantes, finitions opulentes et une présence inébranlable sur l''eau.',
  'meta_title', 'Charter Ariyas — Sunseeker Predator 84 à Ibiza',
  'meta_description', 'Affrétez Ariyas, un Sunseeker Predator 84 de 27,5 m depuis Marina Botafoc. 12 invités, 25 nœuds de croisière. À partir de 7 650 € / jour + TVA.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'ariyas-sunseeker-predator-84';

-- chloe
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Une silhouette qui éblouit, un nom qui captive — là où le style rencontre la mer.',
  'description', 'Un sport cruiser Princess accessible et élégant, pensé pour les groupes qui veulent une journée raffinée sur l''eau sans entrer dans la catégorie superyacht.',
  'meta_title', 'Charter Chloe — Princess V58 à Ibiza',
  'meta_description', 'Affrétez Chloe, un Princess V58 depuis Marina Botafoc. Élégance sport cruiser pour des groupes intimes à Ibiza et Formentera.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'chloe-princess-v58';

-- dr-no
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Votre escapade style James Bond sur l''eau — adrénaline, vitesse et l''allure d''une vraie icône.',
  'description', 'Pershing 6X entièrement neuf de 2025 — le bateau le plus tourné performance de la flotte. 48 nœuds maxi sur une coque de 19 m et trois cabines.',
  'meta_title', 'Charter Dr. No — Pershing 6X à Ibiza',
  'meta_description', 'Affrétez Dr. No, un Pershing 6X de 19 m, 48 nœuds maxi, trois cabines. Charter haute performance depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'dr-no-pershing-6x';

-- ella
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Un chef-d''œuvre de la navigation — sophistication et distinction en haute mer.',
  'description', 'Le Riva Argo 90 en version 2020 : quatre cabines doubles, cinq salles de bain, motorisation diesel MTU et la signature artisanale Riva.',
  'meta_title', 'Charter Ella — Riva Argo 90 à Ibiza',
  'meta_description', 'Affrétez Ella, un Riva Argo 90 de 27,9 m avec quatre cabines doubles et moteurs MTU. Le luxe Riva depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'ella-riva-argo-90';

-- inspiration
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Une muse qui éveille créativité et joie en haute mer, avec son esthétique futuriste.',
  'description', 'Pershing 90 dans sa version la plus affirmée — lignes futuristes aux touches carbone, quatre suites et 48 nœuds maxi grâce aux MTU jumelés.',
  'meta_title', 'Charter Inspiration — Pershing 90 à Ibiza',
  'meta_description', 'Affrétez Inspiration, un Pershing 90 de 27,5 m, quatre suites et 42 nœuds maxi. Charter Pershing depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'inspiration-pershing-90';

-- manbero-ii
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Des lignes élégantes et modernes pour une expérience inoubliable à bord.',
  'description', 'Princess V53 à l''intérieur chaleureux et élégant — pensé pour les longues journées sur l''eau entre Ibiza et Formentera, avec de l''espace pour des groupes intimes.',
  'meta_title', 'Charter Manbero II — Princess V53 à Ibiza',
  'meta_description', 'Affrétez Manbero II, un Princess V53 depuis Marina Botafoc. Journée complète à Ibiza et Formentera, tout compris.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'manbero-ii-princess-v53';

-- mazu
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Navigant avec force et maîtrise, captivant tous ceux qui la croisent.',
  'description', 'Astondoa 80 refit 2025 et moteurs neufs 2024 — un emblème espagnol renaît pour la saison d''Ibiza.',
  'meta_title', 'Charter Mazu — Astondoa 80 à Ibiza',
  'meta_description', 'Affrétez Mazu, un Astondoa 80 refit 2025 et moteurs neufs. Charter sous pavillon espagnol depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'mazu-astondoa-80';

-- sensation
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Une expérience d''émotions intenses et plaisantes en mer.',
  'description', 'Vitesse de croisière de 35 nœuds sur un Pershing de 22 m — refit 2023, deux MTU de 2 000 ch, trois suites et dessalinisateur à bord.',
  'meta_title', 'Charter Sensation — Pershing 72 à Ibiza',
  'meta_description', 'Affrétez Sensation, un Pershing 72 de 22 m, 35 nœuds de croisière, trois suites et dessalinisateur. Charter Pershing depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'sensation-pershing-72';

-- belisa
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Des lignes fines et belles, d''une élégance intemporelle qui captive tous les sens.',
  'description', 'Belisa, c''est le maxi-open Mangusta dans sa forme la plus pure — long, bas, rapide, avec une finition qui impressionne en silence.',
  'meta_title', 'Charter Belisa — Mangusta 108 à Ibiza',
  'meta_description', 'Affrétez Belisa, un Mangusta 108 maxi-open de 32,9 m depuis Marina Botafoc. 12 invités, 10 à bord la nuit, 36 nœuds. À partir de 11 000 € / jour + TVA.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'belisa-mangusta-108';

-- eternity-44
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Un sanctuaire en mer, où l''espace devient expérience.',
  'description', 'L''Arcadia 85 troque la vitesse de pointe contre de très vastes intérieurs vitrés, des panneaux solaires et une sérénité qu''envient à la fois les catamarans et les yachts à moteur.',
  'meta_title', 'Charter Eternity 44 — Arcadia 85 à Ibiza',
  'meta_description', 'Affrétez Eternity 44, un Arcadia 85 aux intérieurs vitrés, panneaux solaires et confort exceptionnel. Charter élégant depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'eternity-44-arcadia-85';

-- georgia
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Raffinement et distinction, un yacht qui évoque la grâce de la mer.',
  'description', 'Sunseeker Predator 82 refit 2025 — quatre suites, plateforme hydraulique et la silhouette Predator inimitable.',
  'meta_title', 'Charter Georgia — Sunseeker Predator 82 à Ibiza',
  'meta_description', 'Affrétez Georgia, un Sunseeker Predator 82 refit 2025, quatre suites et plateforme hydraulique. Charter depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'georgia-sunseeker-predator-82';

-- invictus
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Forte et puissante, elle défie les limites avec son esprit invincible.',
  'description', 'Un Riva Rivale 52 refit 2025 — l''ADN du day-boat italien porté à un vrai charter avec deux cabines et 37 nœuds maxi.',
  'meta_title', 'Charter Invictus — Riva Rivale 52 à Ibiza',
  'meta_description', 'Affrétez Invictus, un Riva Rivale 52 refit 2025, deux cabines et 37 nœuds maxi. Charter Riva depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'invictus-riva-rivale-52';

-- number-9
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Des lignes sportives et élégantes pour une expérience envoûtante.',
  'description', 'Un Predator 72 refit 2025 — trois cabines, plateforme hydraulique et la silhouette Sunseeker à l''un des tarifs les plus accessibles de la flotte.',
  'meta_title', 'Charter Number 9 — Sunseeker Predator 72 à Ibiza',
  'meta_description', 'Affrétez Number 9, un Sunseeker Predator 72 refit 2025 et trois cabines. Charter sportif depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'number-9-sunseeker-predator-72';

-- ruby-tuesday
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'L''essence du luxe et de la passion qui captive tout le monde.',
  'description', 'Princess V72 refit 2022 et moteurs Caterpillar diesel — 22 m, trois suites, plateforme hydraulique et dessalinisateur.',
  'meta_title', 'Charter Ruby Tuesday — Princess V72 à Ibiza',
  'meta_description', 'Affrétez Ruby Tuesday, un Princess V72 de 22 m, trois suites, moteurs Caterpillar et dessalinisateur. Charter depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'ruby-tuesday-princess-v72';

-- tranquility-iii
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Un calme rare et apaisant — la paix et la sérénité au sommet.',
  'description', 'Sunseeker Predator 68 de 21 m — refit 2022 avec révision complète des moteurs, plateforme hydraulique et dessalinisateur.',
  'meta_title', 'Charter Tranquility III — Sunseeker Predator 68 à Ibiza',
  'meta_description', 'Affrétez Tranquility III, un Sunseeker Predator 68 de 21 m, refit 2022. Charter élégant depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'tranquility-iii-sunseeker-predator-68';

-- yolo
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Une invitation à vivre chaque instant avec l''intensité des vagues.',
  'description', 'Catamaran à voile Sunreef 70+ construit pour son armateur en 2022 — Starlink, 39 kW de panneaux solaires, flybridge de 50 m² et quatre suites doubles.',
  'meta_title', 'Charter Yolo — Catamaran Sunreef 70+ à Ibiza',
  'meta_description', 'Affrétez Yolo, un catamaran à voile Sunreef 70+ avec Starlink, énergie solaire et quatre suites doubles. Charter durable depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'yolo-sunreef-70';

-- black-jax
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Élégant, classique, polyvalent — l''expression la plus haute de qualité et d''exception.',
  'description', 'Sunseeker Predator 74 à la coque sombre distinctive. Trois cabines, plateforme hydraulique et le confort Sunseeker sur l''une des silhouettes les plus reconnaissables du port.',
  'meta_title', 'Charter Black Jax — Sunseeker Predator 74 à Ibiza',
  'meta_description', 'Affrétez Black Jax, un Sunseeker Predator 74 à coque sombre et trois cabines. Charter depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'black-jax-sunseeker-predator-74';

-- django
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Une porte d''entrée pour explorer les lieux les plus reculés avec style et fonctionnalité.',
  'description', 'Noah 29 FB — une embarcation agile pensée pour atteindre des criques où les plus gros yachts ne vont pas, avec l''élégance et les détails attendus d''un charter Sea Society.',
  'meta_title', 'Charter Django — RIB Noah 29 FB à Ibiza',
  'meta_description', 'Affrétez Django, un RIB Noah 29 FB agile pour explorer les criques les plus cachées d''Ibiza et Formentera. Charter depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'django-noah-29fb';

-- floppy
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Là où chaque instant devient un hommage à la liberté et au lien avec la mer.',
  'description', 'SACS Stratos 42 — un maxi-RIB italien qui combine vitesse, espace et un style épuré. Idéal pour les groupes qui veulent une journée rapide entre criques sans sacrifier le confort.',
  'meta_title', 'Charter Floppy — SACS Stratos 42 maxi-RIB à Ibiza',
  'meta_description', 'Affrétez Floppy, un maxi-RIB italien SACS Stratos 42. Vitesse, espace et confort pour une journée de criques. Charter depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'floppy-sacs-stratos-42';

-- majestic
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Une embarcation raffinée pour naviguer avec élégance et sophistication.',
  'description', 'VanDutch 40 — le day-boat le plus reconnaissable de la Méditerranée. Lignes sculpturales, pont ouvert et la sensation inimitable d''un VanDutch à la barre.',
  'meta_title', 'Charter Majestic — VanDutch 40 à Ibiza',
  'meta_description', 'Affrétez Majestic, un VanDutch 40 aux lignes sculpturales et pont ouvert. Le day-boat le plus iconique depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'majestic-vandutch-40';

-- shaka-laka
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'tagline', 'Un nom qui évoque les vagues — un design fait de calme et d''excellence.',
  'description', 'Princess V58 à l''intérieur chaleureux et élégant — pensé pour les longues journées sur l''eau entre Ibiza et Formentera, en groupe intime.',
  'meta_title', 'Charter Shaka Laka — Princess V58 à Ibiza',
  'meta_description', 'Affrétez Shaka Laka, un Princess V58 à l''intérieur chaleureux pour des groupes intimes. Charter depuis Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Capitaine et équipage professionnels',
    'Basé à Marina Botafoc',
    'Équipement de snorkeling',
    'Serviettes et transats',
    'Système audio Bose / premium',
    'Wifi à bord'
  )
), true) where slug = 'shaka-laka-princess-v58';

-- ============================================================
-- DUTCH
-- ============================================================

-- ariyas
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Een nobele kracht die de meest verheven distinctie belichaamt, elke vaart opnieuw.',
  'description', 'Nobel en deugdzaam, Ariyas is een symbool — een herinnering om met klasse te leven en elk avontuur te omarmen. Elegante lijnen, weelderige afwerking en een onwankelbare aanwezigheid op het water.',
  'meta_title', 'Charter Ariyas — Sunseeker Predator 84 in Ibiza',
  'meta_description', 'Charter Ariyas, een Sunseeker Predator 84 van 27,5 m vanuit Marina Botafoc. 12 gasten, 25 knopen kruissnelheid. Vanaf € 7.650 / dag + btw.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'ariyas-sunseeker-predator-84';

-- chloe
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Een silhouet dat verblindt, een naam die boeit — waar stijl de zee ontmoet.',
  'description', 'Een toegankelijke en elegante Princess sport cruiser, ontworpen voor gezelschappen die een verfijnde dag op het water willen zonder in de superjachtcategorie te belanden.',
  'meta_title', 'Charter Chloe — Princess V58 in Ibiza',
  'meta_description', 'Charter Chloe, een Princess V58 vanuit Marina Botafoc. Sport cruiser-elegantie voor intieme gezelschappen in Ibiza en Formentera.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'chloe-princess-v58';

-- dr-no
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Uw James Bond-achtige ontsnapping op het water — adrenaline, snelheid en de stijl van een ware icoon.',
  'description', 'Gloednieuwe Pershing 6X uit 2025 — de meest performance-gerichte boot van de vloot. 48 knopen maximum op een romp van 19 meter met drie hutten.',
  'meta_title', 'Charter Dr. No — Pershing 6X in Ibiza',
  'meta_description', 'Charter Dr. No, een Pershing 6X van 19 m, 48 knopen maximum, drie hutten. High-performance charter vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'dr-no-pershing-6x';

-- ella
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Een meesterwerk van varen — verfijning en distinctie op volle zee.',
  'description', 'De Riva Argo 90 in de versie van 2020: vier dubbele hutten, vijf badkamers, MTU-dieselmotoren en de onmiskenbare Riva-handwerkafwerking.',
  'meta_title', 'Charter Ella — Riva Argo 90 in Ibiza',
  'meta_description', 'Charter Ella, een Riva Argo 90 van 27,9 m met vier dubbele hutten en MTU-motoren. Riva-luxe vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'ella-riva-argo-90';

-- inspiration
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Een muze die creativiteit en vreugde wekt op volle zee, met haar futuristische esthetiek.',
  'description', 'Pershing 90 in zijn scherpste versie — futuristische lijnen met carbon-accenten, vier suites en 48 knopen maximum dankzij de gekoppelde MTU''s.',
  'meta_title', 'Charter Inspiration — Pershing 90 in Ibiza',
  'meta_description', 'Charter Inspiration, een Pershing 90 van 27,5 m met vier suites en 42 knopen maximum. Pershing-charter vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'inspiration-pershing-90';

-- manbero-ii
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Elegante, moderne lijnen die zorgen voor een onvergetelijke beleving aan boord.',
  'description', 'Princess V53 met een warm en elegant interieur — ontworpen voor lange dagen op het water tussen Ibiza en Formentera, met ruimte voor intieme gezelschappen.',
  'meta_title', 'Charter Manbero II — Princess V53 in Ibiza',
  'meta_description', 'Charter Manbero II, een Princess V53 vanuit Marina Botafoc. Volle dag Ibiza en Formentera, alles inbegrepen.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'manbero-ii-princess-v53';

-- mazu
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Krachtig en beheerst varen, iedereen boeiend die haar kruist.',
  'description', 'Astondoa 80 met refit 2025 en nieuwe motoren uit 2024 — een Spaans vlaggenschip herboren voor het Ibiza-seizoen.',
  'meta_title', 'Charter Mazu — Astondoa 80 in Ibiza',
  'meta_description', 'Charter Mazu, een Astondoa 80 met refit 2025 en nieuwe motoren. Charter onder Spaanse vlag vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'mazu-astondoa-80';

-- sensation
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Een ervaring van intense en aangename emoties op zee.',
  'description', 'Kruissnelheid van 35 knopen op een Pershing van 22 meter — refit 2023, twee MTU''s van 2.000 pk, drie suites en een ontzilter aan boord.',
  'meta_title', 'Charter Sensation — Pershing 72 in Ibiza',
  'meta_description', 'Charter Sensation, een Pershing 72 van 22 m, 35 knopen kruissnelheid, drie suites en ontzilter. Pershing-charter vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'sensation-pershing-72';

-- belisa
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Slanke, prachtige lijnen, met een tijdloze elegantie die alle zintuigen prikkelt.',
  'description', 'Belisa is de maxi-open Mangusta in zijn meest gedistilleerde vorm — lang, laag, snel en met een afwerking die in stilte indruk maakt.',
  'meta_title', 'Charter Belisa — Mangusta 108 in Ibiza',
  'meta_description', 'Charter Belisa, een Mangusta 108 maxi-open van 32,9 m vanuit Marina Botafoc. 12 gasten, 10 aan boord ''s nachts, 36 knopen. Vanaf € 11.000 / dag + btw.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'belisa-mangusta-108';

-- eternity-44
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Een toevluchtsoord op zee, waar ruimte beleving wordt.',
  'description', 'De Arcadia 85 ruilt topsnelheid in voor zeer ruime, beglaasde interieurs, zonnepanelen en een sereniteit waar zowel catamarans als motorjachten jaloers op zijn.',
  'meta_title', 'Charter Eternity 44 — Arcadia 85 in Ibiza',
  'meta_description', 'Charter Eternity 44, een Arcadia 85 met beglaasde interieurs, zonnepanelen en uitzonderlijk comfort. Elegante charter vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'eternity-44-arcadia-85';

-- georgia
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Verfijning en distinctie, een jacht dat de gratie van de zee oproept.',
  'description', 'Sunseeker Predator 82 met refit 2025 — vier suites, hydraulisch platform en de onmiskenbare Predator-silhouet.',
  'meta_title', 'Charter Georgia — Sunseeker Predator 82 in Ibiza',
  'meta_description', 'Charter Georgia, een Sunseeker Predator 82 met refit 2025, vier suites en hydraulisch platform. Charter vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'georgia-sunseeker-predator-82';

-- invictus
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Sterk en krachtig, ze daagt de grenzen uit met haar onoverwinnelijke geest.',
  'description', 'Een Riva Rivale 52 met refit 2025 — het DNA van de Italiaanse day-boat doorgetrokken tot een echte charter met twee hutten en 37 knopen maximum.',
  'meta_title', 'Charter Invictus — Riva Rivale 52 in Ibiza',
  'meta_description', 'Charter Invictus, een Riva Rivale 52 met refit 2025, twee hutten en 37 knopen maximum. Riva-charter vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'invictus-riva-rivale-52';

-- number-9
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Sportieve, elegante lijnen voor een betoverende ervaring.',
  'description', 'Een Predator 72 met refit 2025 — drie hutten, hydraulisch platform en de Sunseeker-silhouet tegen een van de toegankelijkste prijzen van de vloot.',
  'meta_title', 'Charter Number 9 — Sunseeker Predator 72 in Ibiza',
  'meta_description', 'Charter Number 9, een Sunseeker Predator 72 met refit 2025 en drie hutten. Sportieve charter vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'number-9-sunseeker-predator-72';

-- ruby-tuesday
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'De essentie van luxe en passie die iedereen boeit.',
  'description', 'Princess V72 met refit 2022 en Caterpillar-dieselmotoren — 22 meter, drie suites, hydraulisch platform en ontzilter.',
  'meta_title', 'Charter Ruby Tuesday — Princess V72 in Ibiza',
  'meta_description', 'Charter Ruby Tuesday, een Princess V72 van 22 m met drie suites, Caterpillar-motoren en ontzilter. Charter vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'ruby-tuesday-princess-v72';

-- tranquility-iii
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Een zeldzame, kalmerende rust — vrede en sereniteit op hun best.',
  'description', 'Een Sunseeker Predator 68 van 21 meter — refit 2022 met volledige motorrevisie, hydraulisch platform en ontzilter.',
  'meta_title', 'Charter Tranquility III — Sunseeker Predator 68 in Ibiza',
  'meta_description', 'Charter Tranquility III, een Sunseeker Predator 68 van 21 m met refit 2022. Elegante charter vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'tranquility-iii-sunseeker-predator-68';

-- yolo
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Een oproep om elk moment te beleven met de intensiteit van de golven.',
  'description', 'Zeilcatamaran Sunreef 70+ in 2022 voor zijn eigenaar gebouwd — Starlink, 39 kW zonnepanelen, flybridge van 50 m² en vier dubbele suites.',
  'meta_title', 'Charter Yolo — Sunreef 70+ catamaran in Ibiza',
  'meta_description', 'Charter Yolo, een zeilcatamaran Sunreef 70+ met Starlink, zonne-energie en vier dubbele suites. Duurzame charter vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'yolo-sunreef-70';

-- black-jax
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Elegant, klassiek, veelzijdig — de hoogste uitdrukking van kwaliteit en uitzonderlijkheid.',
  'description', 'Sunseeker Predator 74 met een onderscheidende donkere romp. Drie hutten, hydraulisch platform en het Sunseeker-comfort in een van de meest herkenbare silhouetten van de haven.',
  'meta_title', 'Charter Black Jax — Sunseeker Predator 74 in Ibiza',
  'meta_description', 'Charter Black Jax, een Sunseeker Predator 74 met donkere romp en drie hutten. Charter vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'black-jax-sunseeker-predator-74';

-- django
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Een toegangspoort om afgelegen plekken te verkennen met stijl en functionaliteit.',
  'description', 'Noah 29 FB — een wendbare boot ontworpen om baaien te bereiken die voor grotere jachten ontoegankelijk zijn, met de elegantie en de details die u van een Sea Society-charter verwacht.',
  'meta_title', 'Charter Django — Noah 29 FB RIB in Ibiza',
  'meta_description', 'Charter Django, een wendbare Noah 29 FB RIB om de meest verborgen baaien van Ibiza en Formentera te verkennen. Charter vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'django-noah-29fb';

-- floppy
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Waar elk moment een eerbetoon wordt aan vrijheid en de verbinding met de zee.',
  'description', 'SACS Stratos 42 — een Italiaanse maxi-RIB die snelheid, ruimte en strakke stijl combineert. Ideaal voor gezelschappen die snel tussen baaien willen pendelen zonder comfort op te geven.',
  'meta_title', 'Charter Floppy — SACS Stratos 42 maxi-RIB in Ibiza',
  'meta_description', 'Charter Floppy, een Italiaanse SACS Stratos 42 maxi-RIB. Snelheid, ruimte en comfort voor een dag baaien-hoppen. Charter vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'floppy-sacs-stratos-42';

-- majestic
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Een verfijnde boot om met elegantie en sofisticatie te varen.',
  'description', 'VanDutch 40 — de meest herkenbare day-boat van de Middellandse Zee. Sculpturale lijnen, open dek en het onmiskenbare gevoel van een VanDutch aan het roer.',
  'meta_title', 'Charter Majestic — VanDutch 40 in Ibiza',
  'meta_description', 'Charter Majestic, een VanDutch 40 met sculpturale lijnen en open dek. De meest iconische day-boat vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'majestic-vandutch-40';

-- shaka-laka
update boats set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'tagline', 'Een naam die de golven oproept — een ontwerp van rust en uitmuntendheid.',
  'description', 'Princess V58 met een warm, elegant interieur — ontworpen voor lange dagen op het water tussen Ibiza en Formentera, in intiem gezelschap.',
  'meta_title', 'Charter Shaka Laka — Princess V58 in Ibiza',
  'meta_description', 'Charter Shaka Laka, een Princess V58 met warm interieur voor intieme gezelschappen. Charter vanuit Marina Botafoc.',
  'what_included', jsonb_build_array(
    'Professionele kapitein en bemanning',
    'Thuishaven Marina Botafoc',
    'Snorkeluitrusting',
    'Handdoeken en ligbedden',
    'Bose / premium audiosysteem',
    'Wifi aan boord'
  )
), true) where slug = 'shaka-laka-princess-v58';
