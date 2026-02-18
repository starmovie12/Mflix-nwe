"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { getBackdropUrl, getPosterUrl } from "@/lib/tmdb/images";
import type { MediaItem } from "@/types/media";

interface MediaCardProps {
  item: MediaItem;
  variant?: "poster" | "backdrop";
  className?: string;
  rank?: number;
}

const getReleaseYear = (releaseDate: string | null) => {
  if (!releaseDate) {
    return null;
  }

  const year = new Date(releaseDate).getFullYear();
  return Number.isNaN(year) ? null : year;
};

export const MediaCard = ({ item, variant = "poster", className, rank }: MediaCardProps) => {
  const shouldReduceMotion = useReducedMotion();
  const hasRank = typeof rank === "number" && Number.isInteger(rank) && rank > 0 && variant === "poster";
  const imageSrc =
    variant === "poster"
      ? getPosterUrl(item.posterPath, "w500")
      : getBackdropUrl(item.backdropPath, "w780");
  const imageSizes =
    variant === "poster"
      ? "(max-width: 768px) 42vw, (max-width: 1200px) 24vw, 18vw"
      : "(max-width: 768px) 78vw, (max-width: 1200px) 44vw, 33vw";
  const year = getReleaseYear(item.releaseDate);

  return (
    <motion.article
      whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 240, damping: 22, mass: 0.8 }}
      className={cn("group relative", hasRank && "pl-6 sm:pl-8", className)}
    >
      {hasRank ? (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-1 left-0 z-10 font-display text-7xl font-black leading-none text-white/80 drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)] sm:text-8xl"
        >
          {rank}
        </span>
      ) : null}
      <Link
        href={`/title/${item.mediaType}/${item.id}`}
        className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950"
        aria-label={`Open details for ${item.title}`}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-xl border border-white/10 bg-surface-800 shadow-card",
            variant === "poster" ? "aspect-[2/3]" : "aspect-video",
          )}
        >
          <Image
            src={imageSrc}
            alt={item.title}
            fill
            sizes={imageSizes}
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent p-3 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            <p className="line-clamp-1 text-sm font-semibold text-white">{item.title}</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge>{item.mediaType.toUpperCase()}</Badge>
              {year ? <Badge>{year}</Badge> : null}
              {item.voteAverage > 0 ? <Badge>{item.voteAverage.toFixed(1)} IMDb</Badge> : null}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
