/**
 * Build a wa.me deep link with a pre-encoded message.
 *
 * `number` accepts any input — we strip non-digits and drop any leading 0/plus,
 * matching what wa.me expects.
 */
export interface WhatsappLinkOptions {
  number: string;
  message?: string;
  boatName?: string;
  page?: string;
}

const GENERIC = "Hi Sea Society, I'd like to enquire about a charter.";
const perBoat = (name: string) =>
  `Hi Sea Society, I'm interested in the ${name}. Could you tell me more about availability?`;

export function whatsappLink({ number, message, boatName, page }: WhatsappLinkOptions): string {
  const e164 = number.replace(/\D/g, "").replace(/^0+/, "");
  const text =
    message ?? (boatName ? perBoat(boatName) : GENERIC) + (page ? ` (from ${page})` : "");
  return `https://wa.me/${e164}?text=${encodeURIComponent(text)}`;
}
