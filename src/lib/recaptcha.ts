/**
 * Google reCAPTCHA v3 en el cliente.
 * El script se carga solo cuando la persona empieza a usar el formulario,
 * para no afectar la carga inicial de la página.
 */

export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

interface Grecaptcha {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

let loading: Promise<Grecaptcha> | null = null;

export function loadRecaptcha(): Promise<Grecaptcha> {
  if (!RECAPTCHA_SITE_KEY) return Promise.reject(new Error("reCAPTCHA no configurado"));
  if (loading) return loading;

  loading = new Promise<Grecaptcha>((resolve, reject) => {
    const done = () => window.grecaptcha!.ready(() => resolve(window.grecaptcha!));
    if (window.grecaptcha) return done();

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`;
    script.async = true;
    script.onload = done;
    script.onerror = () => {
      loading = null;
      script.remove();
      reject(new Error("No se pudo cargar reCAPTCHA"));
    };
    document.head.appendChild(script);
  });
  return loading;
}

export async function getRecaptchaToken(action: string): Promise<string> {
  const grecaptcha = await loadRecaptcha();
  return grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
}
