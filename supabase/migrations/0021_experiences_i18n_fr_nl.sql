-- French + Dutch translations for the 4 experiences. Mirrors the
-- ES translations in 0016 — title, intro, body, long_description,
-- meta_title, meta_description.

-- ============================================================
-- FRENCH
-- ============================================================

update experiences set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'title', 'Sorties à la journée',
  'intro', 'Huit heures, votre groupe, votre route. Le charter classique d''Ibiza.',
  'body', 'La plupart de nos charters sont des sorties à la journée — généralement 9 ou 10 heures depuis Marina Botafoc, à l''ancre dans une crique tranquille en milieu de matinée, déjeuner à bord, baignades et retour au port au coucher du soleil. Les itinéraires se calent avec votre capitaine le matin, selon le vent et la journée que vous voulez vivre.',
  'long_description', 'Une journée typique démarre à Marina Botafoc vers 10 h. Votre capitaine a la météo du vent du matin et un itinéraire en tête, mais rien n''est figé — vous décidez. Les classiques de la côte sud comme Cala d''Hort, Atlantis et Es Vedrà sont les plus demandés ; avec un ponant marqué, nous remontons vers le nord, à Cala Salada et Portinatx. Le déjeuner est servi à bord vers 14 h, généralement à l''ancre dans une crique tranquille, et l''après-midi est pour la baignade, le paddle, les jouets nautiques ou simplement s''asseoir à la proue avec quelque chose de frais. Retour au port au coucher du soleil.',
  'meta_title', 'Sorties à la journée depuis Ibiza — Sea Society',
  'meta_description', 'Charter privé d''une journée complète depuis Marina Botafoc. 9 à 10 heures, votre groupe, votre route. Ibiza, Formentera et les plus belles criques.'
), true) where slug = 'day-trips';

update experiences set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'title', 'Croisières au coucher du soleil',
  'intro', 'Une courte sortie délibérée de trois heures sur la côte ouest.',
  'body', 'Les croisières au coucher du soleil partent de Botafoc vers 18 h et virent quand la dernière lumière atteint Es Vedrà. Les plus belles photos du voyage sortent souvent dans cette fenêtre. Disponible sur la majorité des bateaux de la flotte.',
  'long_description', 'Les croisières au coucher du soleil sont le charter le plus court que nous proposons — et celui que nous recommandons le plus aux invités qui découvrent. Au départ de Botafoc juste après 18 h, vous serez face à la côte ouest à temps pour voir la lumière passer de l''or au rose puis à l''indigo derrière Es Vedrà. Le bateau jette l''ancre brièvement pour une baignade et un verre de cava, puis met le cap maison le long de la côte illuminée. Trois heures du début à la fin. Le champagne, la charcuterie et l''option photographe sont très demandés sur ce format.',
  'meta_title', 'Croisières au coucher du soleil à Ibiza — Sea Society',
  'meta_description', 'Trois heures de côte ouest et coucher de soleil derrière Es Vedrà. Champagne, baignade rapide et retour à Botafoc à la lumière indigo.'
), true) where slug = 'sunset-cruises';

update experiences set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'title', 'Plusieurs jours aux Baléares',
  'intro', 'De deux à sept nuits — Ibiza, Formentera, Majorque, Cabrera.',
  'body', 'Les charters plus longs ouvrent le reste des Baléares. Trois nuits, c''est le sweet spot pour une route Ibiza → Formentera → Majorque. Sept nuits incluent Cabrera, les mouillages les plus préservés de Méditerranée et du vrai temps de mer.',
  'long_description', 'Un charter de trois nuits fait habituellement Ibiza → Formentera → sud de Majorque, avec des mouillages de nuit et des dîners à terre. Cinq nuits ajoutent Cabrera — parc national, sans bateaux commerciaux et l''eau la plus claire des Baléares. Sept nuits offrent du vrai temps en mer, avec l''option d''atteindre la côte sud de Minorque. Yachts jusqu''à 30 m, équipage de deux ou trois, tous les repas à bord (ou à terre, à vous de choisir). L''itinéraire se construit au rythme de votre groupe.',
  'meta_title', 'Charters de plusieurs jours aux Baléares — Sea Society',
  'meta_description', 'De deux à sept nuits en yacht à travers Ibiza, Formentera, Majorque et Cabrera. Équipage complet, tous les repas, itinéraire sur mesure.'
), true) where slug = 'multi-day-balearic';

update experiences set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{fr}', jsonb_build_object(
  'title', 'Expériences Sea Society',
  'intro', 'Anniversaires, demandes en mariage, anniversaires de couple, journées corporate.',
  'body', 'Nous organisons des anniversaires marquants (souvent avec chef et hôtesse), des demandes en mariage (nous préparons le champagne pour que vous n''ayez pas à y penser), et des journées corporate pour des équipes jusqu''à vingt personnes sur deux bateaux. Décrivez-nous la journée que vous voulez et nous nous occupons du reste.',
  'long_description', 'Les anniversaires marquants incluent souvent un chef privé à bord, une hôtesse pour la journée et des compositions florales de notre fleuriste de confiance à Ibiza. Les demandes en mariage sont plus intimes — la plupart des clients veulent le moment au coucher du soleil face à Es Vedrà, avec une bouteille fraîche prête et le capitaine qui regarde ailleurs. Les journées corporate se font sur des bateaux plus grands ou répartis sur deux yachts en convoi, avec un déjeuner structuré à bord et l''option d''accoster à un beach club l''après-midi. Décrivez-nous la journée que vous voulez et nous nous occupons du reste.',
  'meta_title', 'Expériences Sea Society — Ibiza',
  'meta_description', 'Demandes en mariage, anniversaires et événements corporate en yacht. Chef privé, hôtesse, fleurs et tous les détails organisés.'
), true) where slug = 'special-occasions';

