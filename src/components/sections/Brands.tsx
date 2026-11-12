import { brands } from "@/config/site";
import { BrandsCarousel } from "@/components/sections/BrandsCarousel";

export function Brands() {
  return (
    <section id="marcas" aria-labelledby="marcas-titulo" className="border-b border-line bg-white py-12 sm:py-16">
      <div className="container-page flex flex-col items-center gap-2 text-center">
        <h2 id="marcas-titulo" className="text-sm font-semibold tracking-[0.14em] text-electric uppercase">
          Marcas que atendemos
        </h2>
        <p className="text-muted">Servicio multimarca. Si la tuya no aparece, consúltanos con el modelo de tu equipo.</p>
      </div>
      <div className="mx-auto mt-8 max-w-[1440px] border-y border-line sm:mt-10">
        <BrandsCarousel brands={brands} />
      </div>
    </section>
  );
}
