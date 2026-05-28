import type { Experience } from "../types";

const img = (name: string) => `/sea-society/site/${name}.webp`;

export const experiences: Experience[] = [
  {
    id: "x-01",
    slug: "day-trips",
    title: "Day trips",
    intro: "Eight hours, your group, your route. The classic Ibiza charter.",
    body: "Most of our charters are full-day trips — typically 9 or 10 hours from Botafoc Marina, anchored somewhere quiet by mid-morning, lunch on board, swim, and back into port by sunset. Routes are written with your captain on the morning, based on wind and what kind of day you want.",
    longDescription:
      "A typical day starts at Botafoc Marina around 10:00. Your captain has the morning's wind forecast and a route in mind, but nothing is fixed — the call is yours. South-coast classics like Cala d'Hort, Atlantis and Es Vedra are the most-asked-for; on a strong west wind we'll head north toward Cala Salada and Portinatx instead. Lunch is served on board around 14:00, usually at anchor in a quiet cove, and the afternoon is for swimming, paddleboarding, water toys, or simply sitting on the bow with a glass of something cold. We're back in port by sunset.",
    duration: "9–10 hours",
    groupSize: "Up to 12 guests",
    gallery: [],
    heroImage: img("exp-day-trips"),
    sortOrder: 1,
    isPublished: true,
    metaTitle: "Ibiza day charters — 9 hour private yacht trips",
    metaDescription:
      "Full-day private yacht charters from Botafoc Marina, Ibiza. Up to 12 guests, captain + crew, lunch on board, route built around your group.",
  },
  {
    id: "x-02",
    slug: "sunset-cruises",
    title: "Sunset cruises",
    intro: "A short, deliberate three-hour run along the west coast.",
    body: "Sunset cruises leave Botafoc around 18:00 and turn for home as the last light catches Es Vedra. The best photographs of your trip almost always come from this window. Available on most boats in the fleet.",
    longDescription:
      "Sunset cruises are the shortest charter we offer — and the one we recommend most for first-time guests. Leaving Botafoc just after 18:00, you'll be off the west coast in time to watch the light go from gold to pink to indigo behind Es Vedra. The boat anchors briefly for a swim and a glass of cava, then heads home along the lit-up shoreline. Three hours, end to end. Champagne, charcuterie, and the photographer add-on are all popular on this format.",
    duration: "3 hours",
    groupSize: "Up to 12 guests",
    gallery: [],
    heroImage: img("exp-sunset"),
    sortOrder: 2,
    isPublished: true,
    metaTitle: "Ibiza sunset cruise — private yacht at golden hour",
    metaDescription:
      "Three-hour private sunset yacht cruise from Ibiza Town. Es Vedra, west-coast anchorage, swim stop, champagne on board.",
  },
  {
    id: "x-03",
    slug: "multi-day-balearic",
    title: "Multi-day Balearic",
    intro: "Two to seven nights — Ibiza, Formentera, Mallorca, Cabrera.",
    body: "Longer charters open up the rest of the Balearics. Three nights is the sweet spot for an Ibiza → Formentera → Mallorca loop. Seven nights gets you Cabrera, the most untouched anchorages in the Mediterranean, and proper time at sea.",
    longDescription:
      "A three-night charter typically runs Ibiza → Formentera → south Mallorca, with overnight anchorages and dinner ashore. Five nights adds Cabrera — a national park, no commercial boats, and the clearest water in the Balearics. Seven nights gives you proper time at sea, with options to push further to Menorca's south coast. Yachts up to 30m, crew of two or three, all meals on board (or ashore, your call). Itinerary is built around your group's pace.",
    duration: "2–7 nights",
    groupSize: "Up to 10 guests overnight",
    gallery: [],
    heroImage: img("exp-multi-day"),
    sortOrder: 3,
    isPublished: true,
    metaTitle: "Multi-day Balearic yacht charters — Ibiza, Mallorca, Cabrera",
    metaDescription:
      "Two-to-seven-night private yacht charters across the Balearics. Crewed, fully catered, itinerary built around your group.",
  },
  {
    id: "x-04",
    slug: "special-occasions",
    title: "Special occasions",
    intro: "Birthdays, proposals, anniversaries, corporate days.",
    body: "We organise milestone birthdays (often with a chef and stewardess), proposals (we'll cue the champagne so you don't have to think about it), and corporate days for teams of up to twenty across two boats. Tell us what the day needs to be and we'll handle the rest.",
    longDescription:
      "Milestone birthdays usually mean a private chef on board, a stewardess for the day, and florals from our preferred florist in Ibiza Town. Proposals are quieter — most clients want the moment timed at golden hour off Es Vedra, with a chilled bottle ready and the captain looking the other way. Corporate days run on bigger boats or split across two yachts moving in convoy, with a structured lunch on board and the option of a beach club docking in the afternoon. Tell us what the day needs to be and we'll handle the rest.",
    duration: "Tailored",
    groupSize: "Up to 20 across two boats",
    gallery: [],
    heroImage: img("exp-special"),
    sortOrder: 4,
    isPublished: true,
    metaTitle: "Special occasions on the water — Ibiza yacht charter",
    metaDescription:
      "Birthdays, proposals, anniversaries and corporate days on a private yacht in Ibiza. Chef, florals, photographer — all arranged.",
  },
];

export const addOns: Array<{ title: string; description: string }> = [
  {
    title: "Catering",
    description:
      "From a simple platter from Es Boldado to a private chef on board, sourced from our preferred kitchens in Ibiza Town and Marina Botafoc.",
  },
  {
    title: "Water toys",
    description:
      "Sea bobs, jet-skis, inflatable slides, wakeboard, paddleboards. Bookable per day, delivered to the boat.",
  },
  {
    title: "Photographer",
    description:
      "Drone and on-board photography for the day, edited photos delivered within 72 hours. Especially worth it for milestone days.",
  },
  {
    title: "Florals",
    description: "Onboard florals for proposals, anniversaries, and milestone birthdays.",
  },
  {
    title: "Champagne packages",
    description:
      "From a magnum of house Brut to a full vintage Krug service, with appropriate glassware.",
  },
];
