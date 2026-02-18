import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ToastProvider } from "@/components/ui/toast";
import { APP_NAME } from "@/lib/constants";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070B14",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mflix.example"),
  title: {
    default: `${APP_NAME} - Watch Free HD Movies, Series & Anime Online`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Stream the latest HD Movies, Web Series, and Anime on MFLIX. A premium OTT discovery experience with cinematic UI.",
  keywords: [
    "movies",
    "tv shows",
    "streaming",
    "anime",
    "web series",
    "MFLIX",
    "watch online",
    "HD movies",
  ],
  authors: [{ name: "MFLIX Team" }],
  openGraph: {
    title: `${APP_NAME} - Watch Free HD Movies & Series`,
    description:
      "Explore trending movies and TV shows with cinematic browsing, rich detail pages, and premium UI.",
    type: "website",
    siteName: APP_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Watch Movies Online`,
    description:
      "Stream latest movies and series. A premium OTT discovery experience.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${sora.variable} min-h-screen bg-surface-950 font-sans text-text-50 antialiased`}
      >
        <ToastProvider>
          <SiteHeader />
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
