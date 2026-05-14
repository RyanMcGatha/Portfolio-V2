export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ryan McGatha",
    url: "https://ryanm.info",
    email: "mailto:ryanmcgatha@gmail.com",
    telephone: "+1-864-434-6547",
    jobTitle: "Full-Stack Web Developer & Designer",
    description:
      "Ryan McGatha is a full-stack web developer and designer based in Greenville, SC. He designs and builds modern websites, polished user interfaces, and custom web applications for businesses across the Upstate, and also develops AI agents, chatbots, and LLM integrations when projects call for it.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Greenville",
      addressRegion: "SC",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.8526,
      longitude: -82.394,
    },
    sameAs: [
      "https://www.linkedin.com/in/ryanmcgatha",
      "https://github.com/RyanMcGatha",
    ],
    knowsAbout: [
      "Web Development",
      "Full-Stack Development",
      "Web Design",
      "UI Design",
      "UX Design",
      "Responsive Design",
      "Design Systems",
      "Figma",
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "JavaScript",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Tailwind CSS",
      "RESTful APIs",
      "WordPress",
      "Artificial Intelligence",
      "AI Development",
      "AI Agents",
      "Chatbot Development",
      "Large Language Models",
      "LLM Integration",
      "RAG Pipelines",
      "Machine Learning",
      "Natural Language Processing",
      "GPT-4",
      "Claude",
      "LangChain",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Full-Stack Web Developer & Designer",
      occupationLocation: {
        "@type": "City",
        name: "Greenville",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Greenville",
          addressRegion: "SC",
          addressCountry: "US",
        },
      },
    },
    worksFor: {
      "@type": "Organization",
      name: "Drum Creative",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Greenville",
        addressRegion: "SC",
        addressCountry: "US",
      },
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Carolina Code School",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Greenville",
        addressRegion: "SC",
        addressCountry: "US",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ryan McGatha - Full-Stack Developer & Designer in Greenville, SC",
    url: "https://ryanm.info",
    description:
      "Ryan McGatha is a full-stack web developer and designer in Greenville, South Carolina. Custom websites, web app design and development, and AI integrations for local businesses.",
    author: {
      "@type": "Person",
      name: "Ryan McGatha",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProfessionalServiceJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Ryan McGatha - Web Development, Web Design & AI Services in Greenville, SC",
    url: "https://ryanm.info",
    telephone: "+1-864-434-6547",
    email: "ryanmcgatha@gmail.com",
    description:
      "Professional full-stack web development, web design, and AI development services in Greenville, SC. Modern websites, custom web apps, polished UI/UX design, and AI agents, chatbots, and LLM integrations for local businesses.",
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
        "@type": "State",
        name: "South Carolina",
      },
    ],
    serviceType: [
      "Web Development",
      "Full-Stack Web Development",
      "Web Design",
      "UI/UX Design",
      "Responsive Website Design",
      "Custom Web Application Development",
      "WordPress Development",
      "React & Next.js Development",
      "AI Development",
      "AI Agent Development",
      "Chatbot Development",
      "LLM Integration",
      "AI Automation",
      "RAG Pipeline Development",
      "AI-Powered Web Applications",
      "Custom Software Development",
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
    priceRange: "$$",
    knowsAbout: [
      "Web Design",
      "UI Design",
      "UX Design",
      "Figma",
      "Design Systems",
      "Responsive Design",
      "Web Development",
      "Full-Stack Development",
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "PostgreSQL",
      "TypeScript",
      "WordPress",
      "Artificial Intelligence",
      "AI Agents",
      "Chatbots",
      "Large Language Models",
      "LLM Integration",
      "RAG Pipelines",
      "Machine Learning",
      "LangChain",
      "GPT-4",
      "Claude",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Pass an ordered array of { name, url } crumbs for the current page. */
export function BreadcrumbJsonLd({
  crumbs,
}: {
  crumbs: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQPageJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What AI development services does Ryan McGatha offer in Greenville, SC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ryan McGatha offers comprehensive AI development services in Greenville, SC including custom AI agent development, chatbot development, LLM integration (GPT-4, Claude, open-source models), RAG pipeline development, AI workflow automation, AI-powered web applications, and AI consulting for local businesses.",
        },
      },
      {
        "@type": "Question",
        name: "Where can I find an AI developer in Greenville, SC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ryan McGatha is an AI developer based in Greenville, South Carolina. He builds custom AI agents, chatbots, LLM integrations, and AI-powered applications for businesses in the Greenville area and across Upstate South Carolina. Contact him at ryanmcgatha@gmail.com for a free consultation.",
        },
      },
      {
        "@type": "Question",
        name: "What AI technologies does Ryan McGatha work with?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ryan works with leading AI technologies including OpenAI GPT-4, Anthropic Claude, LangChain, LlamaIndex, vector databases (Pinecone, ChromaDB, pgvector), Hugging Face Transformers, Python, FastAPI, React, Next.js, and Node.js. He specializes in building production-ready AI systems for businesses.",
        },
      },
      {
        "@type": "Question",
        name: "Can Ryan McGatha build an AI chatbot for my Greenville business?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Ryan builds custom AI chatbots trained on your business data that can answer customer questions, capture leads, schedule appointments, and provide instant support. He can integrate chatbots into existing websites, including WordPress sites, React applications, and custom platforms.",
        },
      },
      {
        "@type": "Question",
        name: "How can I hire Ryan McGatha for an AI or web development project?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Contact Ryan by emailing ryanmcgatha@gmail.com or connecting on LinkedIn at linkedin.com/in/ryanmcgatha. He offers free consultations for AI and web development projects and is available for freelance, contract, and full-time opportunities in Greenville, SC and remotely.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between an AI chatbot and an AI agent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A chatbot responds to questions within a conversation. An AI agent goes further — it takes autonomous actions like booking appointments, updating databases, processing documents, qualifying leads, and executing multi-step workflows without human intervention. Ryan McGatha builds both for Greenville businesses.",
        },
      },
      {
        "@type": "Question",
        name: "Where is Ryan McGatha based?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ryan McGatha is based in Greenville, South Carolina. He is available for in-person meetings with local Greenville businesses and also takes on remote AI and web development projects nationwide.",
        },
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
