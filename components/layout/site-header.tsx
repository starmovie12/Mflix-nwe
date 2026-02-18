"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Sheet } from "@/components/ui/sheet";
import { cn } from "@/lib/cn";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";
import { useAppHydrated } from "@/hooks/use-app-hydrated";
import { useAppStore } from "@/lib/store/app-store";

export const SiteHeader = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const hydrated = useAppHydrated();
  const activeProfile = useAppStore((state) =>
    state.profiles.find((profile) => profile.id === state.activeProfileId) ?? null,
  );

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-white/10 bg-surface-950/95 shadow-card backdrop-blur-xl"
          : "bg-gradient-to-b from-black/70 to-transparent",
      )}
    >
      <div className="app-shell flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-text-200 transition hover:text-white md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link
            href="/"
            className="font-display text-lg font-bold uppercase tracking-[0.22em] text-brand-500 md:text-xl"
          >
            {APP_NAME}
          </Link>
          <nav aria-label="Main navigation" className="hidden gap-5 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === item.href ? "text-text-50" : "text-text-400 hover:text-text-50",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search titles"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-text-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/profiles"
            aria-label="Open profiles"
            className="inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 text-text-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            {hydrated && activeProfile ? (
              <span aria-hidden className="text-sm leading-none">
                {activeProfile.avatar}
              </span>
            ) : (
              <UserCircle2 className="h-4 w-4" />
            )}
            <span className="hidden text-xs md:inline">{activeProfile?.name ?? "Profile"}</span>
          </Link>
        </div>
      </div>

      <Sheet open={isMenuOpen} onClose={() => setMenuOpen(false)} side="left" title="Menu">
        <nav aria-label="Mobile navigation" className="space-y-2">
          {[...NAV_ITEMS, { href: "/search", label: "Search" }, { href: "/profiles", label: "Profiles" }, { href: "/account", label: "Account" }].map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "block rounded-lg border border-white/10 px-3 py-2 text-sm transition",
                  pathname === item.href
                    ? "border-brand-400/60 bg-brand-500/20 text-white"
                    : "bg-surface-900/70 text-text-200 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </Sheet>
    </header>
  );
};
