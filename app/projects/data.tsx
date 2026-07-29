import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export interface ProjectData {
  slug: string;
  title: string;
  imgSrc: string;
  tech: string[];
  /** Lead paragraph shown on the page — can run long. */
  description: string;
  /**
   * 140–160 char version used for <meta name="description">. Google truncates
   * around 160, so the on-page lead copy can't double as the snippet.
   */
  metaDescription?: string;
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
    metaDescription:
      "An editorial email system designed and hand-coded for a Greenville-area animal shelter — two Paw Prints newsletters and an auto-reply on one design system.",
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
      "A real-time messaging application with secure registration, JWT-protected routes, direct messages, and group chats — built as a full-stack web app in React with a PostgreSQL backend.",
    metaDescription:
      "A full-stack real-time messaging web app with JWT authentication, direct messages, and group chats — built in React with a PostgreSQL backend.",
    body: (
      <>
        <p>
          Push It! is a real-time messaging platform I designed and built to
          handle the two things every chat app has to get right: knowing who
          somebody is, and making sure they only ever see the conversations
          they belong to. Users register and sign in, then start direct
          conversations or create group chats — with access to each thread
          restricted to its participants.
        </p>

        <h2>The problem worth solving</h2>
        <p>
          Messaging looks simple until you write it. A message is easy; a
          message that only the right two people can read, in a thread that
          persists, behind an API that refuses everyone else, is the actual
          engineering. Most of the work on this project went into the
          authorization layer rather than the chat interface.
        </p>
        <p>
          Every protected API route sits behind JSON Web Token verification.
          The token is issued at login and checked on each subsequent request,
          so an endpoint cannot be called by simply knowing its URL. Chats
          themselves carry a user-protected status — being authenticated is not
          enough to read a thread, you have to be a participant in it. That
          distinction between authentication (who are you) and authorization
          (what are you allowed to see) is the part that most tutorial-grade
          chat apps skip.
        </p>

        <h2>How it is built</h2>
        <p>
          The interface is a React single-page application built with Vite and
          styled with Tailwind CSS, structured around conversation lists,
          thread views, and group creation. Data lives in PostgreSQL — users,
          chats, chat membership, and messages — reached through auto-generated
          REST and GraphQL endpoints, which meant I could move quickly on the
          data layer and spend the time on access control and the client
          instead of hand-writing boilerplate CRUD.
        </p>
        <p>
          The application is deployed and publicly available, and the source is
          on GitHub across roughly 74 commits of iteration.
        </p>

        <h2>What I took from it</h2>
        <p>
          This was the project where token-based auth stopped being a concept I
          had read about and became something I had debugged — expired tokens,
          protected-route redirects, and the difference between hiding a
          feature in the UI and actually refusing it at the API. That
          distinction carries into every client application I have built since,
          including internal tools where the data is far more sensitive than
          chat messages.
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
      "An internal document management system built under contract for a Greenville, SC franchise operation — centralizing the paperwork franchisees need so operations and new-location onboarding stop depending on email attachments.",
    metaDescription:
      "An internal document management web app built under contract for a Greenville, SC franchise — React, Tailwind, and Supabase on PostgreSQL.",
    body: (
      <>
        <p>
          I built this internal document management system as a Contract
          Software Developer for Sully&apos;s Steamers, a Greenville, South
          Carolina restaurant business expanding into franchising. It is the
          kind of project that never gets a marketing page: unglamorous,
          internal, and the difference between a franchise system that scales
          and one that runs on forwarded email attachments.
        </p>

        <h2>The problem worth solving</h2>
        <p>
          Franchising multiplies paperwork. Every new location needs the same
          set of operational documents — procedures, training material, brand
          standards, forms — and every one of those documents gets revised over
          time. When that lives in inboxes and shared drives, two things go
          wrong immediately: nobody is certain which version is current, and
          onboarding a new franchisee becomes a manual scavenger hunt for
          somebody at headquarters.
        </p>
        <p>
          The goal was a single place where the current version of any document
          is the one you find, accessible to the franchisees who need it and
          closed to everyone else.
        </p>

        <h2>How it is built</h2>
        <p>
          The front end is a React application styled with Tailwind CSS,
          organized around browsing and retrieving documents quickly rather
          than around admin-panel conventions — the people using it are running
          restaurants, not filing tickets.
        </p>
        <p>
          The backend runs on Supabase, which gave me PostgreSQL for relational
          document metadata, authentication for gating access, and file storage
          for the documents themselves behind one consistent set of APIs. For a
          contract project on a real timeline, that mattered: I could put the
          effort into the data model and the access rules instead of standing up
          and maintaining separate services for auth, storage, and database.
        </p>

        <h2>What I took from it</h2>
        <p>
          This was my first contract engagement where the requirements came from
          how a business actually operates rather than from a spec I wrote
          myself, and it reshaped how I start projects. The useful questions
          turned out to be organizational, not technical: who needs to see
          this, who is allowed to change it, and what happens when the document
          is revised six months from now. I ask those first on every internal
          tool I have built since.
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
      "A teaching project for FastAPI and PostgreSQL — a guided walkthrough of project setup, models, schemas, CRUD operations, and endpoints, paired with a live API route students can reconfigure from drop-down menus.",
    metaDescription:
      "A teaching project and interactive playground for FastAPI and PostgreSQL — project setup, models, schemas, CRUD operations, and live API endpoints.",
    body: (
      <>
        <p>
          This is a teaching project: a guide to building a FastAPI application
          from an empty directory to working endpoints, written for students
          learning backend development. It walks through project setup, defining
          database models, writing schemas for request and response validation,
          implementing CRUD operations, and exposing them as API endpoints
          backed by PostgreSQL.
        </p>

        <h2>The problem worth solving</h2>
        <p>
          Most API tutorials fail in the same place. A student can follow along
          and produce working code without ever forming a mental model of what a
          request actually is — that a URL, a method, a set of query parameters,
          and a body are separate, changeable things, and that changing one
          changes the response in a predictable way. Reading about it does not
          fix that. Changing it and watching the result does.
        </p>

        <h2>How it is built</h2>
        <p>
          Rather than only documenting the endpoints, the project ships an
          interactive route: a preset API request with drop-down menus that let
          students recompose different parts of it and immediately see what
          comes back. The abstract idea of &ldquo;the parameters shape the
          response&rdquo; becomes something they can operate.
        </p>
        <p>
          The backend is FastAPI in Python, connected to a PostgreSQL database,
          following the same layered structure the tutorial teaches — models for
          the database layer, schemas for validation at the boundary, and
          endpoint handlers kept thin. The companion front end that hosts the
          interactive explorer is built with Vite and styled with Tailwind CSS,
          and the project is deployed publicly so students can use it without
          installing anything first.
        </p>

        <h2>What I took from it</h2>
        <p>
          Explaining something forces you to actually understand it. Writing
          this made me articulate why schemas belong at the boundary and why
          endpoint handlers should stay thin — decisions I had been making by
          imitation until I had to defend them to someone learning from scratch.
          It is also a reminder that documentation you can click beats
          documentation you can only read.
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
