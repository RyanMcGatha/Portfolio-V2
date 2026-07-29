"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type GtagFn = (
  command: "event",
  eventName: string,
  params?: Record<string, string | number | boolean>
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Fire a GA4 event if analytics has loaded. Safe to call before gtag exists.
 * `page_path` is auto-filled from the current location unless the caller
 * already supplied one, since almost every event wants it.
 *
 * Also mirrors the event onto `dataLayer` so GTM can react to it for
 * destinations other than GA4 (e.g. an ads conversion tag) — GA4 itself is
 * fed directly via gtag above, not through GTM, so this mirror is never a
 * second copy of the same GA4 hit.
 */
export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean> = {}
) {
  if (typeof window === "undefined") return;
  const enriched = { page_path: window.location.pathname, ...params };
  if (typeof window.gtag === "function") window.gtag("event", name, enriched);
  window.dataLayer?.push({ event: name, ...enriched });
}

const SCROLL_THRESHOLDS = [25, 50, 75, 90, 100];

/**
 * Sitewide analytics instrumentation. Mounted once at the root layout.
 *
 * Covers what GA4's automatic pageview + Enhanced Measurement can't:
 *   - page_view on client-side route changes (the gtag config below sets
 *     send_page_view: false, so the *first* pageview also comes from here —
 *     otherwise Next's client router navigations between pages never fire a
 *     second GA4 pageview and traffic looks like a single-page site).
 *   - granular scroll depth (25/50/75/90/100%) instead of Enhanced
 *     Measurement's single 90% event.
 *   - section_view for the homepage's scrollytelling sections, via the same
 *     `.section-wrapper` elements SideBar already observes for nav highlighting.
 *   - click classification via one delegated listener: contact links, resume
 *     download, project card links (matched off their existing aria-labels,
 *     no markup changes needed), tagged nav links (data-nav), and a catch-all
 *     outbound-click for anything else that leaves the site.
 *
 * These still have to be marked as key events in GA4 Admin → Events before
 * they count as conversions, and new event params need to be registered as
 * custom dimensions (GA4 Admin → Custom definitions) before they're usable
 * as report/exploration dimensions.
 */
export function ConversionTracking() {
  const pathname = usePathname();
  const lastPageView = useRef<string | null>(null);

  // Route-change pageviews.
  useEffect(() => {
    if (lastPageView.current === pathname) return;
    lastPageView.current = pathname;
    trackEvent("page_view", {
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  // Scroll depth, reset per route.
  useEffect(() => {
    const fired = new Set<number>();
    let ticking = false;

    function measure() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 100;
      for (const t of SCROLL_THRESHOLDS) {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          trackEvent("scroll_depth", { percent_scrolled: t });
        }
      }
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    measure();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Section views (homepage's #about/#projects/#experience/#contact).
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".section-wrapper");
    if (!sections.length) return;

    const viewed = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id && !viewed.has(entry.target.id)) {
            viewed.add(entry.target.id);
            trackEvent("section_view", { section: entry.target.id });
          }
        }
      },
      { threshold: 0.3 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  // Delegated click classification.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      const ariaLabel = link.getAttribute("aria-label") ?? "";

      if (href.startsWith("tel:") || href.startsWith("mailto:")) {
        trackEvent("contact_click", {
          method: href.startsWith("tel:") ? "phone" : "email",
          link_url: href,
        });
        return;
      }

      const detailMatch = ariaLabel.match(/^View details for (.+)$/);
      if (detailMatch) {
        trackEvent("select_content", { content_type: "project", item_id: detailMatch[1] });
        return;
      }

      const codeMatch = ariaLabel.match(/^(.+) source code on GitHub$/);
      if (codeMatch) {
        trackEvent("project_external_click", { project: codeMatch[1], link_type: "code", link_url: href });
        return;
      }

      const liveMatch = ariaLabel.match(/^(.+) live project$/);
      if (liveMatch) {
        trackEvent("project_external_click", { project: liveMatch[1], link_type: "live", link_url: href });
        return;
      }

      if (/^\/resume\.pdf/.test(href)) {
        trackEvent("resume_download", { link_url: href });
        return;
      }

      if (/linkedin\.com|github\.com/i.test(href) && link.target === "_blank") {
        trackEvent("social_click", {
          network: /linkedin/i.test(href) ? "linkedin" : "github",
          link_url: href,
        });
        return;
      }

      const navSource = link.closest<HTMLElement>("[data-nav]")?.dataset.nav;
      if (navSource) {
        trackEvent("nav_click", {
          nav_source: navSource,
          link_text: (link.textContent ?? "").trim().slice(0, 60),
          destination: href,
        });
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        if (url.hostname !== window.location.hostname) {
          trackEvent("outbound_click", { link_url: href, link_domain: url.hostname });
        }
      } catch {
        // relative/invalid href — not outbound, nothing to do
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
