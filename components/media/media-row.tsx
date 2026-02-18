"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { MediaCard } from "@/components/media/media-card";
import { SectionShell } from "@/components/ui/section-shell";
import type { MediaItem } from "@/types/media";

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  variant?: "poster" | "backdrop";
}

export const MediaRow = ({ title, items, variant = "poster" }: MediaRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    const step = Math.max(container.clientWidth * 0.8, 280);
    container.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <SectionShell
      title={title}
      action={
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-text-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            onClick={() => handleScroll("left")}
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-text-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            onClick={() => handleScroll("right")}
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div
        ref={scrollRef}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0"
      >
        {items.map((item) => (
          <div
            key={`${title}-${item.mediaType}-${item.id}`}
            className={variant === "poster" ? "w-[42vw] shrink-0 snap-start sm:w-48" : "w-[76vw] shrink-0 snap-start sm:w-80"}
          >
            <MediaCard item={item} variant={variant} />
          </div>
        ))}
      </div>
    </SectionShell>
  );
};
