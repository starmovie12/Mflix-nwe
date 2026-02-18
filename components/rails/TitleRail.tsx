"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { TitleCard } from "@/components/cards/TitleCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { TitleSummaryWithImages } from "@/lib/tmdb/presentation";
import { cn } from "@/lib/utils";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function TitleRail({
  title,
  items,
  variant = "poster"
}: {
  title: string;
  items: TitleSummaryWithImages[];
  variant?: "poster" | "backdrop";
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const step = useMemo(() => (variant === "poster" ? 900 : 1100), [variant]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setCanLeft(el.scrollLeft > 10);
      setCanRight(el.scrollLeft < max - 10);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const next = clamp(el.scrollLeft + dir * step, 0, el.scrollWidth);
    el.scrollTo({ left: next, behavior: "smooth" });
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <SectionHeader title={title} />
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={!canLeft}
              className={cn(
                "focus-ring grid size-10 place-items-center rounded-full",
                "bg-white/8 ring-1 ring-white/10 text-white/90",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "hover:bg-white/12"
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={!canRight}
              className={cn(
                "focus-ring grid size-10 place-items-center rounded-full",
                "bg-white/8 ring-1 ring-white/10 text-white/90",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "hover:bg-white/12"
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className={cn(
            "mt-4 flex gap-4 overflow-x-auto pb-2",
            "scroll-px-4 snap-x snap-mandatory",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          )}
        >
          {items.map((item, idx) => (
            <div key={`${item.mediaType}:${item.id}`} className="snap-start shrink-0">
              <div className={variant === "poster" ? "w-[170px] sm:w-[200px]" : "w-[320px] sm:w-[420px]"}>
                <TitleCard item={item} variant={variant} priority={idx < 3} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

