"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Brand } from "@/config/site";

const SPEED_PX_PER_SECOND = 24;
const RESUME_DELAY_MS = 2500;

/**
 * Carrusel horizontal discreto:
 * - Avance automático lento, en bucle (la lista se duplica visualmente).
 * - Se pausa al pasar el cursor, al enfocar con teclado, al tocar o arrastrar,
 *   cuando no está visible y siempre que el usuario prefiera movimiento reducido.
 * - Desplazamiento manual con rueda/trackpad, gesto táctil o flechas del teclado (al enfocarlo).
 */
export function BrandsCarousel({ brands }: { brands: Brand[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedUntil = useRef(0);
  const hovering = useRef(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let last = 0;
    let position = el.scrollLeft;

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(el);

    const tick = (time: number) => {
      const delta = last ? Math.min(time - last, 64) : 0;
      last = time;
      const half = el.scrollWidth / 2;
      const active =
        visible && !hovering.current && !reducedMotion.matches && time > pausedUntil.current;

      if (active && half > el.clientWidth) {
        // Si el usuario desplazó manualmente, continuar desde su posición.
        if (Math.abs(el.scrollLeft - position) > 2) position = el.scrollLeft;
        position += (SPEED_PX_PER_SECOND * delta) / 1000;
        if (position >= half) position -= half;
        el.scrollLeft = position;
      } else {
        position = el.scrollLeft;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const pause = () => {
      pausedUntil.current = performance.now() + RESUME_DELAY_MS;
    };
    el.addEventListener("pointerdown", pause, { passive: true });
    el.addEventListener("wheel", pause, { passive: true });
    el.addEventListener("touchmove", pause, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("wheel", pause);
      el.removeEventListener("touchmove", pause);
    };
  }, []);

  const items = [...brands, ...brands];

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        role="region"
        aria-label="Marcas atendidas"
        tabIndex={0}
        onMouseEnter={() => (hovering.current = true)}
        onMouseLeave={() => (hovering.current = false)}
        onFocus={() => (hovering.current = true)}
        onBlur={() => (hovering.current = false)}
        className="overflow-x-auto [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] [scrollbar-width:none] focus-visible:outline-offset-4 [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max items-center">
          {items.map((brand, i) => {
            const duplicate = i >= brands.length;
            return (
              <li
                key={`${brand.name}-${i}`}
                aria-hidden={duplicate || undefined}
                className="flex h-24 w-44 shrink-0 items-center justify-center border-r border-line px-8 sm:w-56 sm:px-10"
              >
                {brand.logo ? (
                  <Image
                    src={brand.logo.src}
                    alt={duplicate ? "" : brand.name}
                    width={brand.logo.width}
                    height={brand.logo.height}
                    sizes="160px"
                    loading="eager"
                    fetchPriority="low"
                    className={`w-auto max-w-full object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 ${
                      // Logotipos cuadrados necesitan más altura para tener un peso visual equivalente.
                      brand.logo.width / brand.logo.height < 1.5 ? "max-h-14" : "max-h-9 sm:max-h-11"
                    }`}
                  />
                ) : (
                  <span className="text-xl font-semibold tracking-wide text-ink/50">{brand.name}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

    </div>
  );
}
