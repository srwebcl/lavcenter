import Script from "next/script";
import { analyticsConfig } from "@/lib/analytics";

/**
 * Carga UNA sola vía de medición para evitar etiquetas duplicadas:
 * 1. Si existe NEXT_PUBLIC_GTM_ID → solo Google Tag Manager
 *    (GA4 y Google Ads se configuran dentro del contenedor).
 * 2. Si no, y existe GA4 o Google Ads → gtag.js una única vez, configurando ambos IDs.
 * 3. Si no hay IDs → no se carga ningún script.
 */
export function Analytics() {
  const { gtmId, ga4Id, adsId } = analyticsConfig;

  if (gtmId) {
    return (
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
      </Script>
    );
  }

  const primaryId = ga4Id || adsId;
  if (!primaryId) return null;

  const configs = [ga4Id, adsId]
    .filter(Boolean)
    .map((id) => `gtag('config','${id}');`)
    .join("");

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());${configs}`}
      </Script>
    </>
  );
}

/** iframe de respaldo de GTM para navegadores sin JavaScript. */
export function AnalyticsNoScript() {
  const { gtmId } = analyticsConfig;
  if (!gtmId) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
