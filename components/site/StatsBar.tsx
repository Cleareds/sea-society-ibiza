interface Stat {
  label: string;
  value: string;
}

interface StatsBarProps {
  stats: Stat[];
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[var(--color-outline-variant)] md:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col items-center justify-center bg-[var(--color-surface-container-low)] px-4 py-8 text-center"
        >
          <dt className="order-2 mt-2 text-[11px] uppercase tracking-[0.22em] text-[var(--color-on-surface-variant)]">
            {s.label}
          </dt>
          <dd className="order-1 font-serif text-3xl text-[var(--color-on-surface)] md:text-4xl">
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
