import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export interface ProjectData {
  slug: string;
  title: string;
  imgSrc: string;
  tech: string[];
  description: string;
  projectLink: string;
  projectLinkLabel?: string;
  code?: string;
  category: string;
  year: string;
  body: ReactNode;
}

export const projects: ProjectData[] = [
  {
    slug: "cca-email-suite",
    title: "CCA Email Suite — Newsletter & Auto-Reply",
    imgSrc: "/cca-emails.png",
    projectLink: "/cca-emails.html",
    projectLinkLabel: "Open Email Suite",
    category: "Email Design & Development",
    year: "2026",
    tech: [
      "Email Design",
      "HTML",
      "CSS",
      "Bulletproof Tables",
      "Figma",
      "Mailchimp",
    ],
    description:
      "A three-piece email suite designed and developed for Concerned Citizens for Animals — Paw Prints Spring 2026, Paw Prints Winter 2025, and a send-only auto-reply, all sharing one editorial design system.",
    body: (
      <>
        <p>
          A complete editorial email system designed and built from scratch
          for Concerned Citizens for Animals (CCA), a Greenville-area
          no-kill animal shelter. The suite includes three production
          emails: <em>Paw Prints — Spring 2026</em> (Issue No. 01 of the
          rebranded newsletter), <em>Paw Prints — Winter 2025</em> (the
          holiday catch-up issue), and a send-only auto-reply for
          newsletter@ccaweb.org that redirects accidental replies to the
          right contact channels.
        </p>

        <section className="not-prose pt-4">
          <p className="text-xs font-heading uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Before &amp; After
          </p>
          <h2 className="text-2xl sm:text-3xl font-heading text-foreground mb-5 leading-tight">
            From a default Mailchimp template to a brand identity.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-8">
            CCA&apos;s previous newsletter was a stock Mailchimp
            drag-and-drop: logo, a centered paragraph blob, raw shop URLs
            pasted into body copy, two bright-blue buttons, and three
            social icons whose links were left as <code>https://</code>{" "}
            placeholders. The redesign rebuilds it as a hand-coded
            editorial email with a real masthead, a hero image, an impact
            grid, branded sections, and a donate card — all in one
            consistent design system reused across the auto-reply, Winter
            2025, and Spring 2026 issues.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <figure className="m-0">
              <div className="relative aspect-[3/4] rounded-[var(--radius)] overflow-hidden border border-border bg-white">
                <Image
                  src="/cca-emails-before.png"
                  alt="Before: the previous CCA Paw Prints email — a default Mailchimp template with logo, plain paragraphs, raw shop URLs, and two blue buttons."
                  fill
                  sizes="(max-width: 640px) 100vw, 360px"
                  className="object-cover object-top"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-3 text-xs font-heading uppercase tracking-[0.18em] text-muted-foreground">
                <span>Before — Default Mailchimp template</span>
                <Link
                  href="/cca-emails/before-paw-prints-spring-2026.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground border-b border-foreground/40 hover:border-foreground transition-colors normal-case tracking-normal"
                >
                  View live →
                </Link>
              </figcaption>
            </figure>

            <figure className="m-0">
              <div
                className="relative aspect-[3/4] rounded-[var(--radius)] overflow-hidden border border-border"
                style={{ backgroundColor: "#f5f2ed" }}
              >
                <Image
                  src="/cca-emails-after.png"
                  alt="After: the redesigned Paw Prints Spring 2026 newsletter — cream palette, serif Paw Prints masthead, hero photo, three-column impact stats, and editorial sections."
                  fill
                  sizes="(max-width: 640px) 100vw, 360px"
                  className="object-cover object-top"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-3 text-xs font-heading uppercase tracking-[0.18em] text-muted-foreground">
                <span>After — Paw Prints Spring 2026</span>
                <Link
                  href="/cca-emails/spring-2026.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground border-b border-foreground/40 hover:border-foreground transition-colors normal-case tracking-normal"
                >
                  View live →
                </Link>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="not-prose pt-6">
          <h3 className="text-xl sm:text-2xl font-heading text-foreground mb-6">
            What changed
          </h3>
          <ul className="divide-y divide-border border-y border-border">
            {[
              {
                aspect: "Visual identity",
                before:
                  "Default Mailchimp template — black text on white, generic Helvetica-only typography, centered paragraph blob.",
                after:
                  "Custom editorial system — cream + ink palette (#f5f2ed / #1a1a1a), serif masthead, structured layout, brand-owned look and feel.",
              },
              {
                aspect: "Masthead & hero",
                before: "Logo only. No issue number, no tagline, no hero image.",
                after:
                  "Custom “Paw Prints” serif lockup with issue eyebrow, italic tagline, and a full-width hero photo with caption.",
              },
              {
                aspect: "Story structure",
                before:
                  "One centered paragraph blob followed by a list of raw URLs pasted into body copy.",
                after:
                  "Sectioned editorial: From the Desk lead story, an impact grid, the Wish List, a Donate card, a Get-in-Touch directory, and a footer.",
              },
              {
                aspect: "Impact reporting",
                before: "None.",
                after:
                  "Three-column stat grid framed top and bottom — 199 animals placed, 708 community cats via TNR, $248K in medical care.",
              },
              {
                aspect: "Calls to action",
                before:
                  "Two stacked bright-blue buttons — “CCA” and a long PDF-link button.",
                after:
                  "A dark featured-issue CTA card with eyebrow, headline, body, and a cream pill button — plus a separate dark donate card with hybrid two-up PayPal/Shelter Luv buttons and text-to-give.",
              },
              {
                aspect: "Social & footer",
                before:
                  "Three Mailchimp social icons whose hrefs were left as “https://” placeholders, plus an unrendered Mailchimp merge-tag block in the legal text.",
                after:
                  "Real text links (Website / Facebook / Instagram / Petfinder), polished copyright + 501(c)(3) line, and clean Update Preferences / Unsubscribe links.",
              },
              {
                aspect: "Mobile & rendering reliability",
                before:
                  "Mailchimp defaults — fine, but no specific accommodations for stacking, iOS rendering, or dark mode.",
                after:
                  "A custom mobile breakpoint stacks columns and retunes type, the suite forces a light-only color scheme, all rgba/opacity colors are pre-blended to solid hex so Gmail iOS doesn’t flatten them to black, and selectors stay class-only so Gmail iOS doesn’t strip the style block.",
              },
            ].map((row) => (
              <li
                key={row.aspect}
                className="grid grid-cols-1 md:grid-cols-[160px_1fr_1fr] gap-x-6 gap-y-2 py-5"
              >
                <div className="text-xs font-heading uppercase tracking-[0.2em] text-muted-foreground md:pt-1">
                  {row.aspect}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <span className="block text-[10px] font-heading uppercase tracking-[0.2em] text-muted-foreground/70 mb-1 md:hidden">
                    Before
                  </span>
                  {row.before}
                </div>
                <div className="text-sm sm:text-base text-foreground leading-relaxed">
                  <span className="block text-[10px] font-heading uppercase tracking-[0.2em] text-muted-foreground/70 mb-1 md:hidden">
                    After
                  </span>
                  {row.after}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <p className="pt-4">
          Designed in Figma and hand-coded as bulletproof, table-based HTML
          emails sharing one design system: a serif &ldquo;Paw Prints&rdquo;
          masthead, a dark CTA card pattern, three-column impact stat
          grids, an essentials wish list, and a dark donate card with
          hybrid-responsive two-up buttons. Every visual style is
          duplicated inline against a Gmail-safe style block, with MSO/IE
          ghost tables for desktop Outlook and a single mobile breakpoint
          that stacks columns and re-aligns the masthead, donate buttons,
          and stat grid for narrow viewports.
        </p>
        <p>
          Reliability work was a big part of this project: forcing a
          light-only color scheme so dark-mode clients don&apos;t recolor
          the cream palette, replacing all rgba/opacity colors with solid
          hex blends so Gmail iOS doesn&apos;t flatten them to black,
          avoiding any unsupported selectors that would cause Gmail iOS to
          strip the entire style block, and writing CSS comments carefully
          so Mailchimp&apos;s processor doesn&apos;t mangle them.
        </p>
        <p>
          End-to-end ownership: art direction, typography, layout,
          illustration choices, copywriting, hand-coded HTML/CSS,
          cross-client QA in Gmail (web + iOS + Android), Apple Mail,
          Outlook, and Mailchimp, and delivery as production-ready
          templates the CCA team can drop into Mailchimp issue after issue.
        </p>
      </>
    ),
  },
  {
    slug: "push-it-messaging",
    title: "Push It! Real-Time Messaging App",
    imgSrc: "/pushit.dev.png",
    code: "https://github.com/RyanMcGatha/Push-It---Messaging-App",
    projectLink: "https://push-it.netlify.app",
    category: "Full-Stack Web App",
    year: "2024",
    tech: ["React.js", "PostgreSQL", "Node.js", "Express.js", "JWT"],
    description:
      "A real-time messaging application offering secure user registration and dynamic messaging capabilities.",
    body: (
      <>
        <p>
          Push It! is a real-time messaging application developed with
          React.js, PostgreSQL, Node.js, Express.js, and JWT. It offers
          secure user registration and dynamic messaging features.
        </p>
        <p>
          This project showcases my ability to quickly learn and apply new
          technologies, demonstrating my skills in full-stack development.
        </p>
      </>
    ),
  },
  {
    slug: "sullys-franchise-management",
    title: "Internal Franchise Document Management System",
    imgSrc: "/steamyfiles.png",
    code: "https://github.com/RyanMcGatha/sullys-franchise-management-system",
    projectLink: "https://steamyfiles.com/",
    category: "Web App",
    year: "2024",
    tech: ["React.js", "PostgreSQL", "Tailwind CSS", "Supabase"],
    description:
      "A comprehensive document management system to enhance operational efficiency and support franchise expansion.",
    body: (
      <>
        <p>
          The Internal Franchise Document Management System is designed to
          streamline operations and support franchise expansion.
        </p>
        <p>
          Utilizing React.js for the frontend, PostgreSQL for database
          management, Tailwind CSS for styling, and Supabase for backend
          services, this project significantly improved the company&apos;s
          operational efficiency.
        </p>
      </>
    ),
  },
  {
    slug: "fastapi-tutorial",
    title: "FastAPI Tutorial",
    imgSrc: "/fastapi.png",
    code: "https://github.com/RyanMcGatha/fast-api-tutorial",
    projectLink: "https://fastapi-tutorial.netlify.app/",
    category: "Backend / Education",
    year: "2024",
    tech: ["Python", "FastAPI", "PostgreSQL"],
    description:
      "A tutorial project demonstrating the use of FastAPI with PostgreSQL, including a preset API route with customizable request parameters.",
    body: (
      <>
        <p>
          The FastAPI Tutorial project demonstrates the use of FastAPI with
          PostgreSQL. It features a preset API route with drop-down menus
          to customize different parts of the API request.
        </p>
        <p>
          This project is designed to teach students how to build efficient
          and scalable backend services using FastAPI.
        </p>
      </>
    ),
  },
];

export function getProject(slug: string): ProjectData | undefined {
  return projects.find((p) => p.slug === slug);
}

export function isExternalLink(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
