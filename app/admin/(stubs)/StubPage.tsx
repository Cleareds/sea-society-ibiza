interface Props {
  title: string;
  blurb?: string;
}

export function StubPage({ title, blurb }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
        Phase 2
      </p>
      <h1 className="font-serif text-4xl">{title}</h1>
      <p className="max-w-xl text-sm text-[var(--color-on-surface-variant)]">
        {blurb ??
          "This section will be enabled in Phase 2. Boats CRUD and Enquiries are the only fully wired admin surfaces at launch."}
      </p>
    </div>
  );
}
