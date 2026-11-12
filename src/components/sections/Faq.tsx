"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/config/site";

/** Acordeón accesible (patrón WAI-ARIA: botón con aria-expanded + región asociada). */
export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="preguntas-frecuentes" aria-labelledby="faq-titulo" className="section-y bg-white">
      <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">Preguntas frecuentes</p>
          <h2 id="faq-titulo" className="section-title mt-3">
            Resolvemos tus dudas
          </h2>
          <p className="lead mt-4">
            Información útil antes de solicitar asistencia técnica. ¿Tienes otra consulta?{" "}
            <a href="#contacto" className="font-medium text-electric underline-offset-4 hover:underline">
              Escríbenos
            </a>
            .
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const buttonId = `${baseId}-q${i}`;
            const panelId = `${baseId}-a${i}`;
            return (
              <div
                key={faq.question}
                className={`rounded-2xl border bg-white transition-[border-color,box-shadow] duration-200 ${
                  isOpen
                    ? "border-electric/40 shadow-[0_18px_40px_-24px_rgba(8,120,189,0.55)]"
                    : "border-line hover:border-electric/30"
                }`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 rounded-2xl px-5 py-5 text-left text-base font-medium text-navy sm:px-6 sm:text-[1.0625rem]"
                  >
                    {faq.question}
                    <span
                      aria-hidden="true"
                      className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                        isOpen ? "bg-electric text-white" : "bg-ice text-electric"
                      }`}
                    >
                      <Plus className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`} />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="-mt-1 max-w-2xl px-5 pr-14 pb-6 leading-relaxed text-muted sm:px-6"
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
