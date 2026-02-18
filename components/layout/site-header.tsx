"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { NAV_ITEMS } from "@/lib/constants";

export const SiteHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-white/10 bg-surface-950/98 shadow-card backdrop-blur-xl"
          : "bg-gradient-to-b from-black/70 to-transparent",
      )}
    >
      <div className="border-b border-white/5 bg-surface-950/98 backdrop-blur-md">
        <div className="app-shell flex items-center gap-4 py-3">
          <form
            onSubmit={handleSearch}
            className="flex flex-1 items-center gap-2 rounded-lg border border-white/15 bg-surface-800/80 px-3 py-2 md:max-w-xl"
          >
            <Link
              href="/"
              className="flex shrink-0 items-center gap-1 font-display text-base font-extrabold tracking-tight md:text-lg"
              aria-label="MFLIX Home"
            >
              <span className="text-white">M</span>
              <span className="text-brand-500">FLIX</span>
            </Link>
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actor, genre, year..."
              aria-label="Search movies and TV shows"
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-text-400 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="shrink-0 text-sm font-semibold uppercase text-brand-500 transition hover:text-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
            >
              Go
            </button>
          </form>
        </div>
      </div>

      <nav
        aria-label="Main navigation"
        className={cn(
          "border-b transition-colors",
          isScrolled ? "border-white/10" : "border-transparent",
        )}
      >
        <div className="app-shell flex overflow-x-auto scrollbar-none">
          <div className="flex gap-1 py-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative shrink-0 px-4 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-white"
                    : "text-text-400 hover:text-text-50",
                )}
              >
                {item.label}
                {pathname === item.href ? (
                  <span
                    className="absolute bottom-0 left-1/2 h-0.5 w-1/2 -translate-x-1/2 rounded-full bg-brand-500"
                    aria-hidden
                  />
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};
