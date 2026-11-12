/**
 * URL pública del sitio, usada en canonical, Open Graph, sitemap y robots.
 * Prioridad: NEXT_PUBLIC_SITE_URL > dominio oficial (www.lavcenter.cl).
 * No se usa el dominio *.vercel.app para que el canonical apunte siempre al oficial.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  return "https://www.lavcenter.cl";
}

export const siteUrl = resolveSiteUrl();