-- ============================================================
-- DUTCH
-- ============================================================

update experiences set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'title', 'Dagtochten',
  'intro', 'Acht uur, uw gezelschap, uw route. De klassieke Ibiza-charter.',
  'body', 'De meeste van onze charters zijn dagtochten — meestal 9 à 10 uur vanuit Marina Botafoc, voor anker in een rustige baai rond het midden van de ochtend, lunch aan boord, zwemmen en terug naar de haven bij zonsondergang. De routes leggen we ''s ochtends vast met uw kapitein, op basis van de wind en de dag die u wenst.',
  'long_description', 'Een typische dag begint in Marina Botafoc rond 10 u. Uw kapitein heeft de ochtendweersvoorspelling en een route in gedachten, maar niets staat vast — de keuze is aan u. Klassiekers van de zuidkust zoals Cala d''Hort, Atlantis en Es Vedrà zijn het meest gevraagd; bij een sterke westenwind trekken we noordwaarts, naar Cala Salada en Portinatx. De lunch wordt rond 14 u aan boord geserveerd, doorgaans voor anker in een rustige baai, en de namiddag is voor zwemmen, sup, watersport-speelgoed of gewoon op de voorplecht zitten met iets fris. We keren bij zonsondergang terug naar de haven.',
  'meta_title', 'Dagtochten vanuit Ibiza — Sea Society',
  'meta_description', 'Privécharter van een volledige dag vanuit Marina Botafoc. 9 tot 10 uur, uw gezelschap, uw route. Ibiza, Formentera en de mooiste baaien.'
), true) where slug = 'day-trips';

update experiences set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'title', 'Zonsondergangcruises',
  'intro', 'Een korte, doelgerichte tocht van drie uur langs de westkust.',
  'body', 'Zonsondergangcruises vertrekken rond 18 u vanuit Botafoc en keren wanneer het laatste licht Es Vedrà bereikt. De mooiste foto''s van de reis ontstaan vaak in dit venster. Beschikbaar op het merendeel van de boten uit de vloot.',
  'long_description', 'Zonsondergangcruises zijn de kortste charter die we aanbieden — en degene die we eerstegasten het meest aanraden. Vertrek vanuit Botafoc net na 18 u, en u staat voor de westkust precies op tijd om het licht te zien overgaan van goud naar roze naar indigo achter Es Vedrà. De boot gaat kort voor anker voor een duik en een glas cava, en koerst dan terug langs de verlichte kust. Drie uur van begin tot eind. Champagne, charcuterie en de fotograaf-add-on zijn op dit format heel populair.',
  'meta_title', 'Zonsondergangcruises in Ibiza — Sea Society',
  'meta_description', 'Drie uur westkust en zonsondergang achter Es Vedrà. Champagne, snelle duik en terug naar Botafoc in indigolicht.'
), true) where slug = 'sunset-cruises';

update experiences set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'title', 'Meerdaagse charters Balearen',
  'intro', 'Van twee tot zeven nachten — Ibiza, Formentera, Mallorca, Cabrera.',
  'body', 'De langere charters openen de rest van de Balearen. Drie nachten is de sweet spot voor een route Ibiza → Formentera → Mallorca. Zeven nachten omvatten Cabrera, de meest ongerepte ankerplaatsen van de Middellandse Zee en echte zeetijd.',
  'long_description', 'Een charter van drie nachten doet meestal Ibiza → Formentera → zuiden van Mallorca, met overnachtingsankerplaatsen en diners aan land. Vijf nachten voegen Cabrera toe — nationaal park, geen commerciële boten en het helderste water van de Balearen. Zeven nachten geven echte zeetijd, met de mogelijkheid de zuidkust van Menorca te bereiken. Jachten tot 30 m, bemanning van twee of drie, alle maaltijden aan boord (of aan land, u kiest). De route wordt gebouwd op het ritme van uw gezelschap.',
  'meta_title', 'Meerdaagse charters door de Balearen — Sea Society',
  'meta_description', 'Van twee tot zeven nachten per jacht door Ibiza, Formentera, Mallorca en Cabrera. Volledige bemanning, alle maaltijden, route op maat.'
), true) where slug = 'multi-day-balearic';

update experiences set i18n = jsonb_set(coalesce(i18n, '{}'::jsonb), '{nl}', jsonb_build_object(
  'title', 'Sea Society-ervaringen',
  'intro', 'Verjaardagen, huwelijksaanzoeken, jubilea, bedrijfsdagen.',
  'body', 'We organiseren bijzondere verjaardagen (vaak met chef en hostess), huwelijksaanzoeken (we zorgen voor de champagne zodat u daar niet aan hoeft te denken), en bedrijfsdagen voor teams tot twintig personen op twee boten. Vertel ons hoe de dag moet aanvoelen en we regelen de rest.',
  'long_description', 'Bijzondere verjaardagen omvatten meestal een privéchef aan boord, een hostess voor de dag en bloemstukken van onze vaste florist in Ibiza. Huwelijksaanzoeken zijn intiemer — de meeste klanten willen het moment bij zonsondergang voor Es Vedrà, met een gekoelde fles klaar en een kapitein die discreet wegkijkt. Bedrijfsdagen gebeuren op grotere boten of verdeeld over twee jachten in konvooi, met een gestructureerde lunch aan boord en de optie ''s namiddags aan te leggen bij een beach club. Vertel ons hoe de dag moet aanvoelen en we regelen de rest.',
  'meta_title', 'Sea Society-ervaringen — Ibiza',
  'meta_description', 'Huwelijksaanzoeken, verjaardagen, jubilea en bedrijfsevenementen per jacht. Privéchef, hostess, bloemen en alle details geregeld.'
), true) where slug = 'special-occasions';
