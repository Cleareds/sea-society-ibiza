import type { Destination } from "../types";
import { photo } from "./images";

export const destinations: Destination[] = [
  {
    id: "d-01",
    slug: "ibiza",
    title: "Ibiza",
    intro: "The home port. The reason you came.",
    body: "Most charters start and end here — Botafoc Marina, ten minutes from the airport. The west coast (Cala d'Hort, Cala Salada, Es Vedra) is the postcard. The north (Portinatx, Benirràs, Cala Xarraca) is quieter and more dramatic. Your captain will read the day's forecast and choose.",
    heroImage: photo.esVedra,
    gallery: [
      { src: photo.esVedra, alt: "Es Vedra at sunset" },
      { src: photo.ibizaSea, alt: "Ibiza coastline" },
      { src: photo.marina, alt: "Botafoc Marina" },
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
    heroImage: photo.formenteraBeach,
    gallery: [
      { src: photo.formenteraBeach, alt: "Formentera beach" },
      { src: photo.formentera, alt: "Formentera anchorage" },
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
    heroImage: photo.mallorcaCove,
    gallery: [
      { src: photo.mallorcaCove, alt: "Mallorca cove" },
      { src: photo.sunsetSailing, alt: "Sailing toward Mallorca at sunset" },
    ],
    highlights: ["Cabrera National Park", "Es Trenc", "Port d'Andratx", "Cala Pi"],
    isPublished: true,
  },
];
