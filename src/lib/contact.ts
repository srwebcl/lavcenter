import { appliances, brands } from "@/config/site";
import type { ContactFormData } from "@/lib/whatsapp";

export type ContactField = keyof ContactFormData;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const CONTACT_FIELDS: ContactField[] = [
  "nombre",
  "telefono",
  "comuna",
  "electrodomestico",
  "marca",
  "problema",
];

/** Largos máximos (también se aplican en el servidor). */
export const CONTACT_MAX_LENGTH: Record<ContactField, number> = {
  nombre: 80,
  telefono: 20,
  comuna: 60,
  electrodomestico: 40,
  marca: 40,
  problema: 1000,
};

/** Opciones válidas de "marca" en el formulario. */
export const BRAND_OPTIONS = [...brands.map((b) => b.name), "Otra marca", "No sé la marca"];

/** Validación compartida por el formulario (cliente) y el endpoint (servidor). */
export function validateContact(data: ContactFormData): ContactErrors {
  const errors: ContactErrors = {};
  if (data.nombre.trim().length < 2) errors.nombre = "Ingresa tu nombre.";
  const phoneDigits = data.telefono.replace(/\D/g, "");
  if (phoneDigits.length < 8 || phoneDigits.length > 12)
    errors.telefono = "Ingresa un teléfono válido, por ejemplo +56 9 1234 5678.";
  if (data.comuna.trim().length < 2) errors.comuna = "Indica tu comuna.";
  if (!(appliances as string[]).includes(data.electrodomestico))
    errors.electrodomestico = "Selecciona el tipo de electrodoméstico.";
  if (!BRAND_OPTIONS.includes(data.marca)) errors.marca = "Selecciona la marca.";
  if (data.problema.trim().length < 10)
    errors.problema = "Describe brevemente el problema (mínimo 10 caracteres).";

  for (const field of CONTACT_FIELDS) {
    if (!errors[field] && data[field].length > CONTACT_MAX_LENGTH[field])
      errors[field] = `Máximo ${CONTACT_MAX_LENGTH[field]} caracteres.`;
  }
  return errors;
}

/** Respuesta del endpoint /api/contacto. */
export type ContactApiResponse =
  | { ok: true }
  | {
      ok: false;
      error: "not_configured" | "invalid" | "captcha" | "send_failed" | "bad_request";
      fields?: ContactErrors;
    };
