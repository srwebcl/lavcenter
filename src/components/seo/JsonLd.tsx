import { business, coverage, services } from "@/config/site";
import { seo } from "@/config/metadata";
import { siteUrl } from "@/lib/site-url";

/**
 * Datos estructurados LocalBusiness.
 * Solo se publican cuando existe al menos un medio de contacto real
 * (teléfono o WhatsApp). Los campos opcionales se incluyen únicamente
 * si están confirmados en src/config/site.ts.
 */
export function JsonLd() {
  const telephone = business.phone ?? business.whatsapp;
  if (!telephone) return null;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#negocio`,
    name: business.name,
    description: seo.description,
    url: siteUrl,
    logo: `${siteUrl}/brand/lavcenter-logo-horizontal.png`,
    image: `${siteUrl}/images/hero-tecnico-electrodomesticos.webp`,
    telephone: `+${telephone}`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios técnicos",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.description },
      })),
    },
  };

  if (business.email) data.email = business.email;
  if (coverage.areas.length > 0) {
    data.areaServed = coverage.areas.map((name) => ({ "@type": "City", name }));
  } else {
    data.areaServed = { "@type": "Country", name: business.country.name };
  }

  return (
    <script
      type="application/ld+json"
      // JSON generado desde configuración interna; se escapa "<" por seguridad.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
