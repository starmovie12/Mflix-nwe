import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";
import { APP_NAME } from "@/lib/constants";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mflix.example"),
  title: {
    default: `${APP_NAME} - Watch Free HD Movies, Series & Anime Online`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Stream the latest HD Movies, Web Series, and Anime on MFLIX. Premium OTT experience with daily updates, cinematic browsing, and rich detail pages.",
  keywords: [
    "free movies",
    "watch online",
    "hd movies",
    "web series",
    "anime",
    "mflix",
    "streaming",
    "bollywood",
    "hollywood",
  ],
  openGraph: {
    title: `${APP_NAME} - Free HD Movies & Series`,
    description:
      "Watch thousands of movies and series in HD quality. Join MFLIX today.",
    type: "website",
    siteName: APP_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Watch Movies Online`,
    description: "Stream latest movies and anime for free.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sora.variable} bg-surface-950 font-sans text-text-50`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
