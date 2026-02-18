"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { SectionShell } from "@/components/ui/section-shell";
import { cn } from "@/lib/cn";
import { getBackdropUrl } from "@/lib/tmdb/images";
import type { MediaImage } from "@/types/media";

interface ImageGalleryProps {
  images: MediaImage[];
  title?: string;
}

export const ImageGallery = ({ images, title = "Gallery" }: ImageGalleryProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) return null;

  const displayImages = images.slice(0, 12);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  return (
    <SectionShell
      title={title}
      action={
        <div className="hidden items-center gap-1.5 md:flex">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-text-200 transition hover:text-white"
            aria-label="Scroll gallery left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-text-200 transition hover:text-white"
            aria-label="Scroll gallery right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div
        ref={scrollRef}
        className={cn(
          "scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0",
        )}
      >
        {displayImages.map((img) => (
          <div
            key={img.filePath}
            className="relative aspect-video w-64 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-surface-800 sm:w-80"
          >
            <Image
              src={getBackdropUrl(img.filePath, "w780")}
              alt="Gallery image"
              fill
              sizes="(max-width: 768px) 64vw, 320px"
              className="object-cover transition duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </SectionShell>
  );
};
