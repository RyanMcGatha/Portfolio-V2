export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ryan McGatha",
    url: "https://ryanmcgatha.com",
    email: "mailto:ryanmcgatha@gmail.com",
    telephone: "+1-864-434-6547",
    jobTitle: "Full-Stack Web Developer & AI Developer",
    description:
      "Ryan McGatha is a full-stack web developer and AI developer based in Greenville, SC, specializing in React, Node.js, Python, and AI-powered web applications.",
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
      "AI Development",
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
      "Full-Stack Development",
      "Artificial Intelligence",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Web Developer",
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
    name: "Ryan McGatha - Web Developer & AI Developer in Greenville, SC",
    url: "https://ryanmcgatha.com",
    description:
      "Portfolio of Ryan McGatha, a full-stack web developer and AI developer based in Greenville, South Carolina.",
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
    name: "Ryan McGatha - Web Development & AI Development",
    url: "https://ryanmcgatha.com",
    telephone: "+1-864-434-6547",
    email: "ryanmcgatha@gmail.com",
    description:
      "Professional web development and AI development services in Greenville, SC. Specializing in React, Node.js, Python, and custom AI solutions for local businesses.",
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
      "AI Development",
      "Full-Stack Development",
      "Web Application Development",
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
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "AI",
      "Machine Learning",
      "PostgreSQL",
      "TypeScript",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://ryanmcgatha.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: "https://ryanmcgatha.com/#about",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Projects",
        item: "https://ryanmcgatha.com/#projects",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Experience",
        item: "https://ryanmcgatha.com/#experience",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Contact",
        item: "https://ryanmcgatha.com/#contact",
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
