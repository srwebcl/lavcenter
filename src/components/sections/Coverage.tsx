import { ArrowRight, ClipboardCheck, MapPin, MessageCircle, Tags, WashingMachine } from "lucide-react";
import { business, coverage } from "@/config/site";

/**
 * Sección "Por qué elegirnos" + "Cobertura".
 * Textos simples, sin cifras, certificaciones ni garantías no confirmadas.
 */
const reasons = [
  {
    icon: WashingMachine,
    title: "Equipos de lavado",
    text: "Reparamos lavadoras, secadoras y lavavajillas.",
  },
  {
    icon: Tags,
    title: "Distintas marcas",
    text: "Si tu marca no aparece en la lista, pregúntanos igual.",
  },
  {
    icon: ClipboardCheck,
    title: "Primero el diagnóstico",
    text: "Te decimos qué falla tiene el equipo antes de repararlo.",
  },
  {
    icon: MessageCircle,
    title: "Trato directo",
    text: "Nos escribes o llamas y acordamos el día de la visita.",
  },
];

export function Coverage() {
  const hasAreas = coverage.areas.length > 0;

  return (
    <section
      id="cobertura"
      aria-labelledby="cobertura-titulo"
      className="section-y relative isolate overflow-hidden bg-navy-950 text-white"
    >
      <div aria-hidden="true" className="absolute -top-40 -right-40 -z-10 size-[560px] rounded-full bg-electric/25 blur-[120px]" />

      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow text-cyan">Por qué elegir {business.name}</p>
          <h2 id="cobertura-titulo" className="section-title mt-3 text-white">
            Servicio técnico a domicilio
          </h2>
          <p className="lead mt-4 text-white/70">
            Vamos a tu casa, revisamos el equipo y te explicamos qué tiene antes de hacer cualquier
            trabajo.
          </p>
        </div>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4 sm:block">
              <Icon className="size-7 shrink-0 text-cyan" strokeWidth={1.7} aria-hidden="true" />
              <div>
                <h3 className="text-lg font-semibold text-white sm:mt-4">{title}</h3>
                <p className="mt-1 leading-relaxed text-white/65">{text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-14 border-t border-white/15 pt-10">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <MapPin className="size-5 text-cyan" aria-hidden="true" />
            {hasAreas ? "Ciudades donde atendemos" : "Cobertura"}
          </h3>

          {hasAreas ? (
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-lg sm:gap-x-3 text-white/85 sm:text-xl">
              {coverage.areas.map((area, i) => (
                <li key={area} className="flex items-center gap-3">
                  {area}
                  {i < coverage.areas.length - 1 && (
                    <span aria-hidden="true" className="text-white/30 max-sm:hidden">
                      ·
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-white/75">Indícanos tu comuna y te confirmamos si llegamos.</p>
          )}

          <a
            href="#contacto"
            className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-cyan transition-colors hover:text-white"
          >
            ¿Dudas con tu comuna? Pregúntanos
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
