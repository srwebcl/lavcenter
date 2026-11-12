import type { Metadata } from "next";
import { business, coverage, joinList } from "@/config/site";
import { siteUrl } from "@/lib/site-url";

export const seo = {
  title: `Servicio técnico de lavadoras y electrodomésticos | ${business.name}`,
  description: `Servicio técnico de lavadoras, secadoras y lavavajillas en ${joinList(coverage.areas)}. Reparación, mantención y diagnóstico multimarca.`,
  keywords: [
    "servicio técnico de lavadoras",
    "reparación de lavadoras",
    "técnico de lavadoras",
    "reparación de secadoras",
    "reparación de lavavajillas",
    "servicio técnico de electrodomésticos",
  ],
};

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  applicationName: business.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "/",
    siteName: business.name,
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};
