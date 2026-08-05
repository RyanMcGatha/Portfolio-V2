import type { Metadata } from "next";
import Link from "next/link";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { AiFillMail, AiFillPhone } from "react-icons/ai";
import { Header } from "../components/nav/Header";
import { ContactForm } from "../components/contact/ContactForm";
import Reveal from "../components/util/Reveal";

export const metadata: Metadata = {
  // Root layout appends "| Ryan McGatha" — don't repeat the name here.
  title: "Contact a Web Developer in Greenville, SC",
  description:
    "Contact Ryan McGatha, a web and AI developer in Greenville, SC. Free consultation for websites, web apps, and AI projects — local or fully remote.",
  alternates: {
    canonical: "https://ryanm.info/contact",
  },
  openGraph: {
    title: "Contact a Web Developer in Greenville, SC | Ryan McGatha",
    description:
      "Reach out about web development, web design, or AI development in Greenville, SC. Free consultation, no obligation.",
    url: "https://ryanm.info/contact",
    type: "website",
    images: ["https://ryanm.info/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact a Web Developer in Greenville, SC | Ryan McGatha",
    description:
      "Reach out about web development, web design, or AI development in Greenville, SC. Free consultation, no obligation.",
    images: ["https://ryanm.info/opengraph-image"],
  },
};

function ContactBreadcrumbJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://ryanm.info" },
      { "@type": "ListItem", position: 2, name: "Contact", item: "https://ryanm.info/contact" },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const contactLinks = [
  {
    icon: <AiFillMail className="h-5 w-5 shrink-0" />,
    label: "Email",
    value: "ryanmcgatha@gmail.com",
    href: "mailto:ryanmcgatha@gmail.com",
    external: false,
  },
  {
    icon: <AiFillPhone className="h-5 w-5 shrink-0" />,
    label: "Phone",
    value: "(864) 201-6487",
    href: "tel:+18642016487",
    external: false,
  },
  {
    icon: <SiLinkedin className="h-5 w-5 shrink-0" />,
    label: "LinkedIn",
    value: "linkedin.com/in/ryanmcgatha",
    href: "https://www.linkedin.com/in/ryanmcgatha",
    external: true,
  },
  {
    icon: <SiGithub className="h-5 w-5 shrink-0" />,
    label: "GitHub",
    value: "github.com/RyanMcGatha",
    href: "https://www.github.com/RyanMcGatha",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <ContactBreadcrumbJsonLd />

      <div className="min-h-screen">
        <Header />

        <main id="main-content" className="max-w-5xl mx-auto px-4 md:px-8 pb-24">
          <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center gap-2 text-xs font-heading uppercase tracking-widest text-muted-foreground">
                  <li>
                    <Link href="/" className="hover:text-foreground transition-colors">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-foreground">Contact</li>
                </ol>
              </nav>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-sm font-heading tracking-widest uppercase text-muted-foreground mb-4">
                Get In Touch &bull; Greenville, SC
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold leading-[1.1] text-foreground mb-6">
                Contact a Web Developer
                <br />
                <span className="text-muted-foreground">in Greenville, SC</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground max-w-2xl mb-6">
                Have a project in mind or want to talk through an idea? Fill out
                the form below or reach out directly — I&apos;m always happy to
                chat about web development, AI, or anything in between.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="text-base leading-relaxed text-muted-foreground max-w-2xl">
                I&apos;m Ryan McGatha, a full-stack web developer and designer
                based in Greenville, South Carolina. I work with businesses
                across the Upstate — Greenville, Greer, Simpsonville, Mauldin,
                Easley, Spartanburg, and Anderson — and take on remote projects
                nationwide. Whether you need a brand-new website, a rebuild of
                one that has aged badly, a custom web application, or an AI
                integration, the first conversation is free and there is no
                obligation attached to it.
              </p>
            </Reveal>
          </section>

          <section className="border-t border-border py-16">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-heading text-foreground mb-8">
                What I can help with
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              <Reveal delay={0.1} width="w-full">
                <Link
                  href="/web-development"
                  className="group block h-full p-6 rounded-[--radius] border border-border hover:border-foreground/20 bg-card/50 transition-colors duration-300"
                >
                  <h3 className="font-heading text-foreground mb-2">
                    Web development &amp; design
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Custom websites, WordPress builds and maintenance,
                    redesigns, e-commerce, HTML email, and custom web
                    applications in React and Next.js.
                  </p>
                </Link>
              </Reveal>
              <Reveal delay={0.15} width="w-full">
                <Link
                  href="/ai-services"
                  className="group block h-full p-6 rounded-[--radius] border border-border hover:border-foreground/20 bg-card/50 transition-colors duration-300"
                >
                  <h3 className="font-heading text-foreground mb-2">
                    AI development
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    AI agents, chatbots trained on your business data, LLM
                    integrations, RAG pipelines, and workflow automation.
                  </p>
                </Link>
              </Reveal>
            </div>

            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-heading text-foreground mb-6">
                What happens after you reach out
              </h2>
            </Reveal>
            <ol className="space-y-4 max-w-2xl mb-12">
              {[
                "I reply within one business day — usually the same day.",
                "We have a short conversation about the business, what you need, and what is not working now. No charge, no pitch deck.",
                "I send back a scope and a transparent price before any work begins, so you know exactly what you are getting.",
              ].map((item, index) => (
                <Reveal
                  as="li"
                  key={item}
                  delay={0.05 * index}
                  width="w-full"
                  className="flex gap-4 text-muted-foreground leading-relaxed"
                >
                  <span className="font-heading text-foreground shrink-0">
                    0{index + 1}
                  </span>
                  <span>{item}</span>
                </Reveal>
              ))}
            </ol>

            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-heading text-foreground mb-6">
                Helpful things to include
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mb-4">
                None of this is required — a one-line message is completely
                fine, and I would rather hear from you with half the details
                than not at all. But if you already know the answers, including
                them means my first reply can be useful instead of a list of
                questions:
              </p>
            </Reveal>
            <ul className="space-y-3 max-w-2xl">
              {[
                "Your current website address, if you have one, and what specifically frustrates you about it.",
                "What you need the site or app to actually do — sell something, book appointments, generate leads, replace a manual process.",
                "Whether you need design work too, or you already have branding and designs to build from.",
                "Any deadline you are working toward, and a rough budget range if you have one in mind.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-muted-foreground leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground/30 shrink-0"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-border py-16">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-12 md:gap-16">

              <div>
                <Reveal width="w-full">
                  <h2 className="text-2xl font-heading text-foreground mb-8">
                    Send a message
                  </h2>
                </Reveal>
                <Reveal width="w-full" delay={0.1}>
                  <ContactForm />
                </Reveal>
              </div>

              <aside>
                <Reveal delay={0.15} width="w-full">
                  <h2 className="text-2xl font-heading text-foreground mb-8">
                    Other ways to reach me
                  </h2>
                </Reveal>
                <div className="space-y-4">
                  {contactLinks.map((link, index) => (
                    <Reveal key={link.label} delay={0.2 + index * 0.08} width="w-full">
                      <Link
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="group flex items-start gap-4 p-4 rounded-[--radius] border border-border hover:border-foreground/20 bg-card/50 transition-colors duration-300"
                      >
                        <span className="mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors">
                          {link.icon}
                        </span>
                        <div>
                          <p className="text-xs font-heading uppercase tracking-widest text-muted-foreground mb-0.5">
                            {link.label}
                          </p>
                          <p className="text-sm font-heading text-foreground group-hover:text-muted-foreground transition-colors">
                            {link.value}
                          </p>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>

                <Reveal delay={0.55} width="w-full">
                  <div className="mt-8 p-4 rounded-[--radius] border border-border bg-card/50">
                    <p className="text-xs font-heading uppercase tracking-widest text-muted-foreground mb-2">
                      Location
                    </p>
                    <p className="text-sm text-foreground font-heading">
                      Greenville, South Carolina
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Available for local and remote projects
                    </p>
                  </div>
                </Reveal>
              </aside>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
