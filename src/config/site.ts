/**
 * CONFIGURACIÓN COMERCIAL CENTRAL DE LAVCENTER
 * ------------------------------------------------------------------
 * Este es el ÚNICO archivo donde se editan los datos del negocio.
 * Todos los componentes leen desde aquí: no dupliques información.
 *
 * Los campos marcados con `PENDIENTE` no estaban confirmados al
 * desarrollar el sitio. Mientras estén vacíos (null o []), la interfaz
 * oculta automáticamente los elementos que dependen de ellos.
 */

export type ApplianceType =
  | "Lavadora"
  | "Secadora"
  | "Lavavajillas"
  | "Otro electrodoméstico";

export interface Service {
  id: string;
  title: string;
  /** Texto corto que se usa en el mensaje de WhatsApp. */
  inquiry: string;
  description: string;
  image: { src: string; alt: string };
  /** Electrodoméstico preseleccionado si se consulta desde el formulario. */
  appliance: ApplianceType;
}

export interface Brand {
  name: string;
  /** Logotipo oficial (PNG transparente en /public/brands). null = se muestra el nombre en texto neutro. */
  logo: { src: string; width: number; height: number } | null;
}

/** Limpia un número dejando solo dígitos (formato requerido por wa.me y tel:). */
const digits = (value: string | undefined) => (value ?? "").replace(/\D/g, "");

export const business = {
  name: "LAVCENTER",
  tagline: "Servicio técnico de lavadoras y electrodomésticos",
  description:
    "Servicio técnico de lavadoras, secadoras y lavavajillas. Reparación, mantención y diagnóstico de electrodomésticos de línea blanca para el hogar.",

  /**
   * WhatsApp en formato internacional SIN "+" ni espacios.
   * Número confirmado por LAVCENTER. Se puede sobrescribir con NEXT_PUBLIC_WHATSAPP_NUMBER.
   */
  whatsapp: digits(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) || "56920675363",

  /**
   * Teléfono para llamadas en formato internacional SIN "+" (el mismo número de WhatsApp).
   * Se puede sobrescribir con NEXT_PUBLIC_PHONE_NUMBER.
   */
  phone: digits(process.env.NEXT_PUBLIC_PHONE_NUMBER) || "56920675363",

  /** Teléfono tal como se muestra en pantalla. */
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY || "+56 9 2067 5363",

  /** Correo oficial de contacto (se muestra en contacto, footer y datos estructurados). */
  email: "servicio@lavcenter.cl" as string | null,

  /** Horario de atención en texto. PENDIENTE (opcional). Ej.: "Lunes a viernes, 9:00 a 18:00". */
  hours: null as string | null,

  /** País de operación. */
  country: { code: "CL", name: "Chile" },
} as const;

/**
 * COBERTURA GEOGRÁFICA — confirmada por LAVCENTER.
 * Ciudades atendidas (distintas regiones, por eso `region` queda en null).
 * Se muestran en el hero, la sección Cobertura, el footer, la meta
 * description y en `areaServed` de los datos estructurados.
 */
export const coverage = {
  region: null as string | null,
  areas: [
    "Santiago",
    "La Serena",
    "Coquimbo",
    "Viña del Mar",
    "Valparaíso",
    "Concón",
    "Talca",
  ] as string[],
};

/** Une una lista en español: "A, B y C". */
export function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

export const services: Service[] = [
  {
    id: "lavadoras",
    title: "Reparación de lavadoras",
    inquiry: "reparación de lavadora",
    description:
      "Lavadoras de carga frontal y superior que no centrifugan, no desaguan, no encienden, pierden agua o hacen ruidos anormales.",
    image: {
      src: "/images/servicios/reparacion-lavadoras.webp",
      alt: "Lavadora de carga frontal instalada en un hogar",
    },
    appliance: "Lavadora",
  },
  {
    id: "secadoras",
    title: "Reparación de secadoras",
    inquiry: "reparación de secadora",
    description: "Secadoras que no calientan, no giran o se detienen antes de terminar el ciclo.",
    image: {
      src: "/images/servicios/reparacion-secadoras.webp",
      alt: "Persona retirando ropa del tambor de una secadora",
    },
    appliance: "Secadora",
  },
  {
    id: "lavavajillas",
    title: "Reparación de lavavajillas",
    inquiry: "reparación de lavavajillas",
    description: "Lavavajillas que no lavan bien, no drenan el agua o presentan fallas de funcionamiento.",
    image: {
      src: "/images/servicios/reparacion-lavavajillas.webp",
      alt: "Lavavajillas abierto con la bandeja de vajilla",
    },
    appliance: "Lavavajillas",
  },
  {
    id: "mantencion",
    title: "Mantención de electrodomésticos",
    inquiry: "mantención de electrodoméstico",
    description: "Revisión preventiva y limpieza de componentes para prolongar la vida útil de tus equipos.",
    image: {
      src: "/images/servicios/mantencion-electrodomesticos.webp",
      alt: "Técnico revisando una pieza interna de un electrodoméstico",
    },
    appliance: "Otro electrodoméstico",
  },
  {
    id: "diagnostico",
    title: "Diagnóstico técnico",
    inquiry: "diagnóstico técnico",
    description: "Revisión del equipo para identificar el origen de la falla antes de decidir la reparación.",
    image: {
      src: "/images/servicios/diagnostico-tecnico.webp",
      alt: "Panel de control y selector de programas de una lavadora",
    },
    appliance: "Lavadora",
  },
];

