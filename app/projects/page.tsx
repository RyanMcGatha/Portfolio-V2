import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import { Chip } from "../components/util/Chip";
import { projects } from "./data";
import { Header } from "../components/nav/Header";
import Reveal from "../components/util/Reveal";

export const metadata: Metadata = {
  // The root layout appends "| Ryan McGatha", so the name is deliberately
  // omitted here — including it produced a doubled title in search results.
  title: "Web Development & Design Projects",
  description:
    "Case studies from a web developer in Greenville, SC: custom web apps, an editorial email system, an internal document platform, and AI integration work.",
  alternates: {
    canonical: "https://ryanm.info/projects",
  },
  openGraph: {
    title: "Web Development & Design Projects | Ryan McGatha",
    description:
      "Case studies from a Greenville, SC web developer — custom web apps, email design systems, internal tools, and AI integrations.",
    url: "https://ryanm.info/projects",
    type: "website",
    images: ["https://ryanm.info/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development & Design Projects | Ryan McGatha",
    description:
      "Case studies from a Greenville, SC web developer — custom web apps, email design systems, internal tools, and AI integrations.",
    images: ["https://ryanm.info/opengraph-image"],
  },
};

function ProjectsBreadcrumbJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://ryanm.info",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: "https://ryanm.info/projects",
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function ProjectsItemListJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://ryanm.info/projects/${p.slug}`,
      name: p.title,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function ProjectsIndexPage() {
  return (
    <>
      <ProjectsBreadcrumbJsonLd />
      <ProjectsItemListJsonLd />

      <div className="min-h-screen">
        <Header />

        <main className="max-w-5xl mx-auto px-4 md:px-8 pb-24">
          <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center gap-2 text-xs font-heading uppercase tracking-widest text-muted-foreground">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-foreground transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-foreground">Projects</li>
                </ol>
              </nav>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-sm font-heading tracking-widest uppercase text-muted-foreground mb-4">
                Selected Work &bull; Greenville, SC
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold leading-[1.1] text-foreground mb-6">
                Web Development
                <br />
                <span className="text-muted-foreground">&amp; Design Projects</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground max-w-2xl mb-6">
                A mix of full-stack web apps, email design systems, and AI work
                I&apos;ve designed and built as a web developer in Greenville,
                South Carolina. Each project has its own page with the full
                story, the tech behind it, and links to the live work.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="text-base leading-relaxed text-muted-foreground max-w-2xl">
                Most of my day-to-day is client work under NDA at Drum Creative,
                where I manage over 200 websites and build roughly one new site a
                week. The projects below are the ones I can show publicly — they
                cover the range of what I do: designing in Figma, building front
                ends in React and Next.js, wiring up Node.js and PostgreSQL back
                ends, hand-coding HTML email that survives Outlook, and shipping
                AI features into real products.
              </p>
            </Reveal>
          </section>

          <section className="border-t border-border">
            <ul className="divide-y divide-border">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Reveal delay={0.1} width="w-full">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 md:gap-10 py-10 items-start focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-[--radius] outline-none"
                    >
                      <div className="relative w-full aspect-video rounded-[var(--radius)] overflow-hidden bg-muted border border-border">
                        <Image
                          src={project.imgSrc}
                          alt={`Screenshot of the ${project.title} project`}
                          fill
                          sizes="(max-width: 768px) 100vw, 280px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3 text-xs font-heading uppercase tracking-widest text-muted-foreground mb-3">
                          <span>{project.category}</span>
                          <span aria-hidden="true">&bull;</span>
                          <span>{project.year}</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-heading text-foreground leading-tight mb-3 group-hover:text-muted-foreground transition-colors">
                          {project.title}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-5">
                          {project.tech.map((t) => (
                            <Chip
                              key={t}
                              className="text-xs px-2.5 py-1 subheading"
                            >
                              {t}
                            </Chip>
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-2 font-heading text-sm text-foreground">
                          Read case study
                          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>

          <section className="py-16 border-t border-border">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-heading text-foreground mb-4">
                What I Do for Clients
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-muted-foreground max-w-2xl mb-8">
                The projects above are case studies. If you are looking for the
                services themselves, these two pages cover what I take on, how
                the process works, and what it costs.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Reveal delay={0.15} width="w-full">
                <Link
                  href="/web-development"
                  className="group block h-full p-6 rounded-[--radius] border border-border hover:border-foreground/20 bg-card/50 transition-colors duration-300"
                >
                  <h3 className="font-heading text-foreground mb-2 inline-flex items-center gap-2">
                    Web development in Greenville, SC
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Custom websites, WordPress builds, redesigns, and web
                    applications — design and development from one person.
                  </p>
                </Link>
              </Reveal>
              <Reveal delay={0.2} width="w-full">
                <Link
                  href="/ai-services"
                  className="group block h-full p-6 rounded-[--radius] border border-border hover:border-foreground/20 bg-card/50 transition-colors duration-300"
                >
                  <h3 className="font-heading text-foreground mb-2 inline-flex items-center gap-2">
                    AI development in Greenville, SC
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    AI agents, chatbots, LLM integrations, and workflow
                    automation built into real products.
                  </p>
                </Link>
              </Reveal>
            </div>
          </section>

          <section className="py-16 border-t border-border text-center">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-heading text-foreground mb-4">
                Got a project in mind?
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                I&apos;m available for full-stack web work, design and email
                systems, and AI integrations across Greenville, SC and remotely.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-[--radius] font-heading text-sm hover:opacity-90 transition-opacity"
              >
                Contact Ryan McGatha
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Reveal>
          </section>
        </main>
      </div>
    </>
  );
}
