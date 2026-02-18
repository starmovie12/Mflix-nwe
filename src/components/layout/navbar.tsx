"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/new-popular", label: "New & Popular" },
  { href: "/my-list", label: "My List" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-500",
        scrolled ? "bg-background/95 backdrop-blur-sm shadow-lg" : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      )}
    >
      <nav className="flex items-center justify-between px-4 md:px-12 h-16 md:h-[68px]">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-mflix-red font-bold text-2xl tracking-wider flex-shrink-0">
            MFLIX
          </Link>

          <ul className="hidden md:flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors duration-200 hover:text-white",
                    pathname === link.href
                      ? "text-white font-semibold"
                      : "text-mflix-gray-200"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="text-white hover:text-mflix-gray-200 transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </Link>

          <button className="hidden md:block text-white hover:text-mflix-gray-200 transition-colors" aria-label="Notifications">
            <Bell size={20} />
          </button>

          <button
            className="hidden md:flex items-center gap-1 group"
            aria-label="Profile menu"
          >
            <div className="w-8 h-8 rounded bg-mflix-red flex items-center justify-center text-white text-sm font-bold">
              M
            </div>
            <ChevronDown size={16} className="text-white group-hover:rotate-180 transition-transform" />
          </button>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/98 backdrop-blur-md border-t border-mflix-gray-700 overflow-hidden"
          >
            <ul className="flex flex-col py-4 px-6 gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block py-3 px-2 text-base rounded-md transition-colors",
                      pathname === link.href
                        ? "text-white bg-mflix-gray-700 font-semibold"
                        : "text-mflix-gray-200 hover:text-white hover:bg-mflix-gray-800"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