export const appliances: ApplianceType[] = [
  "Lavadora",
  "Secadora",
  "Lavavajillas",
  "Otro electrodoméstico",
];

/**
 * Marcas atendidas. Listado recuperado del material de referencia (Multilav)
 * — PENDIENTE: confirmar con LAVCENTER que atiende todas estas marcas.
 * Logotipos: archivos de dominio público de Wikimedia Commons (ver README).
 * Mademsa no tiene un logotipo de licencia verificable: se muestra su nombre
 * en texto neutro, sin imitar su identidad gráfica.
 */
export const brands: Brand[] = [
  { name: "Electrolux", logo: { src: "/brands/electrolux.png", width: 689, height: 160 } },
  { name: "LG", logo: { src: "/brands/lg.png", width: 363, height: 160 } },
  { name: "Whirlpool", logo: { src: "/brands/whirlpool.png", width: 481, height: 160 } },
  { name: "Mabe", logo: { src: "/brands/mabe.png", width: 535, height: 160 } },
  { name: "Kenmore", logo: { src: "/brands/kenmore.png", width: 160, height: 160 } },
  { name: "Daewoo", logo: { src: "/brands/daewoo.png", width: 685, height: 160 } },
  { name: "Mademsa", logo: null },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "¿Qué electrodomésticos reparan?",
    answer:
      "Reparamos y realizamos mantención de lavadoras, secadoras y lavavajillas. Si tienes otro equipo de línea blanca, escríbenos y te indicaremos si podemos atenderlo.",
  },
  {
    question: "¿Qué marcas atienden?",
    answer:
      "Trabajamos con marcas como Electrolux, LG, Whirlpool, Mabe, Kenmore, Daewoo y Mademsa. Si tu marca no aparece, consúltanos indicando el modelo del equipo.",
  },
  {
    question: "¿En qué ciudades atienden?",
    answer: `Atendemos en ${joinList(coverage.areas)}. Al escribirnos, indícanos tu comuna para confirmar la disponibilidad y coordinar la visita.`,
  },
  {
    question: "¿Cómo es la modalidad de atención?",
    answer:
      "Nos cuentas qué ocurre con tu equipo por WhatsApp o mediante el formulario. Revisamos tu comuna y coordinamos contigo una visita técnica.",
  },
  {
    question: "¿Cómo se coordina la visita técnica?",
    answer:
      "Una vez recibida tu consulta, te contactamos para acordar el día de la visita. El valor de la visita y las condiciones se informan al momento de coordinarla.",
  },
  {
    question: "¿En qué consiste el diagnóstico?",
    answer:
      "El técnico revisa el equipo para identificar el origen de la falla y te informa qué solución requiere antes de realizar cualquier reparación.",
  },
  {
    question: "¿Las reparaciones tienen garantía?",
    answer:
      "Consúltanos por las condiciones de garantía antes de aprobar la reparación. Te informaremos qué cubre según el trabajo y los repuestos utilizados.",
  },
  {
    question: "¿Necesito saber el modelo de mi equipo?",
    answer:
      "No es indispensable, pero si conoces la marca y el modelo podemos orientarte mejor desde el primer contacto. Normalmente aparecen en una etiqueta en la puerta o en la parte trasera.",
  },
];

export const navigation = [
  { href: "#servicios", label: "Servicios" },
  { href: "#marcas", label: "Marcas" },
  { href: "#cobertura", label: "Cobertura" },
  { href: "#contacto", label: "Contacto" },
];
