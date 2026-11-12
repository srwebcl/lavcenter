"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { business, navigation } from "@/config/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { telUrl } from "@/lib/whatsapp";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const tel = telUrl();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menú móvil a pantalla completa: bloquea el scroll del fondo, cierra con Escape o al agrandar la ventana.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-shadow duration-200 supports-[backdrop-filter]:bg-white/85 ${
          scrolled
            ? "border-line shadow-[0_8px_24px_-16px_rgba(16,44,69,0.35)]"
            : "border-transparent"
        }`}
      >
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2"
        >
          Saltar al contenido
        </a>
        <div className="container-page flex h-[72px] items-center justify-between gap-6">
          <a
            href="#inicio"
            className="shrink-0"
            aria-label={`${business.name}, ir al inicio`}
            onClick={() => setOpen(false)}
          >
            <Image
              src="/brand/lavcenter-logo-horizontal.png"
              alt={business.name}
              width={960}
              height={235}
              priority
              className="h-9 w-auto sm:h-10"
              sizes="170px"
            />
          </a>

          <nav aria-label="Navegación principal" className="hidden md:block">
            <ul className="flex items-center gap-8 text-[0.9375rem] font-medium text-ink/75">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="relative py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-electric after:transition-transform after:duration-200 hover:text-electric hover:after:scale-x-100"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            {tel && business.phoneDisplay && (
              <TrackedLink
                href={tel}
                event="phone_click"
                eventParams={{ location: "header" }}
                className="hidden items-center gap-2 text-[0.9375rem] font-medium text-navy transition-colors hover:text-electric lg:inline-flex"
              >
                <Phone className="size-4 text-electric" aria-hidden="true" />
                {business.phoneDisplay}
              </TrackedLink>
            )}
            <WhatsAppButton
              location="header"
              className="btn-whatsapp min-h-11 px-4 max-md:hidden"
            >
              WhatsApp
            </WhatsAppButton>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-xl text-navy hover:bg-mist md:hidden"
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Fuera del <header>: su backdrop-filter crearía un contenedor para elementos fixed. */}
      <nav
        id="menu-movil"
        aria-label="Navegación móvil"
        hidden={!open}
        className="fixed inset-x-0 top-[72px] bottom-0 z-[35] overflow-y-auto bg-navy-950 text-white md:hidden"
      >
        <div
          aria-hidden="true"
          className="bg-dots-dark pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full bg-electric/30 blur-[100px]"
        />
        <div className="container-page relative flex min-h-full flex-col py-8">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-5 text-2xl font-semibold text-white transition-colors hover:text-cyan"
                >
                  {item.label}
                  <ArrowRight className="size-5 text-cyan" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-3 pt-10">
            <WhatsAppButton
              location="menu_movil"
              className="btn-whatsapp min-h-14 w-full text-base"
            >
              Escribir por WhatsApp
            </WhatsAppButton>
            {tel && business.phoneDisplay && (
              <TrackedLink
                href={tel}
                event="phone_click"
                eventParams={{ location: "menu_movil" }}
                className="btn-outline-light min-h-14 w-full text-base"
              >
                <Phone className="size-5" aria-hidden="true" />
                Llamar al {business.phoneDisplay}
              </TrackedLink>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
