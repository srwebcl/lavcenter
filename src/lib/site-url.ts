/**
 * URL pública del sitio, usada en canonical, Open Graph, sitemap y robots.
 * Prioridad: NEXT_PUBLIC_SITE_URL > dominio de producción de Vercel > localhost.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return `https://${vercelProduction}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
