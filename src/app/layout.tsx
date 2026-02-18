import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ToastContainer } from "@/components/ui/toast";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MFLIX - Stream Movies & TV Shows",
    template: "%s | MFLIX",
  },
  description:
    "MFLIX is a premium streaming platform for movies and TV shows. Discover trending titles, watch trailers, and build your watchlist.",
  keywords: ["streaming", "movies", "tv shows", "MFLIX", "watch online"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MFLIX",
    title: "MFLIX - Stream Movies & TV Shows",
    description: "Premium streaming platform for movies and TV shows.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MFLIX - Stream Movies & TV Shows",
    description: "Premium streaming platform for movies and TV shows.",
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
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
