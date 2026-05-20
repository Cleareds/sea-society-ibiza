/**
 * Curated Unsplash photo IDs used as placeholders for boats and ambient imagery.
 * Each photo's photographer + source URL is in IMAGE_CREDITS.md (to be added with
 * the imagery commit). Swap to real photography by replacing the URL strings.
 *
 * Pattern: `https://images.unsplash.com/photo-{id}?w=1920&q=80&auto=format&fit=crop`
 */
const u = (id: string, w = 1920, q = 80) =>
  `https://images.unsplash.com/${id}?w=${w}&q=${q}&auto=format&fit=crop`;

export const photo = {
  // Hero / ambient
  esVedra: u("photo-1599582909646-2acb38c1f87d"),
  ibizaSea: u("photo-1507525428034-b723cf961d3e"),
  yachtAerial: u("photo-1542856391-010fb87dcfed"),
  formentera: u("photo-1502136969935-8d8eef54d77b"),
  sunsetSailing: u("photo-1505228395891-9a51e7e86bf6"),
  marina: u("photo-1565008447742-97f6f38c985c"),

  // Boats (rotated across the 19 seeds)
  motorYachtAerial: u("photo-1605281317010-fe5ffe798166"),
  motorYachtSea: u("photo-1567899378494-47b22a2ae96a"),
  speedboatTurquoise: u("photo-1540541338287-41700207dee6"),
  classicRiva: u("photo-1469474968028-56623f02e42e"),
  sailingYacht: u("photo-1500627964684-141351970a7f"),
  catamaran: u("photo-1571423320068-2e75dd6e8a96"),
  superyacht: u("photo-1606759847091-3ddf1d6e1e9d"),
  dayBoatCove: u("photo-1605281317010-fe5ffe798166"),
  flybridge: u("photo-1567899378494-47b22a2ae96a"),

  // Interiors / detail
  yachtDeck: u("photo-1542092979-bb83a91b97c7"),
  yachtInterior: u("photo-1540541338287-41700207dee6"),
  yachtBow: u("photo-1469474968028-56623f02e42e"),

  // Destinations / lifestyle
  formenteraBeach: u("photo-1473496169904-658ba7c44d8a"),
  mallorcaCove: u("photo-1502136969935-8d8eef54d77b"),
  champagne: u("photo-1551214012-84f95e060dee"),
  snorkeling: u("photo-1583212292454-1fe6229603b7"),
} as const;

export type PhotoKey = keyof typeof photo;
