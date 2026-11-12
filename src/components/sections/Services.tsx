import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { services, type Service } from "@/config/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { serviceMessage } from "@/lib/whatsapp";
import { ServicesCarousel } from "./ServicesCarousel";

/** Con mouse en escritorio: la descripción se despliega al pasar el cursor. En táctil queda visible. */
const reveal =
  "grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-500 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100 [@media(hover:hover)_and_(min-width:1024px)]:grid-rows-[0fr] [@media(hover:hover)_and_(min-width:1024px)]:opacity-0";

function ServiceCard({ service }: { service: Service }) {
  return (
    <article
      data-card
      className="group relative isolate flex aspect-[4/5] w-full shrink-0 snap-start flex-col justify-end overflow-hidden rounded-[1.75rem] bg-navy-950 text-white shadow-[0_24px_50px_-30px_rgba(3,29,61,0.8)] transition-[transform,box-shadow,filter] duration-500 ease-out hover:-translate-y-2 [@media(hover:hover)]:group-hover/list:brightness-[0.6] [@media(hover:hover)]:group-hover/list:grayscale-[0.5] hover:brightness-100! hover:grayscale-0! focus-within:brightness-100! focus-within:grayscale-0! hover:shadow-[0_40px_70px_-30px_rgba(8,120,189,0.75)] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3rem)/3)] 2xl:aspect-square"
    >
      <Image
        src={service.image.src}
        alt={service.image.alt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        // Carrusel horizontal: carga inmediata con prioridad baja (WebKit no dispara lazy-load al deslizar).
        loading="eager"
        fetchPriority="low"
        draggable={false}
        className="-z-30 object-cover saturate-[1.15] contrast-[1.05] transition-[transform,filter] duration-[900ms] ease-out group-hover:scale-110 group-hover:saturate-[1.3]"
      />

      {/* Velo de lectura */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-t from-navy-950 via-navy-950/45 to-navy-950/0" />
      {/* Tinte de marca al pasar el cursor */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-electric via-electric/45 to-cyan/10 opacity-0 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-100"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-navy-950/90 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      {/* Destello diagonal: una pasada al entrar el cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:left-[150%] group-hover:opacity-100 group-hover:transition-[left] group-hover:duration-[1100ms] group-hover:ease-out"
      />
      {/* Borde luminoso */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-white/10 ring-inset transition-[box-shadow] duration-500 group-hover:ring-2 group-hover:ring-cyan/70"
      />

      <span
        aria-hidden="true"
        className="absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-[background-color,color,transform] duration-500 group-hover:scale-110 group-hover:bg-white group-hover:text-electric"
      >
        <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" />
      </span>

      <div className="p-6 sm:p-7 lg:p-9">
        <span
          aria-hidden="true"
          className="mb-4 block h-1 w-10 rounded-full bg-cyan transition-[width] duration-500 ease-out group-hover:w-20"
        />
        <h3 className="text-[1.5rem] leading-snug font-semibold tracking-tight text-white sm:text-[1.625rem] lg:text-[1.875rem]">
          {service.title}
        </h3>
        <div className={reveal}>
          <p className="max-w-sm overflow-hidden pt-2.5 text-[0.9375rem] leading-relaxed text-white/85 lg:text-base">{service.description}</p>
        </div>
        <WhatsAppButton
          message={serviceMessage(service.inquiry)}
          location={`servicio_${service.id}`}
          showIcon={false}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full whitespace-nowrap border border-white/25 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur-md transition-[background-color,color,border-color] duration-300 group-hover:border-white group-hover:bg-white group-hover:text-navy after:absolute after:inset-0 after:rounded-[1.75rem] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-cyan"
        >
          <WhatsAppIcon className="size-4 shrink-0 text-[#25d366]" />
          Consultar por WhatsApp<span className="sr-only">: {service.title}</span>
        </WhatsAppButton>
      </div>
    </article>
  );
}

export function Services() {
  return (
    <section
      id="servicios"
      aria-labelledby="servicios-titulo"
      className="section-y relative isolate overflow-hidden bg-mist"
    >
      <div aria-hidden="true" className="bg-dots-light absolute inset-x-0 top-0 -z-10 h-80 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      <div aria-hidden="true" className="absolute -top-32 -right-32 -z-10 size-[480px] rounded-full bg-cyan/15 blur-[110px]" />
      <div aria-hidden="true" className="absolute -bottom-40 -left-40 -z-10 size-[420px] rounded-full bg-electric/10 blur-[110px]" />

      <ServicesCarousel
        header={
          <div className="max-w-2xl">
            <div>
              <p className="eyebrow">Servicios</p>
              <h2 id="servicios-titulo" className="section-title mt-3">
                Reparación y mantención de{" "}
                <span className="bg-gradient-to-r from-electric to-[#1aa3dc] bg-clip-text text-transparent">
                  línea blanca
                </span>
              </h2>
            </div>
            <p className="lead mt-4">
              Atendemos las fallas más comunes de los equipos de lavado del hogar, desde una
              revisión preventiva hasta la reparación.
            </p>
          </div>
        }
      >
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </ServicesCarousel>

      <div className="container-page">
        <p className="mt-10 text-center text-[0.9375rem] text-muted sm:text-base">
          ¿Tu equipo tiene otra falla?{" "}
          <a href="#contacto" className="text-link">
            Cuéntanos qué le pasa
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </p>
      </div>
    </section>
  );
}
