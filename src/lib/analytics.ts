/**
 * Medición: GA4, Google Tag Manager y conversiones de Google Ads.
 * El contenedor de GTM de LAVCENTER (GTM-MJRMCF64) es el valor por defecto; se puede
 * sobrescribir con NEXT_PUBLIC_GTM_ID. GA4 y Google Ads se configuran dentro de GTM.
 */

export const analyticsConfig = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "GTM-MJRMCF64",
  ga4Id: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  adsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "",
  adsLabels: {
    whatsapp_click: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP || "",
    phone_click: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_PHONE || "",
    form_submit: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_FORM || "",
  } as Record<string, string>,
};

export type AnalyticsEvent = "whatsapp_click" | "phone_click" | "form_submit" | "service_inquiry";

type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Registra un evento:
 * - Siempre lo envía a `dataLayer` (GTM puede usarlo como activador de evento personalizado).
 * - Si se usa gtag.js directo (sin GTM), lo envía a GA4 y dispara la conversión de Google Ads
 *   correspondiente cuando hay una etiqueta de conversión configurada.
 */
export function trackEvent(event: AnalyticsEvent, params: Params = {}): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });

  // Con GTM, las etiquetas de GA4 y Ads se configuran dentro del contenedor.
  if (analyticsConfig.gtmId || typeof window.gtag !== "function") return;

  window.gtag("event", event, params);

  const label = analyticsConfig.adsLabels[event];
  if (analyticsConfig.adsId && label) {
    window.gtag("event", "conversion", { send_to: `${analyticsConfig.adsId}/${label}` });
  }
}
