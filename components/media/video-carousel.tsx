"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

import { SectionShell } from "@/components/ui/section-shell";
import { TrailerModal } from "@/components/media/trailer-modal";
import { cn } from "@/lib/cn";
import type { MediaVideo } from "@/types/media";

interface VideoCarouselProps {
  videos: MediaVideo[];
}

export const VideoCarousel = ({ videos }: VideoCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<MediaVideo | null>(null);

  const youtubeVideos = videos.filter((v) => v.site.toLowerCase() === "youtube");
  if (youtubeVideos.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -350 : 350, behavior: "smooth" });
  };

  return (
    <>
      <SectionShell
        title="Videos & Trailers"
        action={
          <div className="hidden items-center gap-1.5 md:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-text-200 transition hover:text-white"
              aria-label="Scroll videos left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-text-200 transition hover:text-white"
              aria-label="Scroll videos right"
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
          {youtubeVideos.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setActiveVideo(video)}
              className="group relative aspect-video w-64 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-surface-800 sm:w-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              aria-label={`Play ${video.name}`}
            >
              <Image
                src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                alt={video.name}
                fill
                sizes="(max-width: 768px) 64vw, 320px"
                className="object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/50">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/90 text-white shadow-glow transition group-hover:scale-110">
                  <Play className="h-6 w-6 fill-current ml-0.5" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8">
                <p className="line-clamp-1 text-xs font-medium text-white">{video.name}</p>
                <p className="text-[10px] text-text-400 mt-0.5">{video.type}</p>
              </div>
            </button>
          ))}
        </div>
      </SectionShell>

      <TrailerModal
        video={activeVideo}
        open={activeVideo !== null}
        onClose={() => setActiveVideo(null)}
      />
    </>
  );
};
