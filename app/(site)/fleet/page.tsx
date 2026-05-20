import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Section } from "@/components/site/Section";
import { BoatCard } from "@/components/site/BoatCard";
import { FilterBar } from "@/components/site/FilterBar";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, fleetItemListLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getBoats } from "@/lib/data";
import { photo } from "@/lib/data/dummy/images";
import type { Boat, BoatType } from "@/lib/data/types";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "The Fleet",
    description:
      "Explore 19 luxury yachts available for charter from Botafoc Marina, Ibiza. Filter by type, capacity, brand and budget.",
    path: "/fleet",
  });
}

interface SearchParams {
  type?: string;
  minGuests?: string;
  minLength?: string;
  maxLength?: string;
  maxPrice?: string;
  brand?: string;
}

function applyFilters(boats: Boat[], sp: SearchParams): Boat[] {
  return boats.filter((b) => {
    if (sp.type && b.type !== (sp.type as BoatType)) return false;
    if (sp.minGuests && b.guests < Number(sp.minGuests)) return false;
    if (sp.minLength && b.lengthM < Number(sp.minLength)) return false;
    if (sp.maxLength && b.lengthM > Number(sp.maxLength)) return false;
    if (sp.maxPrice && b.priceFrom > Number(sp.maxPrice)) return false;
    if (sp.brand && b.brand.toLowerCase() !== sp.brand.toLowerCase()) return false;
    return true;
  });
}

export default async function FleetPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const allBoats = await getBoats();
  const boats = applyFilters(allBoats, sp);
  const brands = Array.from(new Set(allBoats.map((b) => b.brand))).sort();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Fleet", path: "/fleet" },
          ]),
          fleetItemListLd(boats),
        ]}
      />

      {/* Page hero */}
      <section className="relative isolate h-[55vh] min-h-[420px] w-full overflow-hidden bg-[var(--color-primary)]">
        <Image
          src={photo.yachtAerial}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/55" />
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-14 text-white md:px-10 md:pb-20">
          <div className="mx-auto w-full max-w-(--spacing-container-max)">
            <Breadcrumb
              items={[
                { name: "Home", href: "/" },
                { name: "Fleet" },
              ]}
            />
            <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight md:text-7xl">
              The fleet
            </h1>
            <p className="mt-3 max-w-xl text-base text-white/80 md:text-lg">
              Nineteen boats based at Botafoc Marina. Filter to the right one — or send us the
              shape of your day and we will choose for you.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <FilterBar brands={brands} />

        <p className="mt-6 text-sm text-[var(--color-on-surface-variant)]">
          {boats.length} {boats.length === 1 ? "boat" : "boats"} matching
        </p>

        {boats.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-[var(--color-outline)] p-10 text-center">
            <p className="font-serif text-2xl text-[var(--color-on-surface)]">
              No boats match those filters.
            </p>
            <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
              Reset the filters or send us a message — we will suggest something from the wider fleet.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild variant="outline">
                <Link href="/fleet">Reset filters</Link>
              </Button>
              <Button asChild>
                <Link href="/contact">Send a message</Link>
              </Button>
            </div>
          </div>
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {boats.map((b, i) => (
              <li key={b.id}>
                <BoatCard boat={b} priority={i < 3} />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
