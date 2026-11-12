"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  event: AnalyticsEvent;
  eventParams?: Record<string, string>;
  children: ReactNode;
}

/** Enlace externo (WhatsApp / teléfono) que registra un evento de conversión al hacer clic. */
export function TrackedLink({ event, eventParams, onClick, children, ...props }: TrackedLinkProps) {
  const isExternal = props.href.startsWith("http");
  return (
    <a
      {...props}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(e) => {
        trackEvent(event, eventParams);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
