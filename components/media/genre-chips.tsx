"use client";

import { cn } from "@/lib/cn";
import type { MediaGenre } from "@/types/media";

interface GenreChipsProps {
  genres: MediaGenre[];
  activeGenreId?: number | null;
  onSelect?: (genre: MediaGenre | null) => void;
  className?: string;
}

export const GenreChips = ({ genres, activeGenreId, onSelect, className }: GenreChipsProps) => {
  if (genres.length === 0) return null;

  return (
    <div
      className={cn(
        "scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0",
        className,
      )}
      role="tablist"
      aria-label="Genre filter"
    >
      {onSelect && (
        <button
          type="button"
          role="tab"
          aria-selected={!activeGenreId}
          onClick={() => onSelect(null)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200",
            !activeGenreId
              ? "border-brand-500 bg-brand-500/15 text-white shadow-glow-sm"
              : "border-white/15 bg-white/5 text-text-300 hover:border-white/30 hover:bg-white/10 hover:text-white",
          )}
        >
          All
        </button>
      )}
      {genres.map((genre) => (
        <button
          key={genre.id}
          type="button"
          role="tab"
          aria-selected={activeGenreId === genre.id}
          onClick={() => onSelect?.(genre)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200",
            activeGenreId === genre.id
              ? "border-brand-500 bg-brand-500/15 text-white shadow-glow-sm"
              : "border-white/15 bg-white/5 text-text-300 hover:border-white/30 hover:bg-white/10 hover:text-white",
          )}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};
