import type { Experience } from "../types";
import { photo } from "./images";

export const experiences: Experience[] = [
  {
    id: "x-01",
    slug: "day-trips",
    title: "Day trips",
    intro: "Eight hours, your group, your route. The classic Ibiza charter.",
    body: "Most of our charters are full-day trips — typically 9 or 10 hours from Botafoc Marina, anchored somewhere quiet by mid-morning, lunch on board, swim, and back into port by sunset. Routes are written with your captain on the morning, based on wind and what kind of day you want.",
    heroImage: photo.ibizaSea,
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: "x-02",
    slug: "sunset-cruises",
    title: "Sunset cruises",
    intro: "A short, deliberate three-hour run along the west coast.",
    body: "Sunset cruises leave Botafoc around 18:00 and turn for home as the last light catches Es Vedra. The best photographs of your trip almost always come from this window. Available on most boats in the fleet.",
    heroImage: photo.sunsetSailing,
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: "x-03",
    slug: "multi-day-balearic",
    title: "Multi-day Balearic",
    intro: "Two to seven nights — Ibiza, Formentera, Mallorca, Cabrera.",
    body: "Longer charters open up the rest of the Balearics. Three nights is the sweet spot for an Ibiza → Formentera → Mallorca loop. Seven nights gets you Cabrera, the most untouched anchorages in the Mediterranean, and proper time at sea.",
    heroImage: photo.formentera,
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: "x-04",
    slug: "special-occasions",
    title: "Special occasions",
    intro: "Birthdays, proposals, anniversaries, corporate days.",
    body: "We organise milestone birthdays (often with a chef and stewardess), proposals (we'll cue the champagne so you don't have to think about it), and corporate days for teams of up to twenty across two boats. Tell us what the day needs to be and we'll handle the rest.",
    heroImage: photo.champagne,
    sortOrder: 4,
    isPublished: true,
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
