/**
 * Formulario de contacto: tipos, normalización y validación compartidos por
 * el navegador (ContactForm) y el servidor (/api/contacto).
 */

export interface ContactFormData {
  nombre: string;
  email: string;
  /** Solo los 8 dígitos que van después de "+56 9" (puede venir con espacios). */
  telefono: string;
  comuna: string;
  /** Debe incluir el tipo de equipo, la marca y la falla. */
  problema: string;
}

export type ContactField = keyof ContactFormData;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const CONTACT_FIELDS: ContactField[] = ["nombre", "email", "telefono", "comuna", "problema"];

/** Largos máximos de lo que se puede escribir (también se aplican en el servidor). */
export const CONTACT_MAX_LENGTH: Record<ContactField, number> = {
  nombre: 80,
  email: 120,
  telefono: 9, // "1234 5678"
  comuna: 60,
  problema: 1000,
};

export const PHONE_PREFIX = "+56 9";

/** Palabras que van en minúscula dentro de un nombre propio (salvo al inicio). */
const LOWERCASE_WORDS = new Set(["de", "del", "la", "las", "los", "y", "e", "van", "von", "da", "do", "dos"]);

/** "maría JOSÉ de la fuente" → "María José de la Fuente". */
export function toTitleCase(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("es-CL")
    .split(" ")
    .map((word, i) =>
      i > 0 && LOWERCASE_WORDS.has(word)
        ? word
        : word.replace(/(^|[-'])(\p{L})/gu, (_, sep: string, letter: string) => sep + letter.toLocaleUpperCase("es-CL")),
    )
    .join(" ");
}

/** Deja solo los 8 dígitos del celular. Acepta que la persona pegue "+56 9 …" o "9 …". */
export function phoneDigits(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("569") && digits.length > 8) digits = digits.slice(3);
  else if (digits.startsWith("9") && digits.length === 9) digits = digits.slice(1);
  return digits.slice(0, 8);
}

/** Formato del campo mientras se escribe: "12345678" → "1234 5678". */
export function formatPhoneInput(value: string): string {
  const d = phoneDigits(value);
  return d.length > 4 ? `${d.slice(0, 4)} ${d.slice(4)}` : d;
}

/** Número completo para mostrar: "+56 9 1234 5678". */
export function formatPhone(value: string): string {
  return `${PHONE_PREFIX} ${formatPhoneInput(value)}`;
}

/** Número en formato internacional sin espacios: "56912345678". */
export function phoneE164Digits(value: string): string {
  return `569${phoneDigits(value)}`;
}

/** Rechaza números que claramente no existen: repetidos, correlativos o el del ejemplo. */
function isPlausiblePhone(digits: string): boolean {
  if (!/^\d{8}$/.test(digits)) return false;
  if (/^(\d)\1{7}$/.test(digits)) return false;
  const asc = "0123456789012345";
  const desc = "9876543210987654";
  if (asc.includes(digits) || desc.includes(digits)) return false;
  if (/^(\d{2})\1{3}$/.test(digits) || /^(\d{4})\1$/.test(digits)) return false;
  return true;
}

const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i;

/** Normaliza los datos antes de validar y enviar (cliente y servidor). */
export function normalizeContact(data: ContactFormData): ContactFormData {
  return {
    nombre: toTitleCase(data.nombre),
    email: data.email.trim().toLowerCase(),
    telefono: formatPhoneInput(data.telefono),
    comuna: toTitleCase(data.comuna),
    problema: data.problema.trim(),
  };
}

/** Validación compartida. Recibe datos ya normalizados. */
export function validateContact(data: ContactFormData): ContactErrors {
  const errors: ContactErrors = {};

  if (data.nombre.length < 2 || !/\p{L}/u.test(data.nombre)) errors.nombre = "Ingresa tu nombre.";

  if (!data.email) errors.email = "Ingresa tu correo.";
  else if (!EMAIL_RE.test(data.email)) errors.email = "Ingresa un correo válido, por ejemplo nombre@correo.cl.";

  const digits = phoneDigits(data.telefono);
  if (!digits) errors.telefono = "Ingresa tu celular.";
  else if (digits.length !== 8) errors.telefono = "El celular debe tener 8 dígitos después de +56 9.";
  else if (!isPlausiblePhone(digits)) errors.telefono = "Ingresa un número de celular real.";

  if (data.comuna.length < 3) errors.comuna = "Indica tu comuna.";

  if (data.problema.length < 15)
    errors.problema = "Indica el equipo, la marca y qué falla presenta (mínimo 15 caracteres).";

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
