import Image from "next/image";
import { business, coverage, services } from "@/config/site";
import { telUrl, whatsappUrl } from "@/lib/whatsapp";
import { TrackedLink } from "@/components/ui/TrackedLink";

export function Footer() {
  const wa = whatsappUrl();
  const tel = telUrl();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-white">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Image
            src="/brand/lavcenter-logo-horizontal.png"
            alt={business.name}
            width={960}
            height={235}
            className="h-9 w-auto"
            sizes="160px"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{business.tagline}.</p>
        </div>

        <nav aria-labelledby="footer-servicios">
          <h2 id="footer-servicios" className="text-sm font-semibold text-navy">
            Servicios
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            {services.map((s) => (
              <li key={s.id}>
                <a href="#servicios" className="hover:text-electric">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-navy">Contacto</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            {wa && (
              <li>
                <TrackedLink href={wa} event="whatsapp_click" eventParams={{ location: "footer" }} className="hover:text-electric">
                  WhatsApp{business.phoneDisplay ? ` ${business.phoneDisplay}` : ""}
                </TrackedLink>
              </li>
            )}
            {tel && business.phoneDisplay && (
              <li>
                <TrackedLink href={tel} event="phone_click" eventParams={{ location: "footer" }} className="hover:text-electric">
                  Llamar al {business.phoneDisplay}
                </TrackedLink>
              </li>
            )}
            {business.email && (
              <li>
                <a href={`mailto:${business.email}`} className="hover:text-electric">
                  {business.email}
                </a>
              </li>
            )}
            <li>
              <a href="#contacto" className="hover:text-electric">
                Formulario de contacto
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-navy">Cobertura</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {coverage.areas.length > 0
              ? `${coverage.areas.join(", ")}${coverage.region ? ` (${coverage.region})` : ""}.`
              : `Atención en ${business.country.name}. Consulta disponibilidad en tu comuna.`}
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 pt-6 pb-24 text-xs text-muted sm:flex-row sm:justify-between sm:pb-6">
          <p>
            © {year} {business.name}. Todos los derechos reservados.
          </p>
          <p className="sm:max-w-md sm:text-right">
            Las marcas y logotipos mencionados pertenecen a sus respectivos titulares y se muestran solo
            para indicar los equipos que atendemos.
          </p>
        </div>
      </div>
    </footer>
  );
}
