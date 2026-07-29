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
} from "./structured-data";
import { BackgroundAnimationLazy } from "./components/util/BackgroundAnimationLazy";
import { ConversionTracking } from "./components/util/ConversionTracking";
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
  // Keyword first, name second: brand queries match either way, but
  // "web developer greenville sc" only matches if it leads.
  title: {
    default: "Web Developer & Designer in Greenville, SC | Ryan McGatha",
    template: "%s | Ryan McGatha",
  },
  description:
    "Web developer and designer in Greenville, SC building custom websites, web apps, and AI integrations in React, Next.js, and Python. 200+ client sites shipped.",
  authors: [{ name: "Ryan McGatha", url: siteUrl }],
  creator: "Ryan McGatha",
  publisher: "Ryan McGatha",
  category: "technology",
  classification: "Web Development, Web Design, UI/UX Design, Full-Stack Development, AI Development, Software Engineering",
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
    title: "Web Developer & Designer in Greenville, SC | Ryan McGatha",
    description:
      "Web development, web design, and AI integrations for Greenville, SC businesses. Custom websites and web apps built with React, Next.js, Node.js, and Python.",
    siteName: "Ryan McGatha - Web Developer & Designer in Greenville, SC",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Developer & Designer in Greenville, SC | Ryan McGatha",
    description:
      "Web development, web design, and AI integrations for Greenville, SC businesses. Custom websites and web apps in React, Next.js, and Python.",
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
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WGJFJWL7');`}
        </Script>
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
      </head>
      <body
        className={`${inter.variable} ${archivoBlack.variable} ${robotoMono.variable} bg-background text-foreground`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WGJFJWL7"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
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
          <BackgroundAnimationLazy />
          <ConversionTracking />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
