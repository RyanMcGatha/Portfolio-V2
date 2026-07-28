import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, BrainCircuit, Bot, Workflow, Database, MessageSquare, Zap, Code2, Globe } from "lucide-react";
import { Header } from "../components/nav/Header";
import Reveal from "../components/util/Reveal";

export const metadata: Metadata = {
  title: "AI Development Services in Greenville, SC",
  description:
    "Custom AI development services in Greenville, SC. Ryan McGatha builds AI agents, chatbots, LLM integrations, RAG pipelines, and intelligent automation for businesses in the Greenville, South Carolina area.",
  openGraph: {
    title: "AI Development Services in Greenville, SC | Ryan McGatha",
    description:
      "Custom AI agents, chatbots, LLM integrations, and intelligent automation for Greenville, SC businesses. Built by Ryan McGatha.",
    url: "https://ryanm.info/ai-services",
    type: "website",
    siteName: "Ryan McGatha - AI Developer Greenville SC",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Development Services in Greenville, SC | Ryan McGatha",
    description:
      "Custom AI agents, chatbots, LLM integrations, and intelligent automation for Greenville, SC businesses.",
  },
  alternates: {
    canonical: "https://ryanm.info/ai-services",
  },
};

const services = [
  {
    icon: Bot,
    title: "Custom AI Agents",
    description:
      "Autonomous AI agents that handle customer service, lead qualification, appointment scheduling, and data processing for your Greenville business — running 24/7 without manual intervention.",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbots & Assistants",
    description:
      "Intelligent chatbots trained on your business data that answer customer questions, capture leads, and provide instant support on your website or messaging platforms.",
  },
  {
    icon: BrainCircuit,
    title: "LLM Integration & Fine-Tuning",
    description:
      "Integrate large language models like GPT-4, Claude, and open-source LLMs into your existing applications. Custom fine-tuning to match your business domain and terminology.",
  },
  {
    icon: Database,
    title: "RAG Pipelines & Knowledge Bases",
    description:
      "Retrieval-Augmented Generation systems that connect AI to your company documents, databases, and knowledge bases — delivering accurate, source-grounded answers every time.",
  },
  {
    icon: Workflow,
    title: "AI Workflow Automation",
    description:
      "Replace repetitive manual processes with intelligent automation. From document processing to email triage to data extraction, AI handles the work while you focus on growth.",
  },
  {
    icon: Code2,
    title: "AI-Powered Web Applications",
    description:
      "Full-stack web applications with embedded AI capabilities — intelligent search, content generation, recommendation engines, and predictive analytics built into modern React and Next.js apps.",
  },
  {
    icon: Globe,
    title: "API Development & Integration",
    description:
      "RESTful APIs that connect AI models to your existing tech stack. Third-party API integrations with platforms like OpenAI, Anthropic, Hugging Face, and custom ML endpoints.",
  },
  {
    icon: Zap,
    title: "AI Consulting & Strategy",
    description:
      "Not sure where AI fits in your business? I provide hands-on consulting to identify automation opportunities, evaluate AI tools, and build a practical roadmap for Greenville businesses.",
  },
];

const faqs = [
  {
    q: "What AI development services do you offer in Greenville, SC?",
    a: "I offer a full range of AI development services for Greenville businesses including custom AI agents, chatbot development, LLM integration (GPT-4, Claude, open-source models), RAG pipeline development, AI workflow automation, AI-powered web applications, and AI consulting. Every solution is tailored to your specific business needs.",
  },
  {
    q: "How much does AI development cost for a small business in Greenville?",
    a: "AI development costs vary based on complexity. A simple chatbot integration might start at a few thousand dollars, while a custom AI agent system with RAG pipelines and workflow automation is a larger investment. I offer free consultations to scope your project and provide transparent pricing.",
  },
  {
    q: "Can you build AI solutions for my existing website or application?",
    a: "Absolutely. I specialize in integrating AI capabilities into existing systems. Whether you need to add an AI chatbot to your WordPress site, build intelligent search for your React app, or connect LLMs to your internal databases, I can retrofit AI into your current tech stack.",
  },
  {
    q: "What industries do you serve with AI development in Greenville?",
    a: "I work with businesses across all industries in the Greenville, SC area and Upstate South Carolina — including restaurants, franchises, professional services, healthcare, real estate, manufacturing, and e-commerce. AI solutions can benefit any business looking to automate processes and improve efficiency.",
  },
  {
    q: "Do you offer ongoing AI maintenance and support?",
    a: "Yes. AI systems need monitoring, retraining, and optimization over time. I offer ongoing maintenance plans that include model performance monitoring, data pipeline updates, and continuous improvement based on real-world usage data.",
  },
  {
    q: "What is the difference between an AI chatbot and an AI agent?",
    a: "A chatbot responds to questions within a conversation. An AI agent goes further — it can take autonomous actions like booking appointments, updating databases, processing documents, qualifying leads, and executing multi-step workflows without human intervention. I build both for Greenville businesses.",
  },
  {
    q: "How long does it take to build a custom AI solution?",
    a: "Timeline depends on scope. A chatbot integration can be deployed in 1-2 weeks. A custom AI agent with RAG pipelines and workflow automation typically takes 4-8 weeks. I provide detailed timelines during the free consultation.",
  },
  {
    q: "Why should I hire a local AI developer in Greenville instead of a large agency?",
    a: "Working with a local Greenville AI developer means direct communication, faster iterations, and someone who understands the local business landscape. I offer the technical expertise of a large agency with the responsiveness and personal attention of a local partner. No account managers or middlemen — you work directly with the developer building your AI solution.",
  },
];

function AIServiceJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://ryanm.info/ai-services",
    name: "Ryan McGatha - AI Development Services in Greenville, SC",
    url: "https://ryanm.info/ai-services",
    telephone: "+1-864-201-6487",
    email: "ryanmcgatha@gmail.com",
    description:
      "Professional AI development services in Greenville, SC. Custom AI agents, chatbots, LLM integrations, RAG pipelines, and intelligent automation for local businesses.",
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
    ],
    serviceType: [
      "AI Development",
      "AI Agent Development",
      "Chatbot Development",
      "LLM Integration",
      "RAG Pipeline Development",
      "AI Workflow Automation",
      "AI Consulting",
      "Machine Learning Development",
      "AI-Powered Web Applications",
      "Natural Language Processing",
    ],
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Large Language Models",
      "GPT-4",
      "Claude",
      "RAG",
      "AI Agents",
      "Chatbots",
      "Python",
      "FastAPI",
      "React",
      "Next.js",
      "Node.js",
      "LangChain",
      "Vector Databases",
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
      jobTitle: "AI Developer",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AI Development Services",
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

function AIFAQJsonLd() {
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

function AIBreadcrumbJsonLd() {
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
        name: "AI Services",
        item: "https://ryanm.info/ai-services",
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

export default function AIServicesPage() {
  return (
    <>
      <AIServiceJsonLd />
      <AIFAQJsonLd />
      <AIBreadcrumbJsonLd />

      <div className="min-h-screen">
        <Header />

        <main className="max-w-5xl mx-auto px-4 md:px-8 pb-24">
          <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
            <Reveal>
              <p className="text-sm font-heading tracking-widest uppercase text-muted-foreground mb-4">
                AI Development &bull; Greenville, SC
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold leading-[1.1] text-foreground mb-6">
                AI Development Services
                <br />
                <span className="text-muted-foreground">in Greenville, SC</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground max-w-2xl mb-8">
                I build custom AI agents, chatbots, LLM integrations, and
                intelligent automation for businesses in Greenville, South
                Carolina and across the Upstate. From concept to deployment,
                I turn AI from a buzzword into a competitive advantage for your
                business.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-[--radius] font-heading text-sm hover:opacity-90 transition-opacity"
                >
                  Get a Free AI Consultation
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/#projects"
                  className="inline-flex items-center gap-2 border border-foreground/20 px-6 py-3 rounded-[--radius] font-heading text-sm text-foreground hover:bg-foreground/5 transition-colors"
                >
                  View My Work
                </Link>
              </div>
            </Reveal>
          </section>

          <section className="py-16 border-t border-border">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-heading text-foreground mb-4">
                AI Services for Greenville Businesses
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
                Whether you need a customer-facing chatbot, an internal automation
                system, or a full AI-powered application, I deliver production-ready
                AI solutions tailored to your business.
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
                Why Choose a Local AI Developer in Greenville, SC?
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <Reveal delay={0.1} width="w-full">
                <div>
                  <h3 className="text-lg font-heading text-foreground mb-2">Real AI Experience</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    I built AI agents and API integrations at Chipp AI, a SaaS
                    platform where I implemented tools enabling AI to perform
                    real-time RESTful API calls, dynamic URL crawling, and
                    automated data capture. This isn&apos;t theoretical — I ship
                    AI products.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.2} width="w-full">
                <div>
                  <h3 className="text-lg font-heading text-foreground mb-2">Full-Stack + AI</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    AI doesn&apos;t exist in a vacuum. I build the complete
                    solution — from the React frontend and Node.js backend to the
                    AI models and data pipelines. One developer, no handoffs, no
                    communication gaps.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.3} width="w-full">
                <div>
                  <h3 className="text-lg font-heading text-foreground mb-2">Greenville-Based</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Based right here in Greenville, South Carolina. I understand
                    the local business landscape, I&apos;m available for in-person
                    meetings, and I&apos;m invested in the success of Upstate SC
                    businesses.
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          <section className="py-16 border-t border-border">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-heading text-foreground mb-4">
                AI Technologies I Work With
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                I stay current with the rapidly evolving AI landscape to deliver
                the best solutions for Greenville businesses.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { category: "LLMs & AI Models", items: ["OpenAI GPT-4 / GPT-4o", "Anthropic Claude", "Open-Source LLMs (Llama, Mistral)", "Hugging Face Transformers"] },
                { category: "AI Frameworks", items: ["LangChain", "LlamaIndex", "Semantic Kernel", "CrewAI / AutoGen"] },
                { category: "Vector Databases", items: ["Pinecone", "ChromaDB", "Weaviate", "pgvector (PostgreSQL)"] },
                { category: "Backend & APIs", items: ["Python / FastAPI", "Node.js / Express", "RESTful APIs", "WebSocket Real-Time"] },
                { category: "Frontend", items: ["React / Next.js", "TypeScript", "Tailwind CSS", "Vercel AI SDK"] },
                { category: "Infrastructure", items: ["Docker", "PostgreSQL", "Supabase", "Cloud Deployment (Vercel, AWS)"] },
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
              <h2 className="text-3xl sm:text-4xl font-heading text-foreground mb-8">
                Frequently Asked Questions About AI Development in Greenville, SC
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
                  Ready to Bring AI to Your Greenville Business?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Let&apos;s talk about how AI can save you time, reduce costs,
                  and give your business a competitive edge. Free consultation,
                  no commitment.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="mailto:ryanmcgatha@gmail.com"
                    className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-[--radius] font-heading text-sm hover:opacity-90 transition-opacity"
                  >
                    ryanmcgatha@gmail.com
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/ryanmcgatha"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-foreground/20 px-6 py-3 rounded-[--radius] font-heading text-sm text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    Connect on LinkedIn
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  Based in Greenville, South Carolina — available for local and remote AI projects
                </p>
              </div>
            </Reveal>
          </section>
        </main>
      </div>
    </>
  );
}
