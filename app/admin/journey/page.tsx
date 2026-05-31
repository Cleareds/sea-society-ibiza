import { getSettings } from "@/lib/data";
import { JourneyTilesForm } from "./JourneyTilesForm";

export const dynamic = "force-dynamic";

export default async function AdminJourneyPage() {
  const settings = await getSettings();
  const tiles = settings.journeyImages ?? [];
  // Pad to 18 slots so admins always see the full grid (empty slots
  // fall back to the hardcoded defaults on the public site).
  const padded = Array.from({ length: 18 }, (_, i) => ({
    src: tiles[i]?.src ?? `/sea-society/site/journey-${i + 1}.webp`,
  }));

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
          Brand
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[var(--color-on-surface)]">
          Journey tiles
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--color-on-surface-variant)]">
          18 images that make up the &ldquo;Follow our society&rdquo; wall
          on the homepage and /about page. Desktop shows all 18 in a
          6&times;3 grid; mobile shows the first 6 in a 2&times;3 grid.
          Each tile renders as a square via <code>object-cover</code>, so
          upload anything &mdash; the crop is automatic. Clearing a tile
          falls back to the default <code>journey-{`{n}`}.webp</code>.
        </p>
      </header>

      <JourneyTilesForm tiles={padded} />
    </div>
  );
}
