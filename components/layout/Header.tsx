"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors",
        scrolled ? "border-white/10 bg-mflix-bg/75 backdrop-blur" : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring rounded-full px-2 py-1">
          <span className="text-lg font-extrabold tracking-tight text-white">
            <span className="text-mflix-red">M</span>FLIX
          </span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-2">
          <Link
            href="/"
            className={cn(
              "focus-ring rounded-full px-3 py-2 text-sm font-medium text-white/80 hover:text-white",
              "hover:bg-white/6"
            )}
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}

