"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Carrusel de servicios con scroll-snap nativo (táctil, trackpad y teclado),
 * arrastre con mouse en escritorio, flechas y barra de progreso.
 * Sin avance automático.
 */
export function ServicesCarousel({
  header,
  children,
}: {
  header: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visibleRatio, setVisibleRatio] = useState(1);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setVisibleRatio(el.scrollWidth ? el.clientWidth / el.scrollWidth : 1);
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollBy({
      left: dir * (card.offsetWidth + gap),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  // Arrastre con mouse (en táctil el desplazamiento ya es nativo).
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !ref.current) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: ref.current.scrollLeft,
      moved: false,
    };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = ref.current;
    if (!d.active || !el) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setDragging(true);
      el.setPointerCapture(e.pointerId);
    }
    if (d.moved) el.scrollLeft = d.startScroll - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (!d.moved) return;
    setDragging(false);
    // El clic que sigue al soltar (si el navegador lo emite) se bloquea en onClickCapture;
    // pasado ese instante se vuelve a permitir.
    window.setTimeout(() => {
      d.moved = false;
    }, 0);
    // Al soltar, el scroll-snap vuelve a alinear la tarjeta más cercana.
    const el = ref.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    if (el && card) {
      const step =
        card.offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 0);
      el.scrollTo({
        left: Math.round(el.scrollLeft / step) * step,
        behavior: "smooth",
      });
    }
  };
  // Evita abrir WhatsApp si el clic fue en realidad un arrastre.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  // Flechas a los costados, centradas en la altura de las tarjetas (el scroller tiene pt-3 y pb-10).
  const arrow =
    "absolute top-[calc(50%-14px)] z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-navy shadow-[0_10px_30px_-10px_rgba(3,29,61,0.55)] backdrop-blur-md transition-[background-color,color,border-color,opacity,scale] duration-200 hover:scale-110 hover:border-electric hover:bg-electric hover:text-white disabled:pointer-events-none disabled:opacity-0 sm:size-14";

  // Ancho del indicador = porción visible del carrusel; se desplaza según el scroll.
  const thumb = Math.max(visibleRatio, 0.12);

  return (
    <div>
      <div className="container-page">{header}</div>

      <div className="relative mt-10 sm:mt-12">
        <button
          type="button"
          className={`${arrow} left-1 sm:left-4 lg:left-5`}
          onClick={() => go(-1)}
          disabled={atStart}
          aria-label="Servicio anterior"
        >
          <ArrowLeft className="size-5 sm:size-6" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`${arrow} right-1 sm:right-4 lg:right-5`}
          onClick={() => go(1)}
          disabled={atEnd}
          aria-label="Servicio siguiente"
        >
          <ArrowRight className="size-5 sm:size-6" aria-hidden="true" />
        </button>
        <div
          ref={ref}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Servicios"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          onDragStart={(e) => e.preventDefault()}
          className={`group/list flex gap-4 overflow-x-auto px-5 pt-3 pb-10 [scrollbar-width:none] sm:gap-5 sm:px-8 lg:gap-6 lg:px-10 [&::-webkit-scrollbar]:hidden ${
            dragging
              ? "cursor-grabbing select-none"
              : "snap-x snap-mandatory scroll-px-5 sm:scroll-px-8 lg:cursor-grab lg:scroll-px-10"
          }`}
        >
          {children}
        </div>
      </div>

      <div className="px-5 sm:px-8 lg:px-10">
        <div
          className="relative h-1 flex-1 overflow-hidden rounded-full bg-navy/10"
          aria-hidden="true"
        >
          <div
            className="absolute inset-y-0 rounded-full bg-gradient-to-r from-electric to-cyan transition-[left] duration-150"
            style={{
              width: `${thumb * 100}%`,
              left: `${progress * (1 - thumb) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
