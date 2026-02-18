"use client";

import Image from "next/image";
import Link from "next/link";
import { Info, Play, Star, Volume2, VolumeX } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { buttonClassName } from "@/components/ui/button";
import { getBackdropUrl } from "@/lib/tmdb/images";
import type { MediaItem } from "@/types/media";

interface BillboardProps {
  item: MediaItem;
  trailerKey?: string;
}

export const Billboard = ({ item, trailerKey }: BillboardProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [isMuted, setIsMuted] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  const handlePlayTrailer = () => {
    if (trailerKey) setShowTrailer(true);
  };

  return (
    <section
      className="relative isolate -mx-4 overflow-hidden md:-mx-8 lg:-mx-12 lg:rounded-2xl lg:mx-0 lg:border lg:border-white/10 lg:shadow-card"
      aria-label="Featured title"
    >
      <div className="relative min-h-[75vh] md:min-h-[80vh]">
        {showTrailer && trailerKey ? (
          <div className="absolute inset-0 z-[2]">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailerKey}`}
              className="h-full w-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={`${item.title} trailer`}
            />
          </div>
        ) : (
          <Image
            src={getBackdropUrl(item.backdropPath, "w1280")}
            alt={item.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}

        <div className="absolute inset-0 z-[3] bg-hero-fade" />
        <div className="absolute inset-0 z-[3] bg-gradient-to-r from-surface-950/90 via-surface-950/40 to-transparent" />
        <div className="absolute inset-0 z-[3] bg-hero-vignette opacity-40" />

        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 z-[4] flex flex-col justify-end gap-4 p-6 md:gap-5 md:p-10 lg:p-14"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">{item.mediaType === "tv" ? "TV SERIES" : "MOVIE"}</Badge>
            {item.voteAverage > 0 && (
              <Badge variant="gold" className="gap-1">
                <Star className="h-3 w-3 fill-current" />
                {item.voteAverage.toFixed(1)}
              </Badge>
            )}
            <Badge variant="outline">HD</Badge>
          </div>

          <h1 className="max-w-3xl font-display text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl">
            {item.title}
          </h1>

          {item.overview && (
            <p className="max-w-xl text-sm text-text-200 line-clamp-3 md:text-base md:line-clamp-3 lg:max-w-2xl">
              {item.overview}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href={`/title/${item.mediaType}/${item.id}`}
              className={buttonClassName({ variant: "primary", size: "lg" })}
              onClick={handlePlayTrailer}
            >
              <Play className="h-5 w-5 fill-current" />
              Play
            </Link>
            <Link
              href={`/title/${item.mediaType}/${item.id}`}
              className={buttonClassName({ variant: "secondary", size: "lg" })}
            >
              <Info className="h-5 w-5" />
              More Info
            </Link>

            {showTrailer && trailerKey && (
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white transition hover:bg-black/60"
                aria-label={isMuted ? "Unmute trailer" : "Mute trailer"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
