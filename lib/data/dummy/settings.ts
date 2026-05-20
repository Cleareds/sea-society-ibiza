import type { Settings } from "../types";

export const settings: Settings = {
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+34600000000",
  whatsappDefaultMessage: "Hi Sea Society, I'd like to enquire about a charter.",
  instagramUrl: "https://instagram.com/seasocietyibiza",
  instagramHandle: "@seasocietyibiza",
  email: "hello@seasocietyibiza.com",
  phone: "+34 600 000 000",
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
};
