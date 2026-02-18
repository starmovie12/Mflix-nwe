"use client";

import Image from "next/image";
import Link from "next/link";
import { Info, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

import { Badge } from "@/components/ui/badge";
import { buttonClassName } from "@/components/ui/button";
import { getBackdropUrl } from "@/lib/tmdb/images";
import type { MediaDetail, MediaItem } from "@/types/media";

interface BillboardProps {
  item: MediaItem | MediaDetail;
}

const hasVideos = (item: MediaItem | MediaDetail): item is MediaDetail =>
  "videos" in item && Array.isArray(item.videos);

const getTrailerVideo = (item: MediaDetail) =>
  item.videos.find(
    (v) =>
      v.type.toLowerCase() === "trailer" &&
      v.site.toLowerCase() === "youtube",
  );

export const Billboard = ({ item }: BillboardProps) => {
  const trailer = hasVideos(item) ? getTrailerVideo(item) : undefined;
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!trailer || reduceMotion) {
      setVideoReady(true);
      return;
    }
    const t = setTimeout(() => setVideoReady(true), 800);
    return () => clearTimeout(t);
  }, [trailer, reduceMotion]);

  const showTrailer = trailer && videoReady && !reduceMotion;
  const trailerEmbedUrl =
    showTrailer && trailer
      ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&loop=1&playlist=${trailer.key}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`
      : null;

  return (
    <section className="relative isolate overflow-hidden rounded-2xl border border-white/10 shadow-card">
      <div className="absolute inset-0 aspect-video min-h-full w-full">
        {trailerEmbedUrl && videoReady ? (
          <iframe
            ref={videoRef}
            src={trailerEmbedUrl}
            title={`${item.title} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={getBackdropUrl(item.backdropPath, "w1280")}
            alt={item.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1400px"
            className="object-cover"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-hero-fade" />
      <div className="absolute inset-0 bg-gradient-to-r from-surface-950/80 via-surface-950/30 to-transparent" />

      <div className="relative z-10 flex min-h-[68vh] flex-col justify-end gap-5 p-6 md:min-h-[72vh] md:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-brand-500/20 text-white">
            {item.mediaType.toUpperCase()}
          </Badge>
          {item.voteAverage > 0 ? (
            <Badge>{item.voteAverage.toFixed(1)} Rating</Badge>
          ) : null}
        </div>

        <h1 className="max-w-2xl font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">
          {item.title}
        </h1>

        <p className="max-w-xl text-sm text-text-200 md:text-base">
          {item.overview || "Discover your next favorite title on MFLIX."}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/title/${item.mediaType}/${item.id}`}
            className={buttonClassName({ variant: "primary", size: "lg" })}
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
        </div>
      </div>
    </section>
  );
};
