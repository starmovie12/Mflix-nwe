import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";

import { ToastProvider } from "@/components/providers/toast-provider";
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
    default: `${APP_NAME} - Stream Movies & TV`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "MFLIX is a premium OTT discovery experience inspired by Netflix, Prime Video, and Disney+ Hotstar.",
  openGraph: {
    title: `${APP_NAME} - Stream Movies & TV`,
    description:
      "Explore trending movies and TV shows with cinematic browsing, rich detail pages, and premium UI.",
    type: "website",
    siteName: APP_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Stream Movies & TV`,
    description:
      "Explore trending movies and TV shows with cinematic browsing, rich detail pages, and premium UI.",
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
        <ToastProvider>
          <SiteHeader />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
