import type { Metadata } from "next";
import { Inter, Archivo_Black, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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

export const metadata: Metadata = {
  title: "Ryan McGatha | Portfolio",
  description:
    "Full-stack developer portfolio showcasing projects and experience in web development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${archivoBlack.variable} ${robotoMono.variable}`}
      >
        <ThemeProvider
          attribute="class"
          enableSystem
          defaultTheme="system"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
