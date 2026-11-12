"use client";

import { business } from "@/config/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { trackEvent } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/whatsapp";

/** Botón fijo de WhatsApp (esquina inferior derecha), siempre visible y sin animaciones. */
export function FloatingWhatsApp() {
  const href = whatsappUrl();
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escribir a ${business.name} por WhatsApp`}
      onClick={() => trackEvent("whatsapp_click", { location: "flotante" })}
      className="fixed right-4 bottom-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-[#128c4b] text-white shadow-[0_10px_30px_-6px_rgba(18,140,75,0.6)] ring-4 ring-white transition-[transform,background-color] duration-200 hover:scale-105 hover:bg-[#0f773f] sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
