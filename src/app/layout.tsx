import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { siteMetadata } from "@/config/metadata";
import { Analytics, AnalyticsNoScript } from "@/components/analytics/Analytics";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = {
  themeColor: "#062f62",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-CL" className={poppins.variable}>
      <body>
        <AnalyticsNoScript />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
