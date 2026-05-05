import type { Metadata, Viewport } from "next";
import { Inter, Archivo_Black, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import {
  PersonJsonLd,
  WebSiteJsonLd,
  ProfessionalServiceJsonLd,
  BreadcrumbJsonLd,
  FAQPageJsonLd,
} from "./structured-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: false,
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica",
    "Arial",
    "sans-serif",
  ],
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  preload: true,
  fallback: ["Impact", "Haettenschweiler", "Arial Black", "sans-serif"],
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
  preload: false,
  fallback: ["Consolas", "Monaco", "Courier New", "monospace"],
});

const siteUrl = "https://ryanm.info";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0ece4" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1117" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Ryan McGatha | AI Developer & Full-Stack Web Developer in Greenville, SC",
    template: "%s | Ryan McGatha",
  },
  description:
    "AI developer and full-stack web developer in Greenville, SC. I build custom AI agents, chatbots, LLM integrations, and AI-powered web apps with React, Node.js, and Python.",
  authors: [{ name: "Ryan McGatha", url: siteUrl }],
  creator: "Ryan McGatha",
  publisher: "Ryan McGatha",
  category: "technology",
  classification: "AI Development, Artificial Intelligence, Web Development, Software Engineering",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Ryan McGatha | AI Developer & Web Developer in Greenville, SC",
    description:
      "AI developer and full-stack web developer in Greenville, SC. Building custom AI agents, chatbots, LLM integrations, and AI-powered web applications with React, Node.js, and Python.",
    siteName: "Ryan McGatha - AI Developer Greenville SC",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ryan McGatha | AI Developer & Web Developer in Greenville, SC",
    description:
      "AI developer and full-stack web developer in Greenville, SC. Custom AI agents, chatbots, LLM integrations, and AI-powered applications.",
    creator: "@ryanmcgatha",
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y4S9Q71N7G"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y4S9Q71N7G');
          `}
        </Script>
        <PersonJsonLd />
        <WebSiteJsonLd />
        <ProfessionalServiceJsonLd />
        <BreadcrumbJsonLd />
        <FAQPageJsonLd />
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
