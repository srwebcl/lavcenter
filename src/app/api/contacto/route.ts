import { business } from "@/config/site";
import {
  CONTACT_FIELDS,
  CONTACT_MAX_LENGTH,
  validateContact,
  type ContactApiResponse,
} from "@/lib/contact";
import type { ContactFormData } from "@/lib/whatsapp";

/**
 * POST /api/contacto
 * 1. Verifica origen, tipo y tamaño de la solicitud.
 * 2. Valida los campos (mismas reglas que el formulario).
 * 3. Verifica el token de Google reCAPTCHA v3 (acción "contacto" y puntaje mínimo).
 * 4. Envía la solicitud por correo con la API de Resend.
 *
 * Las claves solo se leen aquí (servidor). Si falta alguna variable, responde
 * 503 "not_configured" y el formulario ofrece WhatsApp: nunca se simula un envío.
 */

const MAX_BODY_BYTES = 10_000;
const RECAPTCHA_ACTION = "contacto";

function reply(status: number, body: ContactApiResponse) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Quita saltos de línea y caracteres de control (asunto y campos de una línea). */
const singleLine = (value: string) => value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();

/** Número para wa.me: agrega 56 a celulares chilenos escritos sin código de país. */
function whatsappDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 9 && digits.startsWith("9") ? `56${digits}` : digits;
}

async function verifyRecaptcha(token: string, secret: string, ip: string | null) {
  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.5");
  const params = new URLSearchParams({ secret, response: token });
  if (ip) params.set("remoteip", ip);

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: params,
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return false;
  const result = (await res.json()) as {
    success?: boolean;
    action?: string;
    score?: number;
    hostname?: string;
    "error-codes"?: string[];
  };
  const passed =
    result.success === true &&
    result.action === RECAPTCHA_ACTION &&
    typeof result.score === "number" &&
    result.score >= (Number.isFinite(minScore) ? minScore : 0.5);
  if (!passed) {
    // Diagnóstico sin datos personales: códigos de Google, puntaje y dominio.
    console.warn(
      `[contacto] reCAPTCHA rechazado: success=${result.success} score=${result.score} action=${result.action} hostname=${result.hostname} errores=${(result["error-codes"] ?? []).join(",")}`,
    );
  }
  return passed;
}

function buildEmail(data: ContactFormData) {
  const rows: [string, string][] = [
    ["Nombre", data.nombre],
    ["Teléfono", data.telefono],
    ["Comuna", data.comuna],
    ["Electrodoméstico", data.electrodomestico],
    ["Marca", data.marca],
  ];
  const wa = whatsappDigits(data.telefono);

  const html = `<!doctype html><html><body style="margin:0;background:#f5f9fc;font-family:Arial,Helvetica,sans-serif;color:#102c45">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="background:#062f62;color:#ffffff;padding:20px 24px;font-size:18px;font-weight:bold">Nueva solicitud de asistencia técnica</td></tr>
<tr><td style="padding:20px 24px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px">
${rows
  .map(
    ([label, value]) =>
      `<tr><td style="padding:6px 0;color:#5b6b7b;width:150px;vertical-align:top">${label}</td><td style="padding:6px 0;font-weight:bold">${escapeHtml(value)}</td></tr>`,
  )
  .join("\n")}
</table>
<p style="margin:18px 0 6px;color:#5b6b7b;font-size:15px">Descripción del problema</p>
<p style="margin:0;font-size:15px;line-height:1.5;white-space:pre-wrap">${escapeHtml(data.problema)}</p>
${wa ? `<p style="margin:24px 0 0"><a href="https://wa.me/${wa}" style="display:inline-block;background:#128c4b;color:#ffffff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:bold">Responder por WhatsApp</a></p>` : ""}
</td></tr>
<tr><td style="padding:14px 24px;background:#f5f9fc;color:#5b6b7b;font-size:12px">Enviado desde el formulario del sitio web de ${business.name}.</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    "Nueva solicitud de asistencia técnica",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Descripción del problema:",
    data.problema,
  ].join("\n");

  const subject = singleLine(
    `Solicitud: ${data.electrodomestico} ${data.marca} · ${data.comuna} · ${data.nombre}`,
  ).slice(0, 150);

  return { html, text, subject };
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.CONTACT_EMAIL_FROM;
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!apiKey || !to || !from || !secret || !process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    return reply(503, { ok: false, error: "not_configured" });
  }

  // Solo se aceptan envíos desde el propio sitio.
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    if (!origin || !host || new URL(origin).host !== host) {
      return reply(403, { ok: false, error: "bad_request" });
    }
  } catch {
    return reply(403, { ok: false, error: "bad_request" });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return reply(415, { ok: false, error: "bad_request" });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return reply(413, { ok: false, error: "bad_request" });

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return reply(400, { ok: false, error: "bad_request" });
  }

  // Campo trampa: invisible para personas. Si viene con datos, se descarta en silencio.
  if (typeof body.empresa === "string" && body.empresa.trim() !== "") {
    return reply(200, { ok: true });
  }

  const data = Object.fromEntries(
    CONTACT_FIELDS.map((field) => {
      const value = typeof body[field] === "string" ? (body[field] as string) : "";
      const clean = field === "problema" ? value.trim() : singleLine(value);
      return [field, clean.slice(0, CONTACT_MAX_LENGTH[field] + 1)];
    }),
  ) as unknown as ContactFormData;

  const fields = validateContact(data);
  if (Object.keys(fields).length > 0) return reply(422, { ok: false, error: "invalid", fields });

  const token = typeof body.token === "string" ? body.token : "";
  if (!token || token.length > 4000) return reply(400, { ok: false, error: "captcha" });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  try {
    if (!(await verifyRecaptcha(token, secret, ip))) {
      return reply(403, { ok: false, error: "captcha" });
    }
  } catch {
    return reply(502, { ok: false, error: "captcha" });
  }

  const { html, text, subject } = buildEmail(data);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((e) => e.trim()).filter(Boolean),
        subject,
        html,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      // Solo el código de estado: no se registran datos personales ni claves.
      console.error(`[contacto] Resend respondió ${res.status}`);
      return reply(502, { ok: false, error: "send_failed" });
    }
  } catch {
    console.error("[contacto] No se pudo conectar con Resend");
    return reply(502, { ok: false, error: "send_failed" });
  }

  return reply(200, { ok: true });
}
