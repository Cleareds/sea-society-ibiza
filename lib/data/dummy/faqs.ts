import type { Faq } from "../types";

export const faqs: Faq[] = [
  {
    id: "f-01",
    question: "How do I book?",
    answer:
      "Send us a WhatsApp or fill in the enquiry form on this site. We respond within a few hours with availability, a tailored quote and a route suggestion based on your dates and group.",
    category: "Booking",
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: "f-02",
    question: "What is included in the price?",
    answer:
      "All charters include a professional captain, fuel, snorkel equipment, a cooler with ice, Bluetooth audio, towels and sun loungers. Larger yachts include stewardess service and chef on board.",
    category: "What's included",
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: "f-03",
    question: "Where do we depart from?",
    answer:
      "All charters depart from Botafoc Marina in Ibiza Town, a short ride from the airport and most resorts. Your captain will share a WhatsApp pin on the morning.",
    category: "Logistics",
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: "f-04",
    question: "What about food and drinks?",
    answer:
      "Most groups bring their own provisions or pre-order from one of our preferred kitchens (we can arrange delivery to the boat). For full charters and longer trips a chef on board is an option.",
    category: "Onboard",
    sortOrder: 4,
    isPublished: true,
  },
  {
    id: "f-05",
    question: "Can we visit Formentera?",
    answer:
      "Yes — Formentera is roughly twenty minutes south of Ibiza and the most common destination for a full-day charter. S'Espalmador, Illetes and Es Caló are the typical stops.",
    category: "Routes",
    sortOrder: 5,
    isPublished: true,
  },
  {
    id: "f-06",
    question: "Is there a security deposit?",
    answer:
      "Yes, the security deposit varies by boat (typically €1,500–€10,000) and is held against accidental damage. Fully refundable after the charter if no incidents occur.",
    category: "Booking",
    sortOrder: 6,
    isPublished: true,
  },
  {
    id: "f-07",
    question: "What if the weather is bad?",
    answer:
      "Captain's call: if conditions are unsafe we will rebook the charter to another day in the season, or offer a refund. We never sail in conditions we wouldn't take our families out in.",
    category: "Booking",
    sortOrder: 7,
    isPublished: true,
  },
  {
    id: "f-08",
    question: "Are children welcome?",
    answer:
      "Of course. Most of our charters include families. Life jackets in children's sizes are on every boat; let us know your group composition and we'll match you to a suitable yacht.",
    category: "Onboard",
    sortOrder: 8,
    isPublished: true,
  },
];
