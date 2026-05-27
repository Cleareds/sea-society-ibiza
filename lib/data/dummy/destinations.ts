import type { Destination } from "../types";

const img = (name: string) => `/sea-society/site/${name}.webp`;

export const destinations: Destination[] = [
  {
    id: "d-01",
    slug: "ibiza",
    title: "Ibiza",
    intro: "The home port. The reason you came.",
    body: "Most charters start and end here — Botafoc Marina, ten minutes from the airport. The west coast (Cala d'Hort, Cala Salada, Es Vedra) is the postcard. The north (Portinatx, Benirràs, Cala Xarraca) is quieter and more dramatic. Your captain will read the day's forecast and choose.",
    heroImage: img("dest-ibiza"),
    gallery: [
      { src: img("dest-ibiza"), alt: "Es Vedra rock from the water at golden hour" },
      { src: img("dest-ibiza-2"), alt: "Ibiza coastline approach" },
      { src: img("dest-ibiza-3"), alt: "Swimming with Es Vedra in the distance" },
    ],
    highlights: ["Es Vedra & Cala d'Hort", "Cala Salada", "Atlantis & Cap des Falcó", "Benirràs sunset"],
    isPublished: true,
  },
  {
    id: "d-02",
    slug: "formentera",
    title: "Formentera",
    intro: "Twenty minutes south. A different colour of water.",
    body: "Formentera is the reason most groups end up booking a second day. S'Espalmador's shallows are the most photographed water in the Balearics. Illetes' long beach is best at lunch from anchor. Es Caló's restaurants — Juan y Andrea, Beso Beach — are the right call before turning back.",
    heroImage: img("dest-formentera"),
    gallery: [
      { src: img("dest-formentera"), alt: "Yacht anchored off a Formentera sandbank" },
      { src: img("dest-formentera-2"), alt: "Swim stop under Formentera cliffs" },
    ],
    highlights: ["S'Espalmador", "Illetes beach", "Es Caló & Beso Beach", "Cala Saona at sunset"],
    isPublished: true,
  },
  {
    id: "d-03",
    slug: "mallorca",
    title: "Mallorca",
    intro: "A long crossing or an overnight stop on a multi-day charter.",
    body: "Mallorca is six to eight hours west, which makes it a multi-day proposition. The south-west coast (Es Trenc, Cabrera) is the typical destination — quiet, dramatic, and a different feel from Ibiza. Best as part of a three- or four-night charter.",
    heroImage: img("dest-mallorca"),
    gallery: [
      { src: img("dest-mallorca"), alt: "Yacht running parallel to Mallorca's cliffs" },
      { src: img("dest-mallorca-2"), alt: "Open water crossing from Ibiza to Mallorca" },
    ],
    highlights: ["Cabrera National Park", "Es Trenc", "Port d'Andratx", "Cala Pi"],
    isPublished: true,
  },
];
