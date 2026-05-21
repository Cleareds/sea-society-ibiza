import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface Props {
  source: string;
  className?: string;
}

/**
 * Renders editor-supplied markdown content with the site's typography.
 * Headings use Fraunces, paragraphs Inter; lists, links and emphasis all
 * pick up the design tokens. Intentionally minimal — no custom plugins,
 * no HTML passthrough.
 */
export function MarkdownBody({ source, className }: Props) {
  return (
    <div
      className={cn(
        "max-w-2xl space-y-4 text-base leading-relaxed text-[var(--color-on-surface-variant)]",
        "[&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-[var(--color-on-surface)] [&_h2]:mt-10",
        "[&_h3]:font-serif [&_h3]:text-2xl [&_h3]:text-[var(--color-on-surface)] [&_h3]:mt-8",
        "[&_p]:text-[var(--color-on-surface-variant)]",
        "[&_a]:text-[var(--color-primary)] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:no-underline",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1",
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1",
        "[&_strong]:text-[var(--color-on-surface)]",
        "[&_em]:italic",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-primary)] [&_blockquote]:pl-4 [&_blockquote]:italic",
        "[&_code]:rounded [&_code]:bg-[var(--color-surface-container)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm",
        className,
      )}
    >
      <ReactMarkdown>{source}</ReactMarkdown>
    </div>
  );
}
