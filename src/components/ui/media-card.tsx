"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Plus, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPosterUrl, getBackdropUrl } from "@/lib/tmdb/image";
import { formatVoteAverage, getYear } from "@/lib/tmdb/mappers";
import { useMyListStore } from "@/stores/my-list-store";
import { toast } from "@/components/ui/toast";
import type { MediaItem } from "@/types/app";

interface MediaCardProps {
  item: MediaItem;
  variant?: "poster" | "backdrop" | "compact";
  rank?: number;
  priority?: boolean;
}

export function MediaCard({ item, variant = "poster", rank, priority = false }: MediaCardProps) {
  const [imageError, setImageError] = useState(false);
  const { isInList, toggleItem } = useMyListStore();
  const inList = isInList(item.id, item.mediaType);

  const handleToggleList = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleItem(item);
      toast(
        inList ? `Removed "${item.title}" from My List` : `Added "${item.title}" to My List`,
        "success"
      );
    },
    [item, inList, toggleItem]
  );

  const imageUrl =
    variant === "backdrop"
      ? getBackdropUrl(item.backdropPath, "w780")
      : getPosterUrl(item.posterPath, "w342");

  const fallbackUrl =
    variant === "backdrop"
      ? "/images/backdrop-placeholder.svg"
      : "/images/poster-placeholder.svg";

  return (
    <motion.div
      className={cn(
        "group relative flex-shrink-0 cursor-pointer",
        variant === "poster" && "w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]",
        variant === "backdrop" && "w-[260px] sm:w-[300px] md:w-[340px] lg:w-[380px]",
        variant === "compact" && "w-[120px] sm:w-[140px] md:w-[160px]"
      )}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link href={`/title/${item.mediaType}/${item.id}`} className="block">
        {rank !== undefined && (
          <div className="absolute -left-4 bottom-0 z-10 text-[80px] sm:text-[100px] font-black leading-none text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.3)]">
            {rank}
          </div>
        )}

        <div
          className={cn(
            "relative overflow-hidden rounded-md bg-mflix-gray-800",
            variant === "poster" && "aspect-poster",
            variant === "backdrop" && "aspect-backdrop",
            variant === "compact" && "aspect-[3/4]"
          )}
        >
          <Image
            src={imageError ? fallbackUrl : imageUrl}
            alt={item.title}
            fill
            sizes={
              variant === "backdrop"
                ? "(max-width: 640px) 260px, (max-width: 768px) 300px, (max-width: 1024px) 340px, 380px"
                : "(max-width: 640px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 180px, 200px"
            }
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
            priority={priority}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center gap-1.5">
              <button
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/80 transition-colors"
                aria-label={`Play ${item.title}`}
              >
                <Play size={16} fill="black" className="text-black ml-0.5" />
              </button>
              <button
                onClick={handleToggleList}
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors",
                  inList
                    ? "border-white bg-white/20 text-white"
                    : "border-mflix-gray-300 text-mflix-gray-300 hover:border-white hover:text-white"
                )}
                aria-label={inList ? `Remove ${item.title} from My List` : `Add ${item.title} to My List`}
              >
                {inList ? <Check size={14} /> : <Plus size={14} />}
              </button>
              <div className="ml-auto">
                <Link
                  href={`/title/${item.mediaType}/${item.id}`}
                  className="w-8 h-8 rounded-full border-2 border-mflix-gray-300 flex items-center justify-center text-mflix-gray-300 hover:border-white hover:text-white transition-colors"
                  aria-label={`More info about ${item.title}`}
                >
                  <ChevronDown size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 space-y-0.5">
          <h3 className="text-sm text-mflix-gray-100 font-medium truncate group-hover:text-white transition-colors">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-mflix-gray-400">
            {item.releaseDate && <span>{getYear(item.releaseDate)}</span>}
            {item.voteAverage > 0 && (
              <span className="text-green-400">{formatVoteAverage(item.voteAverage)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
