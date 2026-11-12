import type { ReactNode } from "react";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappUrl } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  message?: string;
  /** Sección desde la que se hace clic, para analítica. */
  location: string;
  className?: string;
  children: ReactNode;
  showIcon?: boolean;
}

/**
 * Botón de WhatsApp con medición. Si el número aún no está configurado,
 * dirige al formulario de contacto en lugar de generar un enlace roto.
 */
export function WhatsAppButton({
  message,
  location,
  className = "btn-whatsapp",
  children,
  showIcon = true,
}: WhatsAppButtonProps) {
  const href = whatsappUrl(message);
  const content = (
    <>
      {showIcon && <WhatsAppIcon className="size-5 shrink-0" />}
      {children}
    </>
  );

  if (!href) {
    return (
      <a href="#contacto" className={className}>
        {content}
      </a>
    );
  }

  return (
    <TrackedLink href={href} event="whatsapp_click" eventParams={{ location }} className={className}>
      {content}
    </TrackedLink>
  );
}
