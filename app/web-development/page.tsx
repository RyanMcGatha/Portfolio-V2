import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  Palette,
  LayoutTemplate,
  Code2,
  ShoppingCart,
  RefreshCw,
  Mail,
  Wrench,
  Search,
} from "lucide-react";
import { Header } from "../components/nav/Header";
import Reveal from "../components/util/Reveal";

export const metadata: Metadata = {
  title: "Web Developer in Greenville, SC",
  description:
    "Web developer and designer in Greenville, SC. Custom websites, WordPress builds, and web apps in React and Next.js. 200+ client sites shipped.",
  keywords: [
    "web developer Greenville SC",
    "web development Greenville SC",
    "web designer Greenville SC",
    "WordPress developer Greenville SC",
    "React developer Greenville SC",
    "freelance web developer Greenville",
    "custom web application development",
  ],
  openGraph: {
    title: "Web Developer in Greenville, SC | Ryan McGatha",
    description:
      "Custom websites, WordPress builds, and web applications for Greenville, SC businesses. Design and development from one developer.",
    url: "https://ryanm.info/web-development",
    type: "website",
    siteName: "Ryan McGatha - Web Developer Greenville SC",
    images: ["https://ryanm.info/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Developer in Greenville, SC | Ryan McGatha",
    description:
      "Custom websites, WordPress builds, and web apps for Greenville, SC businesses. Design and development from one developer.",
    images: ["https://ryanm.info/opengraph-image"],
  },
  alternates: {
    canonical: "https://ryanm.info/web-development",
  },
};

const services = [
  {
    icon: Palette,
    title: "Website Design",
    description:
      "Custom design work in Figma before a line of code is written — typography, layout, and hierarchy built around what your business actually needs to say. No stock templates dressed up as custom work.",
  },
  {
    icon: LayoutTemplate,
    title: "Business & Marketing Websites",
    description:
      "Fast, mobile-first marketing sites for Greenville businesses that need to be found and trusted. Built to load quickly, read clearly on a phone, and turn visitors into phone calls and form fills.",
  },
  {
    icon: Code2,
    title: "Custom Web Applications",
    description:
      "When an off-the-shelf tool does not fit, I build the application: dashboards, internal tools, client portals, and document systems in React, Next.js, Node.js, and PostgreSQL.",
  },
  {
    icon: Wrench,
    title: "WordPress Development & Care",
    description:
      "Custom WordPress builds plus ongoing maintenance, updates, and troubleshooting. I currently manage over 200 client websites, so nothing about a broken plugin or a stalled update is new territory.",
  },
  {
    icon: RefreshCw,
    title: "Website Redesigns & Rebuilds",
    description:
      "Already have a site that looks dated, loads slowly, or cannot be edited without breaking? I rebuild it on a modern stack while keeping the URLs, content, and search rankings you have already earned.",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce & Booking",
    description:
      "Product catalogs, checkout flows, scheduling, and payment integrations wired into a site your team can actually run day to day without calling a developer for every change.",
  },
  {
    icon: Mail,
    title: "Email Design & Development",
    description:
      "Hand-coded, bulletproof HTML email that survives Gmail, Outlook, and Apple Mail — newsletters and campaign templates your team can reuse issue after issue in Mailchimp.",
  },
  {
    icon: Search,
    title: "Technical SEO Foundations",
    description:
      "Clean semantic markup, structured data, sitemaps, canonical tags, and Core Web Vitals handled during the build — so the site has a real chance of ranking instead of needing an SEO rescue later.",
  },
];

const process = [
  {
    step: "01",
    title: "Conversation",
    description:
      "We talk about the business, not the tech. Who your customers are, what you need the site to do, and what is not working now. Free, and there is no obligation attached to it.",
  },
  {
    step: "02",
    title: "Design in Figma",
    description:
      "I wireframe and design the pages before development starts, so you see and approve the real layout and typography instead of imagining it from a description.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Development in React, Next.js, and TypeScript, or in WordPress when that is the better fit for how your team works. Responsive, accessible, and fast by default.",
  },
  {
    step: "04",
    title: "Review & Launch",
    description:
      "You get a staging link to click through on your own devices. I handle revisions, cross-browser checks, redirects, analytics, and the DNS cutover on launch day.",
  },
  {
    step: "05",
    title: "Support After Launch",
    description:
      "Sites need care. Updates, content changes, new pages, monitoring, and fixes — handled directly by the person who built it, not routed through a ticket queue.",
  },
];

const faqs = [
  {
    q: "How much does a website cost in Greenville, SC?",
    a: "It depends on scope, and any developer who quotes you a firm number before understanding the project is guessing. A focused marketing site for a small business is a very different budget from a custom web application with user accounts and a database. I scope the work in a free consultation and give you a transparent, itemized price before anything starts — no hourly surprises.",
  },
  {
    q: "How long does it take to build a website?",
    a: "A straightforward business or marketing site typically takes 2 to 4 weeks from kickoff to launch. A custom web application with authentication, a database, and admin tooling usually runs 6 to 12 weeks. The single biggest factor is how quickly content and feedback come back, so I set clear checkpoints up front to keep things moving.",
  },
  {
    q: "Do you design the site as well as build it?",
    a: "Yes — that is the point of hiring one person for both. I design in Figma and then build what I designed, so nothing gets lost in a handoff between a designer and a developer. You are not paying two vendors to translate each other's work, and there is no one to blame when the built site does not match the mockup.",
  },
  {
    q: "Should I use WordPress or a custom-built site?",
    a: "It depends on who edits the site and what it needs to do. WordPress is a good fit when your team publishes content regularly and wants a familiar admin area. A custom React or Next.js build is better when you need unusual functionality, top-tier performance, or an application rather than a set of pages. I build both and will tell you honestly which one fits — including when the cheaper option is the right one.",
  },
  {
    q: "Do you work with businesses outside of Greenville?",
    a: "Yes. I am based in Greenville, South Carolina and I am glad to meet in person with local clients across the Upstate, but most of my work happens remotely and I take on projects nationwide. Location changes where we meet; it does not change how the work gets done.",
  },
  {
    q: "I searched for a web developer near me and found agencies. Why hire an individual developer?",
    a: "At an agency, the person who sells you the project is usually not the person who builds it, and your work sits in a queue behind larger accounts. Working with me directly means the developer who designed your site is the one who writes the code, answers your email, and fixes the issue two months after launch. Fewer layers, faster answers, and no account manager relaying messages.",
  },
  {
    q: "Can you fix or take over a website someone else built?",
    a: "Often, yes. I manage over 200 client sites and a good portion of that is inherited work — sites built by a previous developer or agency that need repairs, updates, or a rebuild. Send me the URL and I will tell you honestly whether it is worth repairing or whether rebuilding will cost you less in the long run.",
  },
  {
    q: "Will my website show up on Google?",
    a: "I build the technical foundation that makes ranking possible: semantic HTML, structured data, fast load times, clean URLs, a valid sitemap, and mobile-first layouts. That is the part a developer controls. Ranking also depends on your content, your Google Business Profile, and earning links over time — so I will tell you what to expect rather than promise a number one spot.",
  },
  {
    q: "Who owns the website and the code when the project is done?",
    a: "You do. You own the domain, the hosting account, the content, and the code. I will not hold your site hostage or lock you into a proprietary platform you cannot leave. If you ever want to move to another developer, everything transfers.",
  },
  {
    q: "Do you offer ongoing maintenance after launch?",
    a: "Yes. Managing sites long term is most of what I do day to day — updates, security patches, backups, content changes, and new pages as the business grows. You can hand that off entirely or just call me when something needs attention.",
  },
];

function WebDevServiceJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://ryanm.info/web-development",
    name: "Ryan McGatha - Web Development & Design in Greenville, SC",
    url: "https://ryanm.info/web-development",
    telephone: "+1-864-201-6487",
    email: "ryanmcgatha@gmail.com",
    description:
      "Web development and web design services in Greenville, SC. Custom websites, WordPress development, web applications, and website redesigns for local and remote clients.",
    image: "https://ryanm.info/opengraph-image",
    priceRange: "$$",
    areaServed: [
      {
        "@type": "City",
        name: "Greenville",
        containedInPlace: {
          "@type": "State",
          name: "South Carolina",
        },
      },
      {
        "@type": "AdministrativeArea",
        name: "Upstate South Carolina",
      },
      {
        "@type": "State",
        name: "South Carolina",
      },
      {
        "@type": "Country",
        name: "United States",
      },
    ],
    serviceType: [
      "Web Development",
      "Web Design",
      "Custom Website Development",
      "WordPress Development",
      "React Development",
      "Next.js Development",
      "Custom Web Application Development",
      "Website Redesign",
      "E-Commerce Development",
      "Email Design and Development",
      "Website Maintenance",
      "Technical SEO",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Greenville",
      addressRegion: "SC",
      postalCode: "29601",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.8526,
      longitude: -82.394,
    },
    provider: {
      "@type": "Person",
      name: "Ryan McGatha",
      url: "https://ryanm.info",
      jobTitle: "Full-Stack Web Developer & Designer",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web Development Services",
      itemListElement: services.map((s, i) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.description,
        },
        position: i + 1,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function WebDevFAQJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function WebDevBreadcrumbJsonLd() {
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
        name: "Web Development",
        item: "https://ryanm.info/web-development",
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

export default function WebDevelopmentPage() {
  return (
    <>
      <WebDevServiceJsonLd />
      <WebDevFAQJsonLd />
      <WebDevBreadcrumbJsonLd />

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
                  <li className="text-foreground">Web Development</li>
                </ol>
              </nav>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-sm font-heading tracking-widest uppercase text-muted-foreground mb-4">
                Web Development &amp; Design &bull; Greenville, SC
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold leading-[1.1] text-foreground mb-6">
                Web Developer
                <br />
                <span className="text-muted-foreground">in Greenville, SC</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground max-w-2xl mb-8">
                I design and build websites and web applications for businesses
                in Greenville, South Carolina and across the Upstate. Design and
                development from one person — so what you approve in the mockup
                is what ships. Currently managing over 200 client websites and
                building roughly one new site a week.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-[--radius] font-heading text-sm hover:opacity-90 transition-opacity"
                >
                  Start a web project
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 border border-foreground/20 px-6 py-3 rounded-[--radius] font-heading text-sm text-foreground hover:bg-foreground/5 transition-colors"
                >
                  See web development projects
                </Link>
              </div>
            </Reveal>
          </section>

          <section className="py-16 border-t border-border">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-heading text-foreground mb-4">
                Web Development Services for Greenville Businesses
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
                Whether you need a first website, a rebuild of one that has aged
                badly, or a custom application your business runs on, the work is
                the same: design it properly, build it to last, and make it easy
                to live with afterward.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <Reveal key={service.title} delay={0.1 + (index % 2) * 0.1} width="w-full">
                  <div className="group p-6 rounded-[--radius] border border-border hover:border-foreground/20 bg-card/50 transition-colors duration-300 h-full">
                    <service.icon className="h-8 w-8 text-foreground mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-heading text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="py-16 border-t border-border">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-heading text-foreground mb-4">
                Why Hire a Local Web Developer in Greenville, SC?
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <Reveal delay={0.1} width="w-full">
                <div>
                  <h3 className="text-lg font-heading text-foreground mb-2">
                    200+ Sites of Experience
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    At Drum Creative I manage over 200 client websites and ship
                    roughly one new site every week. The problems that derail a
                    first-time developer — migrations, redirects, broken plugins,
                    hosting moves — are routine work here.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.2} width="w-full">
                <div>
                  <h3 className="text-lg font-heading text-foreground mb-2">
                    Designer and Developer
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    I design in Figma and then build it myself in React, Next.js,
                    and TypeScript. Nothing gets lost translating a mockup to
                    code, and you are not paying two vendors to coordinate with
                    each other.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.3} width="w-full">
                <div>
                  <h3 className="text-lg font-heading text-foreground mb-2">
                    Local, and Actually Reachable
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Based in Greenville, available in person across the Upstate,
                    and reachable directly by phone or email — not through a
                    support portal. I also take remote projects nationwide.
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          <section className="py-16 border-t border-border">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-heading text-foreground mb-4">
                How a Web Project Works
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
                No mystery, no disappearing for three weeks. Here is the actual
                sequence from first conversation to a site you own.
              </p>
            </Reveal>
            <ol className="divide-y divide-border border-y border-border">
              {process.map((phase, index) => (
                <Reveal
                  as="li"
                  key={phase.step}
                  delay={0.05 * index}
                  width="w-full"
                  className="grid grid-cols-1 md:grid-cols-[80px_220px_1fr] gap-x-6 gap-y-2 py-6"
                >
                  <span className="text-sm font-heading text-muted-foreground">
                    {phase.step}
                  </span>
                  <h3 className="text-lg font-heading text-foreground">
                    {phase.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {phase.description}
                  </p>
                </Reveal>
              ))}
            </ol>
          </section>

          <section className="py-16 border-t border-border">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-heading text-foreground mb-4">
                The Stack I Build On
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                Modern, well-supported tools — chosen because they will still be
                maintainable in three years, not because they are trending.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { category: "Design", items: ["Figma", "Design Systems", "Typography", "Responsive Layout"] },
                { category: "Front End", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
                { category: "Back End", items: ["Node.js / Express", "Python / FastAPI", "PostgreSQL", "RESTful APIs"] },
                { category: "CMS", items: ["WordPress", "Headless CMS", "Custom Admin Tooling", "Content Modeling"] },
                { category: "Email", items: ["Hand-Coded HTML Email", "Bulletproof Tables", "Mailchimp", "Cross-Client QA"] },
                { category: "Infrastructure", items: ["Vercel", "Netlify", "Supabase", "Cloudflare"] },
              ].map((group, index) => (
                <Reveal key={group.category} delay={0.1 + (index % 3) * 0.1} width="w-full">
                  <div>
                    <h3 className="font-heading text-foreground mb-3">{group.category}</h3>
                    <ul className="space-y-1.5">
                      {group.items.map((item) => (
                        <li key={item} className="text-muted-foreground text-sm flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-foreground/30 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="py-16 border-t border-border">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-heading text-foreground mb-4">
                Recent Web Development Work
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                A few builds worth reading about, including the design decisions
                and the problems that had to be solved along the way.
              </p>
            </Reveal>
            <div className="space-y-4">
              {[
                {
                  href: "/projects/cca-email-suite",
                  label: "CCA email suite — newsletter design and development",
                  blurb:
                    "Rebuilding a stock Mailchimp template into a hand-coded editorial email system for a Greenville-area animal shelter.",
                },
                {
                  href: "/projects/sullys-franchise-management",
                  label: "Sully's franchise document management system",
                  blurb:
                    "A React and Supabase internal web app built under contract for a Greenville, SC franchise operation.",
                },
                {
                  href: "/projects/push-it-messaging",
                  label: "Push It real-time messaging web app",
                  blurb:
                    "A full-stack messaging application with JWT authentication, direct messages, and group chats.",
                },
              ].map((item, index) => (
                <Reveal key={item.href} delay={0.05 * index} width="w-full">
                  <Link
                    href={item.href}
                    className="group flex items-start justify-between gap-6 p-6 rounded-[--radius] border border-border hover:border-foreground/20 bg-card/50 transition-colors duration-300"
                  >
                    <div>
                      <h3 className="font-heading text-foreground mb-1">
                        {item.label}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.blurb}
                      </p>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 shrink-0 mt-1 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="py-16 border-t border-border">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-heading text-foreground mb-4">
                Need AI in the Project Too?
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg text-muted-foreground max-w-2xl mb-6">
                Plenty of sites benefit from a chatbot, an automated workflow, or
                an LLM integration — and plenty do not. I build both sides, so I
                have no reason to sell you AI you do not need.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Link
                href="/ai-services"
                className="inline-flex items-center gap-2 font-heading text-sm text-foreground border-b border-foreground/40 hover:border-foreground transition-colors pb-0.5"
              >
                Read about AI development services in Greenville, SC
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Reveal>
          </section>

          <section className="py-16 border-t border-border">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-heading text-foreground mb-8">
                Frequently Asked Questions About Web Development in Greenville, SC
              </h2>
            </Reveal>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Reveal key={faq.q} delay={0.05 * index} width="w-full">
                  <details className="group border border-border rounded-[--radius] overflow-hidden">
                    <summary className="flex items-center justify-between p-6 cursor-pointer font-heading text-foreground hover:bg-card/50 transition-colors">
                      <span className="pr-4">{faq.q}</span>
                      <ArrowRightIcon className="h-4 w-4 shrink-0 text-muted-foreground group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="py-16 border-t border-border">
            <Reveal width="w-full">
              <div className="bg-card/50 border border-border rounded-[--radius] p-8 sm:p-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-heading text-foreground mb-4">
                  Let&apos;s Talk About Your Website
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Tell me what the business needs and I will tell you what it
                  would take to build — including when the simpler, cheaper
                  option is the right call. Free consultation, no obligation.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-[--radius] font-heading text-sm hover:opacity-90 transition-opacity"
                  >
                    Contact Ryan McGatha
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  <a
                    href="tel:+18642016487"
                    className="inline-flex items-center gap-2 border border-foreground/20 px-6 py-3 rounded-[--radius] font-heading text-sm text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    Call (864) 201-6487
                  </a>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  Based in Greenville, South Carolina — available for local and
                  remote web development projects
                </p>
              </div>
            </Reveal>
          </section>
        </main>
      </div>
    </>
  );
}
