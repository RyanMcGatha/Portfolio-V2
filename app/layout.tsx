import type { Metadata } from "next";
import { Inter, Archivo_Black, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import {
  PersonJsonLd,
  WebSiteJsonLd,
  ProfessionalServiceJsonLd,
  BreadcrumbJsonLd,
} from "./structured-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-code",
});

const siteUrl = "https://ryanmcgatha.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Ryan McGatha | Web Developer & AI Developer in Greenville, SC",
    template: "%s | Ryan McGatha",
  },
  description:
    "Ryan McGatha is a full-stack web developer and AI developer based in Greenville, SC. Specializing in React, Node.js, Python, and AI-powered web applications for businesses in the Greenville, South Carolina area.",
  keywords: [
    "Ryan McGatha",
    "web developer Greenville SC",
    "web developer Greenville",
    "Greenville SC developer",
    "developer Greenville SC",
    "AI developer Greenville SC",
    "AI Greenville",
    "full-stack developer Greenville",
    "React developer Greenville SC",
    "Node.js developer Greenville",
    "Python developer Greenville SC",
    "freelance web developer Greenville",
    "software engineer Greenville SC",
    "web development Greenville South Carolina",
    "AI development Greenville",
    "Greenville SC web design",
    "Ryan McGatha developer",
    "Ryan McGatha Greenville",
  ],
  authors: [{ name: "Ryan McGatha", url: siteUrl }],
  creator: "Ryan McGatha",
  publisher: "Ryan McGatha",
  category: "technology",
  classification: "Web Development, AI Development, Software Engineering",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Ryan McGatha | Web Developer & AI Developer in Greenville, SC",
    description:
      "Full-stack web developer and AI developer based in Greenville, SC. Building modern web applications with React, Node.js, Python, and AI technologies.",
    siteName: "Ryan McGatha - Web Developer Greenville SC",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Ryan McGatha - Web Developer and AI Developer in Greenville, SC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ryan McGatha | Web Developer & AI Developer in Greenville, SC",
    description:
      "Full-stack web developer and AI developer based in Greenville, SC. React, Node.js, Python, and AI-powered applications.",
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "US-SC",
    "geo.placename": "Greenville, South Carolina",
    "geo.position": "34.8526;-82.3940",
    ICBM: "34.8526, -82.3940",
    "revisit-after": "7 days",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={siteUrl} />
        <meta name="geo.region" content="US-SC" />
        <meta name="geo.placename" content="Greenville, South Carolina" />
        <meta name="geo.position" content="34.8526;-82.3940" />
        <meta name="ICBM" content="34.8526, -82.3940" />
        <PersonJsonLd />
        <WebSiteJsonLd />
        <ProfessionalServiceJsonLd />
        <BreadcrumbJsonLd />
      </head>
      <body
        className={`${inter.variable} ${archivoBlack.variable} ${robotoMono.variable}`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md focus:font-heading focus:text-sm"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          enableSystem
          defaultTheme="system"
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
