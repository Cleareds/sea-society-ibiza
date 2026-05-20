import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Design system (dev)",
  robots: { index: false, follow: false },
};

const swatches: Array<{ name: string; value: string; tone?: "light" | "dark" }> = [
  { name: "primary", value: "var(--color-primary)" },
  { name: "primary-container", value: "var(--color-primary-container)" },
  { name: "secondary", value: "var(--color-secondary)" },
  { name: "secondary-container", value: "var(--color-secondary-container)" },
  { name: "surface", value: "var(--color-surface)", tone: "light" },
  { name: "surface-container", value: "var(--color-surface-container)", tone: "light" },
  { name: "on-surface", value: "var(--color-on-surface)" },
  { name: "outline", value: "var(--color-outline)" },
];

export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 space-y-20">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
          Internal
        </p>
        <h1 className="mt-2 font-serif text-5xl text-[var(--color-on-surface)]">
          Design system
        </h1>
        <p className="mt-3 max-w-2xl text-base text-[var(--color-on-surface-variant)]">
          Visual reference for tokens and primitives. Not linked from the site, noindex/nofollow.
        </p>
      </header>

      <section aria-labelledby="ds-type">
        <h2 id="ds-type" className="font-serif text-3xl">Typography</h2>
        <div className="mt-6 space-y-4">
          <p className="font-serif text-7xl leading-none">Display 7xl — Fraunces</p>
          <p className="font-serif text-5xl">Display 5xl — Fraunces</p>
          <h3 className="font-serif text-3xl">Heading 3 — Fraunces</h3>
          <p className="text-lg">Body lg — Inter, 18px, line-height 1.6</p>
          <p className="text-base">Body base — Inter, 16px</p>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
            Label / small caps — Inter
          </p>
        </div>
      </section>

      <section aria-labelledby="ds-color">
        <h2 id="ds-color" className="font-serif text-3xl">Color</h2>
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {swatches.map((s) => (
            <li key={s.name} className="overflow-hidden rounded-xl border border-[var(--color-outline-variant)]">
              <div className="h-24 w-full" style={{ background: s.value }} aria-hidden />
              <div className="p-3">
                <p className="font-mono text-xs">{s.name}</p>
                <p className="font-mono text-[10px] text-[var(--color-on-surface-variant)]">{s.value}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ds-buttons">
        <h2 id="ds-buttons" className="font-serif text-3xl">Buttons</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="primary">Book now</Button>
          <Button variant="secondary">Explore the fleet</Button>
          <Button variant="outline">Plan your charter</Button>
          <Button variant="ghost">Learn more</Button>
          <Button variant="whatsapp">
            <MessageCircle aria-hidden /> WhatsApp us
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section aria-labelledby="ds-forms">
        <h2 id="ds-forms" className="font-serif text-3xl">Form fields</h2>
        <div className="mt-6 grid max-w-xl gap-6">
          <div className="grid gap-2">
            <Label htmlFor="ds-name">Your name</Label>
            <Input id="ds-name" placeholder="Lauren" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ds-msg">Message</Label>
            <Textarea id="ds-msg" placeholder="Tell us about your charter…" />
          </div>
        </div>
      </section>

      <section aria-labelledby="ds-accordion">
        <h2 id="ds-accordion" className="font-serif text-3xl">Accordion</h2>
        <Accordion type="single" collapsible className="mt-6 max-w-2xl">
          <AccordionItem value="a">
            <AccordionTrigger>What does a private charter include?</AccordionTrigger>
            <AccordionContent>
              A professional captain, fuel, snorkel equipment, towels, a cooler with ice and Bluetooth audio.
              We tailor add-ons — catering, water toys, photographer — to your day.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Where do we depart from?</AccordionTrigger>
            <AccordionContent>
              All charters depart from Botafoc Marina in Ibiza Town, a short ride from the airport and most resorts.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  );
}
