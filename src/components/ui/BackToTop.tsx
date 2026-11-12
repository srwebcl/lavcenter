"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Botón "Volver al inicio" (esquina inferior izquierda).
 * Aparece después de bajar una pantalla y sube con desplazamiento suave
 * (instantáneo si la persona prefiere movimiento reducido).
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // Devuelve el foco al inicio para quienes navegan con teclado.
    document.querySelector<HTMLElement>('header a[href="#inicio"]')?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="Volver al inicio"
      aria-hidden={!visible || undefined}
      tabIndex={visible ? undefined : -1}
      className={`fixed bottom-4 left-4 z-30 inline-flex size-12 items-center justify-center rounded-full bg-navy text-white shadow-[0_10px_30px_-8px_rgba(3,29,61,0.55)] ring-4 ring-white transition-[opacity,transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-electric sm:bottom-6 sm:left-6 ${
        visible ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </button>
  );
}
