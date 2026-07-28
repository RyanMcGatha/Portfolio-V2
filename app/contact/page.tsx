import type { Metadata } from "next";
import Link from "next/link";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { AiFillMail, AiFillPhone } from "react-icons/ai";
import { Header } from "../components/nav/Header";
import { ContactForm } from "../components/contact/ContactForm";
import Reveal from "../components/util/Reveal";

export const metadata: Metadata = {
  title: "Contact | Ryan McGatha — Web & AI Developer in Greenville, SC",
  description:
    "Get in touch with Ryan McGatha, a full-stack web and AI developer based in Greenville, SC. Available for web development, AI agent projects, and freelance work locally and remotely.",
  alternates: {
    canonical: "https://ryanm.info/contact",
  },
  openGraph: {
    title: "Contact Ryan McGatha | Web & AI Developer Greenville SC",
    description:
      "Reach out to Ryan McGatha for web development, AI agent development, and freelance projects in Greenville, SC.",
    url: "https://ryanm.info/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Ryan McGatha | Web & AI Developer Greenville SC",
    description:
      "Reach out to Ryan McGatha for web development, AI agent development, and freelance projects in Greenville, SC.",
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

        <main className="max-w-5xl mx-auto px-4 md:px-8 pb-24">
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
                Contact
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground max-w-2xl">
                Have a project in mind or want to talk through an idea? Fill out
                the form below or reach out directly — I&apos;m always happy to
                chat about web development, AI, or anything in between.
              </p>
            </Reveal>
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
