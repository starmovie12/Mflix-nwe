"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { getPosterUrl } from "@/lib/tmdb/image";
import { cn } from "@/lib/utils";
import type { Season } from "@/types/app";

interface SeasonSectionProps {
  seasons: Season[];
  showTitle?: string;
}

export function SeasonSection({ seasons }: SeasonSectionProps) {
  const [selectedSeason, setSelectedSeason] = useState(
    seasons[0]?.seasonNumber ?? 1
  );
  const [isOpen, setIsOpen] = useState(false);

  if (!seasons.length) return null;

  const currentSeason = seasons.find((s) => s.seasonNumber === selectedSeason) ?? seasons[0];

  return (
    <section className="px-4 md:px-12 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Seasons</h2>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-mflix-gray-700 border border-mflix-gray-600 rounded-md text-sm text-white hover:bg-mflix-gray-600 transition-colors"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            Season {selectedSeason}
            <ChevronDown size={16} className={cn("transition-transform", isOpen && "rotate-180")} />
          </button>

          {isOpen && (
            <ul
              role="listbox"
              className="absolute right-0 top-full mt-1 bg-mflix-gray-700 border border-mflix-gray-600 rounded-md shadow-xl z-30 min-w-[180px] max-h-60 overflow-y-auto"
            >
              {seasons.map((season) => (
                <li key={season.seasonNumber}>
                  <button
                    role="option"
                    aria-selected={season.seasonNumber === selectedSeason}
                    onClick={() => {
                      setSelectedSeason(season.seasonNumber);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-mflix-gray-600 transition-colors",
                      season.seasonNumber === selectedSeason
                        ? "text-white bg-mflix-gray-600"
                        : "text-mflix-gray-200"
                    )}
                  >
                    {season.name} ({season.episodeCount} eps)
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {currentSeason && (
        <div className="flex gap-4 items-start bg-mflix-gray-800/50 rounded-lg p-4">
          {currentSeason.posterPath && (
            <div className="hidden sm:block relative w-[120px] aspect-poster flex-shrink-0 rounded-md overflow-hidden">
              <Image
                src={getPosterUrl(currentSeason.posterPath, "w342")}
                alt={currentSeason.name}
                fill
                className="object-cover"
                sizes="120px"
              />
            </div>
          )}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">{currentSeason.name}</h3>
            <p className="text-sm text-mflix-gray-300">
              {currentSeason.airDate ? new Date(currentSeason.airDate).getFullYear() : "TBA"}{" "}
              &middot; {currentSeason.episodeCount} Episodes
            </p>
            {currentSeason.overview && (
              <p className="text-sm text-mflix-gray-200 line-clamp-3">
                {currentSeason.overview}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
