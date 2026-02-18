"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";

export const SiteHeader = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = 0;
    let ticking = false;

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;

      window.requestAnimationFrame(() => {
        const current = window.scrollY;
        setIsScrolled(current > 20);

        const delta = current - lastScrollY;
        const isMovingDown = delta > 0;

        if (current > 88 && isMovingDown && delta > 8) {
          setIsHidden(true);
        } else if (!isMovingDown && Math.abs(delta) > 6) {
          setIsHidden(false);
        }

        lastScrollY = current;
        ticking = false;
      });
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
        isHidden ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="app-shell flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-8">
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
      </div>
    </header>
  );
};
