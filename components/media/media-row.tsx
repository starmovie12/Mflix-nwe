"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { MediaCard } from "@/components/media/media-card";
import { SectionShell } from "@/components/ui/section-shell";
import { cn } from "@/lib/cn";
import type { MediaItem } from "@/types/media";

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  variant?: "poster" | "backdrop" | "top10";
}

export const MediaRow = ({ title, items, variant = "poster" }: MediaRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 10);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10,
    );
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const step = Math.max(container.clientWidth * 0.75, 280);
    container.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const cardVariant = variant === "top10" ? "poster" : variant;
  const itemWidth =
    variant === "poster" || variant === "top10"
      ? "w-[38vw] xs:w-[32vw] sm:w-44 md:w-48 lg:w-[185px]"
      : "w-[72vw] xs:w-[60vw] sm:w-72 md:w-80 lg:w-[340px]";

  return (
    <SectionShell
      title={title}
      action={
        <div className="hidden items-center gap-1.5 md:flex">
          <button
            type="button"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-text-200 transition-all hover:bg-black/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
              !canScrollLeft && "opacity-30 pointer-events-none",
            )}
            onClick={() => handleScroll("left")}
            aria-label={`Scroll ${title} left`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-text-200 transition-all hover:bg-black/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
              !canScrollRight && "opacity-30 pointer-events-none",
            )}
            onClick={() => handleScroll("right")}
            aria-label={`Scroll ${title} right`}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="relative group/row">
        <div
          ref={scrollRef}
          onScroll={checkScrollability}
          className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0"
          role="list"
          aria-label={title}
        >
          {items.map((item, index) => (
            <div
              key={`${title}-${item.mediaType}-${item.id}`}
              className={cn("shrink-0 snap-start", itemWidth)}
              role="listitem"
            >
              <MediaCard
                item={item}
                variant={cardVariant}
                rank={variant === "top10" ? index + 1 : undefined}
                index={index}
              />
            </div>
          ))}
        </div>

        <div
          className={cn(
            "pointer-events-none absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-surface-950 to-transparent transition-opacity md:w-16",
            !canScrollRight && "opacity-0",
          )}
          aria-hidden="true"
        />
        <div
          className={cn(
            "pointer-events-none absolute left-0 top-0 bottom-2 w-12 bg-gradient-to-r from-surface-950 to-transparent transition-opacity md:hidden",
            !canScrollLeft && "opacity-0",
          )}
          aria-hidden="true"
        />
      </div>
    </SectionShell>
  );
};
