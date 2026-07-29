"use client";

import { useEffect } from "react";

type GtagFn = (
  command: "event",
  eventName: string,
  params?: Record<string, string | number | boolean>
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

/** Fire a GA4 event if analytics has loaded. Safe to call before gtag exists. */
export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean> = {}
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/**
 * Sitewide conversion tracking.
 *
 * GA4 recorded zero key events, so there was no way to tell whether traffic
 * turned into leads. Rather than convert every server component that renders a
 * phone or email link into a client component, this listens once at the
 * document level and reports clicks on tel:/mailto: links.
 *
 * These still have to be marked as key events in GA4 Admin → Events before
 * they count as conversions.
 */
export function ConversionTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>(
        'a[href^="tel:"], a[href^="mailto:"]'
      );
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      trackEvent("contact_click", {
        method: href.startsWith("tel:") ? "phone" : "email",
        link_url: href,
        page_path: window.location.pathname,
      });
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
