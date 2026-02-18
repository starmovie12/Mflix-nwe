"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, MatchBadge, QualityBadge } from "@/components/ui/badge";
import { getBackdropUrl } from "@/lib/tmdb/image";
import { formatRuntime, getYear, getTrailerKey } from "@/lib/tmdb/mappers";
import { useMyListStore } from "@/stores/my-list-store";
import { toast } from "@/components/ui/toast";
import type { MediaDetails, MediaItem } from "@/types/app";

interface DetailHeroProps {
  details: MediaDetails;
}

export function DetailHero({ details }: DetailHeroProps) {
  const { isInList, toggleItem } = useMyListStore();
  const inList = isInList(details.id, details.mediaType);

  const trailerKey = getTrailerKey(details.videos);

  const mediaItem: MediaItem = {
    id: details.id,
    mediaType: details.mediaType,
    title: details.title,
    overview: details.overview,
    posterPath: details.posterPath,
    backdropPath: details.backdropPath,
    releaseDate: details.releaseDate,
    voteAverage: details.voteAverage,
    voteCount: details.voteCount,
    popularity: details.popularity,
    genreIds: details.genreIds,
    originalLanguage: details.originalLanguage,
  };

  const handleToggleList = () => {
    toggleItem(mediaItem);
    toast(
      inList
        ? `Removed "${details.title}" from My List`
        : `Added "${details.title}" to My List`,
      "success"
    );
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: details.title, url });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard", "info");
    }
  };

  return (
    <section className="relative w-full h-[60vh] md:h-[75vh]">
      <Image
        src={getBackdropUrl(details.backdropPath, "original")}
        alt={details.title}
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-20 px-4 md:px-12 max-w-4xl">
        <div className="space-y-4">
          {details.tagline && (
            <p className="text-sm text-mflix-gray-300 italic">{details.tagline}</p>
          )}

          <h1 className="text-fluid-3xl md:text-fluid-4xl font-bold text-white leading-tight">
            {details.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <MatchBadge score={details.voteAverage} />
            <span className="text-mflix-gray-200">
              {getYear(details.releaseDate)}
            </span>
            {details.runtime && (
              <span className="text-mflix-gray-200">
                {formatRuntime(details.runtime)}
              </span>
            )}
            {details.numberOfSeasons && (
              <span className="text-mflix-gray-200">
                {details.numberOfSeasons} Season{details.numberOfSeasons !== 1 ? "s" : ""}
              </span>
            )}
            <QualityBadge />
          </div>

          <p className="text-sm md:text-base text-mflix-gray-100 line-clamp-3 max-w-2xl leading-relaxed">
            {details.overview}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={
                trailerKey
                  ? `/watch/${details.mediaType}/${details.id}`
                  : `/watch/${details.mediaType}/${details.id}`
              }
            >
              <Button variant="primary" size="lg">
                <Play size={20} fill="black" />
                Play
              </Button>
            </Link>

            {trailerKey && (
              <a
                href={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="md">
                  <Play size={16} />
                  Watch Trailer
                </Button>
              </a>
            )}

            <button
              onClick={handleToggleList}
              className="w-10 h-10 rounded-full border-2 border-mflix-gray-400 flex items-center justify-center text-white hover:border-white transition-colors"
              aria-label={inList ? "Remove from My List" : "Add to My List"}
            >
              {inList ? <Check size={20} /> : <Plus size={20} />}
            </button>

            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full border-2 border-mflix-gray-400 flex items-center justify-center text-white hover:border-white transition-colors"
              aria-label="Share"
            >
              <Share2 size={18} />
            </button>
          </div>

          {details.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {details.genres.map((genre) => (
                <Badge key={genre.id} variant="outline" size="md">
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
