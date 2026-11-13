"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, LoaderCircle, Mail, MapPin, Phone, RotateCcw, Send } from "lucide-react";
import { business } from "@/config/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { trackEvent } from "@/lib/analytics";
import {
  CONTACT_FIELDS,
  CONTACT_MAX_LENGTH,
  PHONE_PREFIX,
  formatPhone,
  formatPhoneInput,
  normalizeContact,
  toTitleCase,
  validateContact,
  type ContactApiResponse,
  type ContactErrors,
  type ContactField,
  type ContactFormData,
} from "@/lib/contact";
import { RECAPTCHA_SITE_KEY, getRecaptchaToken, loadRecaptcha } from "@/lib/recaptcha";
import { contactFormMessage, whatsappUrl } from "@/lib/whatsapp";

type Field = ContactField;
type Errors = ContactErrors;

const EMPTY: ContactFormData = { nombre: "", email: "", telefono: "", comuna: "", problema: "" };

type Status =
  | { type: "idle" }
  | { type: "sending" }
  | { type: "sent" }
  | { type: "whatsapp" }
  | { type: "error"; message: string }
  | { type: "unavailable" };

/** Abre WhatsApp con el mensaje armado (respaldo si el envío por correo no está disponible). */
function openWhatsApp(data: ContactFormData): boolean {
  const url = whatsappUrl(contactFormMessage(data));
  if (!url) return false;
  // window.open con "noopener" siempre devuelve null; se anula opener manualmente.
  const win = window.open(url, "_blank");
  if (win) win.opener = null;
  else window.location.href = url; // Bloqueador de ventanas: abrir en la misma pestaña.
  return true;
}

const inputClass =
  "block w-full rounded-xl border border-line bg-mist/70 px-4 py-3 text-base text-ink placeholder:text-muted/70 transition-[border-color,background-color,box-shadow] duration-150 hover:border-electric/40 focus:border-electric focus:bg-white focus:outline-none focus:ring-4 focus:ring-electric/15 aria-[invalid=true]:border-red-600 aria-[invalid=true]:bg-red-50/40";

