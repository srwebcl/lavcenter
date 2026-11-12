import { getImageProps } from "next/image";
import { ArrowRight, House, ShieldCheck, Wrench } from "lucide-react";

const features = [
  { icon: Wrench, label: ["Técnicos", "especializados"] },
  { icon: House, label: ["Atención", "a domicilio"] },
  { icon: ShieldCheck, label: ["Servicio", "confiable"] },
];

const alt = "Técnico de LAVCENTER reparando una lavadora de carga superior";

/**
 * Hero claro con fotografía del técnico de LAVCENTER.
 * Dirección de arte con <picture>: cada dispositivo descarga solo su imagen
 * (horizontal en desktop, vertical en móvil). Un único CTA: WhatsApp ya está
 * en el header y en el botón flotante.
 */
export function Hero() {
  const common = { alt, sizes: "100vw", quality: 80 };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: "/images/hero-lavcenter-desktop.webp", width: 1672, height: 941 });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: "/images/hero-lavcenter-mobile.webp", width: 1086, height: 1448 });

  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[calc(100svh-72px)] overflow-hidden bg-white md:items-center"
    >
      <picture>
        <source media="(min-width: 768px)" srcSet={desktop} />
        <source media="(max-width: 767px)" srcSet={mobile} />
        <img
          {...rest}
          alt={alt}
          loading="eager"
          fetchPriority="high"
          className="absolute inset-x-0 top-0 -z-20 h-[62%] w-full object-cover object-[50%_15%] md:inset-0 md:h-full md:object-[75%_50%] xl:object-right"
        />
      </picture>

      {/* Velo claro: abajo en móvil (texto sobre la imagen), a la izquierda en desktop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent_0%,transparent_32%,rgba(255,255,255,0.85)_50%,#fff_60%)] md:bg-[linear-gradient(to_right,#fff_0%,rgba(255,255,255,0.97)_30%,rgba(240,247,253,0.75)_46%,rgba(240,247,253,0)_62%)]"
      />
      {/* Curva azul decorativa inferior izquierda (estática) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 600 220"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 -z-10 h-24 w-full text-electric md:h-40 md:[mask-image:linear-gradient(to_right,#000_35%,transparent_70%)]"
      >
        <path d="M0 90 C 180 210 420 200 600 140 L600 220 L0 220 Z" fill="currentColor" opacity="0.08" />
        <path d="M0 150 C 200 230 430 215 600 185 L600 220 L0 220 Z" fill="currentColor" opacity="0.14" />
      </svg>

      <div className="container-page flex w-full flex-col justify-end pt-[min(58vw,52svh)] pb-10 md:justify-center md:py-16 short:md:py-10">
        <div className="max-w-xl md:max-w-[34rem] lg:max-w-[38rem]">
          <h1 className="font-bold tracking-tight text-navy">
            <span className="block text-[1.75rem] leading-tight sm:text-[2.4rem] lg:text-[2.9rem] short:lg:text-[2.5rem]">
              Servicio técnico de
            </span>
            <span className="block bg-gradient-to-r from-electric to-[#1aa3dc] bg-clip-text pb-1 text-[3.25rem] leading-[1.02] text-transparent sm:text-[4.5rem] lg:text-[5.4rem] short:lg:text-[4.5rem] xshort:text-[2.75rem]">
              Lavadoras
            </span>
            <span className="block text-[1.75rem] leading-tight sm:text-[2.4rem] lg:text-[2.9rem] short:lg:text-[2.5rem]">
              y electrodomésticos
            </span>
          </h1>

          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/75 sm:mt-5 sm:text-lg short:mt-3">
            Reparación, mantención y diagnóstico multimarca de lavadoras, secadoras y lavavajillas en
            tu hogar.
          </p>

          <ul className="mt-6 grid max-w-md grid-cols-3 divide-x divide-line sm:mt-8 short:mt-5 xshort:hidden">
            {features.map(({ icon: Icon, label }) => (
              <li key={label.join(" ")} className="flex flex-col items-center gap-2 px-2 text-center">
                <Icon className="size-7 text-electric sm:size-8" strokeWidth={1.7} aria-hidden="true" />
                <span className="text-[0.8125rem] leading-snug font-semibold text-navy sm:text-sm">
                  {label[0]}
                  <br />
                  {label[1]}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-7 sm:mt-9 short:mt-6">
            {/* En móvil deja espacio a la derecha para el botón flotante de WhatsApp. */}
            <a href="#contacto" className="btn-primary min-h-14 w-[calc(100%-4.5rem)] px-6 text-base sm:w-auto sm:px-8">
              Solicitar asistencia
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
