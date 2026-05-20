import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

interface Props {
  number: string;
  boatName?: string;
  className?: string;
  variant?: "sticky" | "inline";
  label?: string;
}

export function WhatsAppCTA({
  number,
  boatName,
  className,
  variant = "sticky",
  label = "Book via WhatsApp",
}: Props) {
  const href = whatsappLink({ number, boatName });

  if (variant === "inline") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#1FAD52]",
          className,
        )}
      >
        <MessageCircle aria-hidden className="h-5 w-5" />
        {label}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "fixed bottom-5 right-5 z-40 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-medium text-white shadow-xl transition-transform hover:scale-[1.02] md:bottom-6 md:right-6",
        className,
      )}
    >
      <MessageCircle aria-hidden className="h-5 w-5" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