export function ContactForm() {
  const [data, setData] = useState<ContactFormData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [sent, setSent] = useState<ContactFormData | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Al confirmar el envío, lleva la vista y el foco a la confirmación.
  useEffect(() => {
    if (status.type !== "sent" || !successRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    successRef.current.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    successRef.current.focus({ preventScroll: true });
  }, [status.type]);

  const update = (field: Field, value: string) => {
    setData((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  /** Al salir del campo se corrige el formato (mayúsculas, minúsculas, espacios). */
  const tidy = (field: Field) => {
    setData((d) => {
      const v = d[field];
      const fixed =
        field === "nombre" || field === "comuna"
          ? toTitleCase(v)
          : field === "email"
            ? v.trim().toLowerCase()
            : field === "telefono"
              ? formatPhoneInput(v)
              : v.trim();
      return fixed === v ? d : { ...d, [field]: fixed };
    });
  };

  const fallbackToWhatsApp = (clean: ContactFormData) => {
    if (openWhatsApp(clean)) {
      trackEvent("form_submit", { channel: "whatsapp" });
      setStatus({ type: "whatsapp" });
    } else {
      setStatus({ type: "unavailable" });
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.type === "sending") return;

    const clean = normalizeContact(data);
    setData(clean);
    const found = validateContact(clean);
    setErrors(found);
    const firstInvalid = CONTACT_FIELDS.find((f) => found[f]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      setStatus({ type: "idle" });
      return;
    }

    // Sin reCAPTCHA configurado el servidor no acepta envíos: se usa WhatsApp.
    if (!RECAPTCHA_SITE_KEY) return fallbackToWhatsApp(clean);

    setStatus({ type: "sending" });
    try {
      const token = await getRecaptchaToken("contacto");
      const empresa = formRef.current?.querySelector<HTMLInputElement>('[name="empresa"]')?.value ?? "";
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...clean, empresa, token }),
      });
      const result = (await res.json().catch(() => null)) as ContactApiResponse | null;

      if (result?.ok) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'lead_formulario' });
        trackEvent("form_submit", { channel: "email" });
        setSent(clean);
        setData(EMPTY);
        setStatus({ type: "sent" });
        return;
      }
      if (result?.error === "not_configured") return fallbackToWhatsApp(clean);
      if (result?.error === "invalid" && result.fields) {
        setErrors(result.fields);
        setStatus({ type: "idle" });
        return;
      }
      setStatus({
        type: "error",
        message:
          result?.error === "captcha"
            ? "No pudimos verificar el envío."
            : "No pudimos enviar tu solicitud en este momento.",
      });
    } catch {
      setStatus({ type: "error", message: "No pudimos enviar tu solicitud en este momento." });
    }
  };

  const fieldProps = (field: Field) => ({
    id: `contacto-${field}`,
    name: field,
    value: data[field],
    maxLength: CONTACT_MAX_LENGTH[field],
    required: true,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby":
      [errors[field] && `contacto-${field}-error`, field === "problema" && "contacto-problema-ayuda"]
        .filter(Boolean)
        .join(" ") || undefined,
    onBlur: () => tidy(field),
  });

  const errorText = (field: Field) =>
    errors[field] ? (
      <p id={`contacto-${field}-error`} className="mt-1.5 text-sm text-red-700">
        {errors[field]}
      </p>
    ) : null;

  const label = (field: Field, text: string) => (
    <label htmlFor={`contacto-${field}`} className="mb-2 block text-sm font-medium text-navy">
      {text}
      <span className="text-red-600" aria-hidden="true">
        {" "}
        *
      </span>
    </label>
  );

  if (status.type === "sent" && sent) {
    const firstName = sent.nombre.split(" ")[0];
    const waUrl = whatsappUrl();
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-labelledby="envio-titulo"
        className="animate-pop relative overflow-hidden rounded-3xl bg-white p-7 text-center text-ink shadow-[0_30px_70px_-25px_rgba(0,0,0,0.6)] outline-none sm:p-10"
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-cyan to-electric" />

        <span aria-hidden="true" className="mx-auto inline-flex size-20 items-center justify-center rounded-full bg-emerald-50">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_10px_24px_-8px_rgba(5,150,105,0.7)]">
            <Check className="size-8" strokeWidth={3} />
          </span>
        </span>

        <h3 id="envio-titulo" className="mt-6 text-2xl font-semibold text-navy sm:text-[1.75rem]">
          ¡Solicitud enviada!
        </h3>
        <p className="mx-auto mt-3 max-w-sm leading-relaxed text-muted">
          Gracias{firstName ? `, ${firstName}` : ""}. Recibimos tu solicitud y te contactaremos al{" "}
          <strong className="font-semibold whitespace-nowrap text-navy">{formatPhone(sent.telefono)}</strong> para
          coordinar la visita.
        </p>

        <dl className="mx-auto mt-7 max-w-sm divide-y divide-line border-y border-line text-left text-[0.9375rem]">
          {[
            { icon: Phone, label: "Teléfono", value: formatPhone(sent.telefono) },
            { icon: Mail, label: "Correo", value: sent.email },
            { icon: MapPin, label: "Comuna", value: sent.comuna },
          ].map(({ icon: Icon, label: text, value }) => (
            <div key={text} className="flex items-center gap-3 py-3">
              <Icon className="size-[18px] shrink-0 text-electric" aria-hidden="true" />
              <dt className="w-20 shrink-0 text-muted">{text}</dt>
              <dd className="min-w-0 truncate font-medium text-navy">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-col items-center gap-4">
          {waUrl && (
            <p className="text-sm text-muted">
              ¿Es urgente?{" "}
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0f773f] underline-offset-4 hover:underline">
                Escríbenos por WhatsApp
              </a>
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              setSent(null);
              setStatus({ type: "idle" });
            }}
            className="btn-secondary min-h-11 px-5 text-sm"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Enviar otra solicitud
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onFocus={() => {
        // Carga reCAPTCHA al empezar a completar el formulario (no en la carga inicial).
        if (RECAPTCHA_SITE_KEY) loadRecaptcha().catch(() => {});
      }}
      noValidate
      aria-labelledby="formulario-titulo"
      className="relative overflow-hidden rounded-3xl bg-white p-6 text-ink shadow-[0_30px_70px_-25px_rgba(0,0,0,0.6)] sm:p-9"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-electric via-cyan to-electric" />
      <h3 id="formulario-titulo" className="text-xl font-semibold sm:text-2xl">
        Solicitar asistencia técnica
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Todos los campos son obligatorios. Te contactaremos al celular que indiques.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          {label("nombre", "Nombre y apellido")}
          <input
            {...fieldProps("nombre")}
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            placeholder="Ej.: María González"
            className={inputClass}
            onChange={(e) => update("nombre", e.target.value)}
          />
          {errorText("nombre")}
        </div>

        <div>
          {label("email", "Correo electrónico")}
          <input
            {...fieldProps("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="nombre@correo.cl"
            className={inputClass}
            onChange={(e) => update("email", e.target.value)}
          />
          {errorText("email")}
        </div>

        <div>
          {label("telefono", "Celular")}
          {/* "+56 9" fijo: solo se escriben los 8 dígitos y se formatea como 1234 5678. */}
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-line pr-3 pl-4 text-base font-medium text-navy"
            >
              {PHONE_PREFIX}
            </span>
            <input
              {...fieldProps("telefono")}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="1234 5678"
              // Permite pegar o autocompletar "+56 9 1234 5678"; el formato lo deja en "1234 5678".
              maxLength={20}
              aria-label={`Celular, después de ${PHONE_PREFIX}`}
              className={`${inputClass} pl-[5.75rem] tracking-wide`}
              onChange={(e) => update("telefono", formatPhoneInput(e.target.value))}
            />
          </div>
          {errorText("telefono")}
        </div>

        <div className="sm:col-span-2">
          {label("comuna", "Comuna")}
          <input
            {...fieldProps("comuna")}
            type="text"
            autoComplete="address-level2"
            autoCapitalize="words"
            placeholder="Comuna donde está el equipo"
            className={inputClass}
            onChange={(e) => update("comuna", e.target.value)}
          />
          {errorText("comuna")}
        </div>

        <div className="sm:col-span-2">
          {label("problema", "Equipo, marca y problema")}
          <p id="contacto-problema-ayuda" className="-mt-1 mb-2 text-sm text-muted">
            Indica el tipo de equipo, la marca y qué falla presenta.
          </p>
          <textarea
            {...fieldProps("problema")}
            rows={4}
            placeholder="Ej.: Lavadora LG de carga frontal. No centrifuga y queda con agua."
            className={inputClass}
            onChange={(e) => update("problema", e.target.value)}
          />
          {errorText("problema")}
        </div>
      </div>

      {/* Campo trampa para bots: oculto para personas y lectores de pantalla. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contacto-empresa">Empresa</label>
        <input id="contacto-empresa" name="empresa" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status.type === "sending"}
        className="btn-primary mt-7 min-h-13 w-full text-base disabled:cursor-wait disabled:opacity-80"
      >
        {status.type === "sending" ? (
          <>
            <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
            Enviando…
          </>
        ) : (
          <>
            <Send className="size-5" aria-hidden="true" />
            Enviar solicitud
          </>
        )}
      </button>

      {RECAPTCHA_SITE_KEY && (
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Protegido por reCAPTCHA. Se aplican la{" "}
          <a className="underline hover:text-electric" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Política de privacidad
          </a>{" "}
          y las{" "}
          <a className="underline hover:text-electric" href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
            Condiciones del servicio
          </a>{" "}
          de Google.
        </p>
      )}

      <div aria-live="polite" className="mt-4 text-sm">
        {status.type === "whatsapp" && (
          <p className="rounded-xl bg-ice px-4 py-3 text-navy">
            Abrimos WhatsApp con tu mensaje. Para completar la solicitud, presiona <strong>Enviar</strong> en
            WhatsApp.
          </p>
        )}
        {status.type === "error" && (
          <div role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-amber-900">
            <p>{status.message} Puedes enviarnos la misma consulta por WhatsApp:</p>
            {whatsappUrl() && (
              <button
                type="button"
                onClick={() => fallbackToWhatsApp(normalizeContact(data))}
                className="mt-2 inline-flex items-center gap-2 font-semibold text-[#0f773f] underline-offset-4 hover:underline"
              >
                <WhatsAppIcon className="size-4" />
                Enviar por WhatsApp
              </button>
            )}
          </div>
        )}
        {status.type === "unavailable" && (
          <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-amber-900">
            El envío del formulario aún no está disponible.
            {business.phoneDisplay && business.phone ? (
              <>
                {" "}
                Llámanos al{" "}
                <a className="font-medium underline" href={`tel:+${business.phone}`}>
                  {business.phoneDisplay}
                </a>
                .
              </>
            ) : (
              " Inténtalo nuevamente más tarde."
            )}
          </p>
        )}
      </div>
    </form>
  );
}
