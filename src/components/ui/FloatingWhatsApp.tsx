"use client";

import { useEffect, useState } from "react";
import { business } from "@/config/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { trackEvent } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Botón fijo de WhatsApp (esquina inferior derecha), sin animaciones.
 * Se oculta mientras el formulario de contacto está en pantalla para no
 * tapar el botón de envío ni duplicar la llamada a la acción. En móvil
 * también se oculta mientras se ve el CTA del hero, que ocupa todo el ancho.
 */
export function FloatingWhatsApp() {
  const [overContact, setOverContact] = useState(false);
  const [overHeroCta, setOverHeroCta] = useState(false);
  const hidden = overContact || overHeroCta;
  const href = whatsappUrl();

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const contact = document.getElementById("contacto");
    if (contact) {
      const o = new IntersectionObserver(([e]) => setOverContact(e.isIntersecting), { threshold: 0.15 });
      o.observe(contact);
      observers.push(o);
    }

    const heroCta = document.getElementById("hero-cta");
    const mobile = window.matchMedia("(max-width: 767px)");
    if (heroCta) {
      const o = new IntersectionObserver(([e]) => setOverHeroCta(mobile.matches && e.isIntersecting));
      o.observe(heroCta);
      observers.push(o);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escribir a ${business.name} por WhatsApp`}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      onClick={() => trackEvent("whatsapp_click", { location: "flotante" })}
      className={`fixed right-4 bottom-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-[#128c4b] text-white shadow-[0_10px_30px_-6px_rgba(18,140,75,0.6)] ring-4 ring-white transition-[opacity,transform,background-color] duration-200 hover:scale-105 hover:bg-[#0f773f] sm:right-6 sm:bottom-6 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
