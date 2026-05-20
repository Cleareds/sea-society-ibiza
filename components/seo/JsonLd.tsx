interface JsonLdProps {
  data: unknown | unknown[];
}

/**
 * Server-rendered JSON-LD. Pass a single object or an array of objects;
 * each emits its own <script type="application/ld+json"> tag.
 */
export function JsonLd({ data }: JsonLdProps) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
