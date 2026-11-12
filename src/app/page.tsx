import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Brands } from "@/components/sections/Brands";
import { Services } from "@/components/sections/Services";
import { Coverage } from "@/components/sections/Coverage";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { JsonLd } from "@/components/seo/JsonLd";
import { BackToTop } from "@/components/ui/BackToTop";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="contenido">
        <Hero />
        <Brands />
        <Services />
        <Coverage />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <FloatingWhatsApp />
      <JsonLd />
    </>
  );
}
