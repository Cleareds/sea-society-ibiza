import type { Settings } from "../types";

export const settings: Settings = {
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+32 479 38 80 46",
  whatsappDefaultMessage:
    "Hi Sea Society, I'd like to enquire about a charter.\nNumber of guests: \nDate(s): \nYacht type or budget: ",
  instagramUrl: "https://www.instagram.com/seasociety.ibiza/",
  instagramHandle: "@seasociety.ibiza",
  facebookUrl: "https://www.facebook.com/profile.php?id=61590214507668",
  tiktokUrl: "https://www.tiktok.com/@sea.society.ibiza",
  email: "hello@seasocietyibiza.com",
  phone: "+32 479 38 80 46",
  address: "Botafoc Marina, 07800 Ibiza, Balearic Islands, Spain",
  stats: [
    { label: "Luxury yachts", value: "19" },
    { label: "Years of expertise", value: "20+" },
    { label: "Marina, Ibiza", value: "Botafoc" },
    { label: "Fleet brands", value: "Riva · Pershing" },
  ],
  heroHeadline: "Ibiza is different from the sea.",
  heroSub: "One platform. Endless experiences at sea.",
  testimonials: [
    {
      id: "t-01",
      quote: "The most perfect day of our Ibiza trip. We found coves we didn't know existed.",
      author: "Sophie T.",
      location: "London",
    },
    {
      id: "t-02",
      quote: "Seamless from first message to last sunset. The captain knew every hidden corner.",
      author: "Marc V.",
      location: "Amsterdam",
    },
    {
      id: "t-03",
      quote: "My 40th birthday. We are still talking about it months later.",
      author: "Anna K.",
      location: "Munich",
    },
  ],
  about: {
    heroEyebrow: "The story",
    heroTitle: "A platform built on twenty years at the dock.",
    heroSub:
      "Sea Society Ibiza is by Ibimar — a Botafoc Marina operation that has spent two decades getting the small things right.",
    body: `## Charter is a service, not a marketplace.

Most charter platforms exist to broker your booking and step aside. We exist because the boat, the captain and the marina are already ours — what you book is what we operate. That is the only honest way to deliver a day at sea in Ibiza.

### One fleet, one number

Most charter sites are aggregators with no skin in the game. Sea Society is the customer-facing layer of Ibimar's actual fleet — booking, captain, boat, all the same conversation.

### Twenty years in the marina

Ibimar has operated out of Botafoc since the early 2000s. The captains know which coves fill up, which restaurants will pick up the phone on the day, which weather pattern means lunch in Cala d'Hort.

### Brokered, not bartered

We do not list boats we cannot operate. Every yacht on the site can be taken out tomorrow if the weather and your dates align.

## Botafoc

Marina Botafoc sits across the bay from Dalt Vila, ten minutes from the airport and a five-minute walk from Talamanca. Every charter departs from here. Your captain shares a pin the morning of, which is the only logistics you have to think about.`,
  },
  contact: {
    heroEyebrow: "Get in touch",
    heroTitle: "Your charter starts with a message.",
    heroSub: "Send the dates and group — we will come back within a few hours with availability.",
    body: `### Or message directly

For dates within seven days, WhatsApp gets the fastest answer.

We respond within a few hours during the season (April–October), within a day off-season.`,
  },
  aboutI18n: {},
  contactI18n: {},
  journeyImages: Array.from({ length: 18 }, (_, i) => ({
    src: `/sea-society/site/instagram/journey-${i + 1}.webp`,
  })),
};
