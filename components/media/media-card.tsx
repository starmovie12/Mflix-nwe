"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { MyListButton } from "@/components/media/my-list-button";
import { cn } from "@/lib/cn";
import { getBackdropUrl, getPosterUrl } from "@/lib/tmdb/images";
import type { MediaItem } from "@/types/media";

interface MediaCardProps {
  item: MediaItem;
  variant?: "poster" | "backdrop" | "compact";
  rank?: number;
  className?: string;
  index?: number;
}

const getReleaseYear = (releaseDate: string | null) => {
  if (!releaseDate) return null;
  const year = new Date(releaseDate).getFullYear();
  return Number.isNaN(year) ? null : year;
};

const getMatchScore = (vote: number) => {
  if (vote <= 0) return null;
  return Math.round(vote * 10);
};

export const MediaCard = ({ item, variant = "poster", rank, className, index = 0 }: MediaCardProps) => {
  const shouldReduceMotion = useReducedMotion();
  const year = getReleaseYear(item.releaseDate);
  const matchScore = getMatchScore(item.voteAverage);
  const langBadge = item.originalLanguage?.toUpperCase();

  const imageSrc =
    variant === "poster" || variant === "compact"
      ? getPosterUrl(item.posterPath, "w500")
      : getBackdropUrl(item.backdropPath, "w780");

  const imageSizes =
    variant === "poster"
      ? "(max-width: 480px) 42vw, (max-width: 768px) 32vw, (max-width: 1200px) 22vw, 185px"
      : variant === "compact"
        ? "(max-width: 480px) 28vw, (max-width: 768px) 22vw, 140px"
        : "(max-width: 480px) 78vw, (max-width: 768px) 58vw, (max-width: 1200px) 40vw, 340px";

  return (
    <motion.article
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.05, 0.4),
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -8, scale: 1.04 }}
      className={cn("group relative", className)}
    >
      <Link
        href={`/title/${item.mediaType}/${item.id}`}
        className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
        aria-label={`Open details for ${item.title}`}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-xl border border-white/[0.08] bg-surface-800 shadow-card transition-shadow duration-300 group-hover:shadow-card-hover group-hover:border-white/15",
            variant === "poster" ? "aspect-[2/3]" : variant === "compact" ? "aspect-[2/3]" : "aspect-video",
          )}
        >
          {rank !== undefined && (
            <div className="absolute left-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-br-xl rounded-tl-xl bg-brand-500 font-display text-sm font-bold text-white shadow-glow-sm">
              {rank}
            </div>
          )}

          {langBadge && variant === "poster" && (
            <div className="absolute right-2 top-2 z-10">
              <Badge variant="brand" className="text-[9px] px-1.5 py-0 leading-5">
                {langBadge}
              </Badge>
            </div>
          )}

          <Image
            src={imageSrc}
            alt={item.title}
            fill
            sizes={imageSizes}
            className="object-cover transition duration-500 ease-out group-hover:scale-110"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-surface-950 transition hover:bg-white/90"
                aria-label={`Play ${item.title}`}
                onClick={(e) => e.preventDefault()}
              >
                <Play className="h-4 w-4 fill-current" />
              </button>
              <MyListButton item={item} iconOnly />
            </div>

            <p className="line-clamp-1 text-sm font-semibold text-white">{item.title}</p>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {matchScore && (
                <span className="text-xs font-bold text-emerald-400">{matchScore}% Match</span>
              )}
              {year && <span className="text-[11px] text-text-300">{year}</span>}
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 leading-4 border-white/20">
                {item.mediaType === "tv" ? "TV" : "HD"}
              </Badge>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent p-3 transition-opacity duration-300 group-hover:opacity-0 sm:opacity-100">
            <p className="line-clamp-1 text-sm font-semibold text-white drop-shadow-lg">{item.title}</p>
            <div className="mt-1 flex items-center gap-1.5">
              {item.voteAverage > 0 && (
                <span className="flex items-center gap-0.5 text-[11px] text-gold-400">
                  <Star className="h-3 w-3 fill-current" />
                  {item.voteAverage.toFixed(1)}
                </span>
              )}
              {year && <span className="text-[11px] text-text-400">{year}</span>}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
