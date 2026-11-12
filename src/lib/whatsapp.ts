import { business } from "@/config/site";
import { formatPhone, type ContactFormData } from "@/lib/contact";

/** Mensaje inicial genérico para los botones de WhatsApp. */
export const DEFAULT_WHATSAPP_MESSAGE = `Hola ${business.name}, quiero consultar por un servicio técnico.`;

/**
 * Construye el enlace de WhatsApp con un mensaje prellenado.
 * Devuelve null si el número aún no está configurado, para que la interfaz
 * pueda ofrecer una alternativa en vez de un enlace roto.
 */
export function whatsappUrl(message: string = DEFAULT_WHATSAPP_MESSAGE): string | null {
  if (!business.whatsapp) return null;
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function serviceMessage(inquiry: string): string {
  return `Hola ${business.name}, quiero consultar por ${inquiry}.`;
}

export function contactFormMessage(data: ContactFormData): string {
  return [
    `Hola ${business.name}, quiero solicitar asistencia técnica.`,
    "",
    `*Nombre:* ${data.nombre}`,
    `*Correo:* ${data.email}`,
    `*Teléfono:* ${formatPhone(data.telefono)}`,
    `*Comuna:* ${data.comuna}`,
    `*Equipo y problema:* ${data.problema}`,
  ].join("\n");
}

export function telUrl(): string | null {
  return business.phone ? `tel:+${business.phone}` : null;
}
