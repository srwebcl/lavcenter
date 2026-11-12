import { CalendarCheck, Clock, Mail, MapPinCheck, MessageSquareText, Phone } from "lucide-react";
import { business } from "@/config/site";
import { ContactForm } from "@/components/sections/ContactForm";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { telUrl } from "@/lib/whatsapp";

/** Qué ocurre después de enviar la consulta (sin numeración, según el brief). */
const nextSteps = [
  {
    icon: MessageSquareText,
    title: "Recibimos tu consulta",
    text: "Nos llegan tus datos, el equipo y la falla que presenta.",
  },
  {
    icon: MapPinCheck,
    title: "Confirmamos la cobertura",
    text: "Revisamos tu comuna y te informamos el valor de la visita.",
  },
  {
    icon: CalendarCheck,
    title: "Coordinamos la visita",
    text: "Acordamos contigo el día para revisar el equipo.",
  },
];

export function Contact() {
  const tel = telUrl();

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-titulo"
      className="section-y relative isolate overflow-hidden bg-mist"
    >
      <div aria-hidden="true" className="bg-dots-light absolute inset-y-0 left-0 -z-10 w-1/2 [mask-image:linear-gradient(to_right,#000,transparent)]" />

      <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <p className="eyebrow">Contacto</p>
          <h2 id="contacto-titulo" className="section-title mt-3">
            ¿Qué problema presenta tu equipo?
          </h2>
          <p className="lead mt-4">
            Completa el formulario y te contactaremos para coordinar la visita.
          </p>

          <ul className="mt-10 space-y-7">
            {nextSteps.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-electric shadow-[0_10px_24px_-14px_rgba(8,120,189,0.6)] ring-1 ring-line">
                  <Icon className="size-[22px]" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-navy">{title}</h3>
                  <p className="mt-1 leading-relaxed text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          {(tel || business.email || business.hours) && (
            <div className="mt-10 space-y-2 border-t border-line pt-6 text-[0.9375rem] text-muted">
              {tel && business.phoneDisplay && (
                <p className="flex items-center gap-2">
                  <Phone className="size-4 text-electric" aria-hidden="true" />
                  ¿Prefieres llamar?{" "}
                  <TrackedLink
                    href={tel}
                    event="phone_click"
                    eventParams={{ location: "contacto" }}
                    className="font-semibold text-navy hover:text-electric"
                  >
                    {business.phoneDisplay}
                  </TrackedLink>
                </p>
              )}
              {business.email && (
                <p className="flex items-center gap-2">
                  <Mail className="size-4 text-electric" aria-hidden="true" />
                  <a href={`mailto:${business.email}`} className="font-medium text-navy hover:text-electric">
                    {business.email}
                  </a>
                </p>
              )}
              {business.hours && (
                <p className="flex items-center gap-2">
                  <Clock className="size-4 text-electric" aria-hidden="true" />
                  {business.hours}
                </p>
              )}
            </div>
          )}
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
