# LAVCENTER — Landing de servicio técnico

Landing page de una sola página para **LAVCENTER**, servicio técnico de lavadoras, secadoras, lavavajillas y otros electrodomésticos de línea blanca. Está pensada para campañas locales de Google Ads en la red de búsqueda: todos los botones llevan a WhatsApp, a una llamada o al formulario de contacto.

## Stack

| Tecnología | Uso |
|---|---|
| Next.js 16 (App Router, Turbopack) | Framework. La página se prerenderiza como contenido estático |
| TypeScript (estricto) | Tipado |
| Tailwind CSS 4 | Estilos. La paleta de marca está definida en `src/app/globals.css` |
| lucide-react | Iconografía |
| next/font (Poppins) | Tipografía autoalojada, sin solicitudes a Google Fonts en el navegador |
| next/image | Imágenes optimizadas en AVIF/WebP, con lazy loading |

No hay base de datos. El formulario envía la solicitud por correo con [Resend](https://resend.com), protegido con Google reCAPTCHA v3, mediante un único endpoint (`/api/contacto`). El resto del sitio se prerenderiza como contenido estático.

## Estructura

```
├── design-source/            Archivos maestros (NO se publican)
│   ├── brand/                Logos originales de LAVCENTER + favicon cuadrado 512 px
│   ├── brands-svg/           SVG originales de las marcas (Wikimedia Commons)
│   ├── hero/                 Imágenes originales del hero (PNG) y maqueta de referencia
│   └── legacy/landing-v3.html  Versión HTML anterior (V3), solo como referencia
├── public/
│   ├── brand/                Logo horizontal optimizado
│   ├── brands/               Logos de marcas (PNG transparente, recortados)
│   └── images/               Fotografías WebP (hero y servicios)
└── src/
    ├── app/                  layout, page, sitemap, robots, íconos, imagen Open Graph
    │   └── api/contacto/     Endpoint del formulario (reCAPTCHA v3 + Resend)
    ├── config/
    │   ├── site.ts           ★ DATOS COMERCIALES: servicios, marcas, cobertura, FAQ, navegación
    │   └── metadata.ts       Title, description y Open Graph
    ├── components/
    │   ├── layout/           Header (menú responsive) y Footer
    │   ├── sections/         Hero, Marcas (carrusel), Servicios, Por qué elegirnos + Cobertura, FAQ, Contacto
    │   ├── ui/               Botón de WhatsApp, botón flotante, volver al inicio, enlace con medición, ícono de WhatsApp
    │   ├── analytics/        Carga de GTM o gtag.js
    │   └── seo/              Datos estructurados LocalBusiness (JSON-LD)
    └── lib/                  whatsapp.ts, contact.ts (validación), recaptcha.ts, analytics.ts, site-url.ts
```

## Desarrollo local

Requiere Node.js 20.9 o superior.

```bash
npm install
cp .env.example .env.local     # completar los valores reales (nunca en .env.example)
npm run dev                    # http://localhost:3000
```

## Build y verificación

```bash
npx tsc --noEmit    # TypeScript
npm run lint        # ESLint
npm run build       # build de producción
npm run start       # sirve el build en local
```

## Variables de entorno

Todas están documentadas en `.env.example`, que es solo una plantilla sin valores reales. Los valores reales van en `.env.local` (ignorado por Git) y en Vercel.

- `NEXT_PUBLIC_*`: públicas, se incrustan en el build. **Después de cambiarlas en Vercel hay que volver a desplegar.**
- Sin prefijo: secretas, solo se leen en el servidor (`src/app/api/contacto/route.ts`).

| Variable | Obligatoria | Descripción |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No | Dominio del sitio para canonical, Open Graph, sitemap y robots. Por defecto `https://www.lavcenter.cl` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | No | Sobrescribe el WhatsApp oficial definido en `site.ts`. Solo dígitos, con código de país |
| `NEXT_PUBLIC_PHONE_NUMBER` | No | Sobrescribe el teléfono de llamadas (solo dígitos) |
| `NEXT_PUBLIC_PHONE_DISPLAY` | No | Sobrescribe cómo se muestra el teléfono |
| `RESEND_API_KEY` | Sí (formulario) | Clave de API de Resend. **Secreta** |
| `CONTACT_EMAIL_TO` | Sí (formulario) | Correo que recibe las solicitudes: `servicio@lavcenter.cl`. Admite varios separados por coma |
| `CONTACT_EMAIL_FROM` | Sí (formulario) | Remitente con dominio verificado en Resend: `LAVCENTER <servicio@lavcenter.cl>` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Sí (formulario) | Clave de sitio de reCAPTCHA v3 (pública) |
| `RECAPTCHA_SECRET_KEY` | Sí (formulario) | Clave secreta de reCAPTCHA v3. **Secreta** |
| `RECAPTCHA_MIN_SCORE` | No | Puntaje mínimo aceptado, de 0.0 a 1.0. Por defecto `0.5` |
| `NEXT_PUBLIC_GTM_ID` | No | `GTM-XXXXXXX` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | `G-XXXXXXXXXX` (solo si no se usa GTM) |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | No | `AW-XXXXXXXXX` (solo si no se usa GTM) |
| `NEXT_PUBLIC_GOOGLE_ADS_LABEL_*` | No | Etiquetas de conversión para WhatsApp, teléfono y formulario |

## Configuración de WhatsApp y del teléfono

El número oficial es **+56 9 2067 5363**, para WhatsApp y llamadas. Está definido **una sola vez** en `business` (`src/config/site.ts`) y lo leen todos los botones a través de `src/lib/whatsapp.ts`. Las variables `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_PHONE_NUMBER` y `NEXT_PUBLIC_PHONE_DISPLAY` permiten cambiarlo sin tocar el código.

- **Botón flotante:** `src/components/ui/FloatingWhatsApp.tsx`, fijo y siempre visible en la esquina inferior derecha, sin animaciones. Sus clics se miden como `whatsapp_click` con `location = flotante`.
- **Volver al inicio:** `src/components/ui/BackToTop.tsx`, en la esquina inferior izquierda. Aparece al bajar una pantalla y sube con desplazamiento suave (instantáneo con movimiento reducido).
- **Sin número configurado:** los botones de WhatsApp llevan al formulario.
- **Sin teléfono configurado:** no se muestran botones de llamada.
- **Datos estructurados:** el bloque LocalBusiness (JSON-LD) solo se publica cuando hay WhatsApp o teléfono configurado.

## Formulario de contacto (Resend + reCAPTCHA v3)

Flujo: el formulario valida los campos en el navegador → obtiene un token de reCAPTCHA v3 (acción `contacto`) → `POST /api/contacto` → el servidor vuelve a validar, verifica el token con Google y envía el correo con la API de Resend.

- **reCAPTCHA se carga solo al empezar a usar el formulario**, para no afectar la velocidad de la página. El distintivo flotante de Google está oculto. A cambio, bajo el botón se muestra el aviso legal que Google exige en ese caso.
- **Seguridad del endpoint:**
  - Solo acepta `POST` con JSON, desde el mismo origen, y de hasta 10 KB.
  - Valida y limita el largo de cada campo con las mismas reglas que el formulario (`src/lib/contact.ts`).
  - Solo acepta las marcas y electrodomésticos de la lista.
  - Incluye un campo trampa contra bots.
  - Verifica la acción y el puntaje de reCAPTCHA.
  - Escapa el HTML del correo.
  - No registra datos personales en los logs.
- **Correo:** incluye los datos del cliente, un botón "Llamar al cliente" (`tel:`) y su número para WhatsApp en texto. No lleva enlaces a otros dominios, porque Resend advierte que los filtros de spam penalizan URLs distintas al dominio del remitente.
- **Si falta alguna variable** (`RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM` o las claves de reCAPTCHA), el endpoint responde `503` y el formulario abre WhatsApp con el mensaje armado. **Nunca se simula un envío exitoso.**
- **Si el envío falla**, se muestra un aviso con un botón para mandar la misma consulta por WhatsApp.

Antes de publicar:

1. **Resend:** verificar el dominio `lavcenter.cl` (Domains → Add domain) agregando en el DNS los registros que indica Resend. Sin eso, Resend rechaza el remitente `servicio@lavcenter.cl`.
2. **reCAPTCHA:** en la [consola de reCAPTCHA](https://www.google.com/recaptcha/admin), agregar a la clave el dominio `lavcenter.cl` (cubre `www`) y, si se probará en local, `localhost`. Si el dominio no está autorizado, Google responde `browser-error` y el formulario muestra el aviso con WhatsApp. Los rechazos se registran en los logs del servidor con el código de Google, sin datos personales.

## Cobertura

Las ciudades atendidas están en `coverage.areas` (`src/config/site.ts`): Santiago, La Serena, Coquimbo, Viña del Mar, Valparaíso, Concón y Talca. Desde esa única lista se generan la sección "Por qué elegir LAVCENTER" (lista de ciudades), el footer, la pregunta frecuente "¿En qué ciudades atienden?", la meta description y `areaServed` del JSON-LD. Para agregar o quitar una ciudad basta con editar la lista. Si se vacía, la web vuelve a invitar a consultar la cobertura.

## Datos comerciales pendientes

Se editan en `src/config/site.ts`:

- **`business.email`:** `servicio@lavcenter.cl`, se muestra en contacto, footer y datos estructurados.
- **`business.hours`:** opcional. Solo se muestra si tiene valor.
- **`brands`:** confirmar que LAVCENTER atiende todas las marcas del listado, que proviene del material de referencia Multilav.
- **`faqs`:** revisar las respuestas sobre visita técnica y garantía. Están redactadas sin inventar precios ni condiciones.

## Google Analytics 4, Tag Manager y Google Ads

`src/components/analytics/Analytics.tsx` carga una sola vía de medición, para no duplicar etiquetas:

1. **Si existe `NEXT_PUBLIC_GTM_ID`:** se carga solo GTM. GA4 y las conversiones de Ads se configuran dentro del contenedor.
2. **Si no hay GTM pero hay GA4 o Ads:** se carga `gtag.js` una vez y se configuran ambos IDs.
3. **Sin IDs:** no se carga ningún script.

Eventos que se envían a `dataLayer`, y también a gtag cuando no hay GTM:

| Evento | Cuándo | Parámetros |
|---|---|---|
| `whatsapp_click` | Clic en cualquier botón de WhatsApp | `location` (header, menu_movil, flotante, servicio_lavadoras, contacto, footer…) |
| `phone_click` | Clic en un enlace `tel:` | `location` |
| `form_submit` | Solicitud enviada (por correo o, como respaldo, por WhatsApp) | `appliance`, `brand`, `channel` (`email` o `whatsapp`) |

Las consultas por servicio se distinguen por `location = servicio_<id>` dentro de `whatsapp_click`.

**Con GTM:** crear activadores de tipo "Evento personalizado" con los nombres anteriores y asociarlos a las etiquetas de GA4 y de conversión de Google Ads.

**Sin GTM:** definir `NEXT_PUBLIC_GOOGLE_ADS_ID` y las etiquetas `NEXT_PUBLIC_GOOGLE_ADS_LABEL_*`. El código dispara `gtag('event','conversion',{send_to:'AW-ID/LABEL'})` automáticamente.

## Despliegue en Vercel

1. Subir el proyecto a un repositorio Git (GitHub, GitLab o Bitbucket).
2. En Vercel, ir a **Add New → Project** e importar el repositorio. El framework se detecta como Next.js y no hace falta cambiar los comandos de build ni el directorio de salida.
3. En **Environment Variables**, cargar para el entorno *Production*: `NEXT_PUBLIC_SITE_URL`, las variables del formulario (Resend y reCAPTCHA) y los IDs de medición si existen. Marcar `RESEND_API_KEY` y `RECAPTCHA_SECRET_KEY` como *Sensitive*.
4. Pulsar **Deploy**.
5. En **Settings → Domains**, agregar `www.lavcenter.cl` (y `lavcenter.cl` redirigiendo a `www`) y configurar el DNS según las indicaciones de Vercel.
6. Comprobar `https://www.lavcenter.cl/robots.txt` y `https://www.lavcenter.cl/sitemap.xml`, y enviar el sitemap a Google Search Console.

## Créditos de recursos gráficos

- **Logotipo y favicon:** recursos originales de LAVCENTER. El favicon cuadrado se recortó a partir del emblema del logotipo.
- **Fotografías del hero:** imágenes de LAVCENTER (`public/images/hero-lavcenter-desktop.webp` y `hero-lavcenter-mobile.webp`), generadas a partir de los originales en `design-source/hero/`. Se cargan con `<picture>`: cada dispositivo descarga solo la suya.
- **Otras fotografías:**
  - [Pexels](https://www.pexels.com/license/): fotos 34734504 (imagen de los datos estructurados), 7282378 (secadoras) y 37492288 (mantención).
  - [Unsplash](https://unsplash.com/license): fotos 1587785580224 (lavadoras), 1736390755053 (lavavajillas) y 1691729086731 (diagnóstico).
  - Ambas licencias permiten el uso comercial sin atribución obligatoria.
- **Logotipos de marcas:** archivos marcados como dominio público en Wikimedia Commons (Electrolux 2015, LG 2014, Whirlpool 2017, Logotipo Mabe, Kenmore, Daewoo Electronics). Son marcas registradas de sus titulares y se usan solo para indicar qué equipos se atienden. Mademsa no tiene un logotipo con licencia verificable, así que se muestra su nombre en texto neutro.

## Seguridad del repositorio

- Las claves reales solo deben estar en `.env.local` (ignorado por Git) y en las variables de entorno de Vercel. `.env.example` es una plantilla sin valores.
- Si una clave llega a subirse por error, hay que **revocarla y generar una nueva** en Resend o en la consola de reCAPTCHA. Borrarla del repositorio no basta, porque queda en el historial.
