"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Video } from "@/types/app";

interface TrailerSectionProps {
  videos: Video[];
  title: string;
}

export function TrailerSection({ videos, title }: TrailerSectionProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const trailers = videos.filter(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  if (!trailers.length) return null;

  return (
    <section className="px-4 md:px-12 py-8">
      <h2 className="text-xl font-bold text-white mb-4">Videos & Trailers</h2>

      {activeVideo && (
        <div className="relative aspect-video w-full max-w-4xl mb-6 rounded-lg overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={`${title} video`}
          />
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4">
        {trailers.map((video) => (
          <button
            key={video.id}
            onClick={() => setActiveVideo(video.key)}
            className="group flex-shrink-0 w-[240px] md:w-[300px]"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-mflix-gray-800">
              <Image
                src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                alt={video.name}
                fill
                sizes="(max-width: 768px) 240px, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                  <Play size={20} fill="black" className="text-black ml-0.5" />
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm text-mflix-gray-200 truncate">{video.name}</p>
            <p className="text-xs text-mflix-gray-400 capitalize">{video.type}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
