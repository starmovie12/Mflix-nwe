"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronRight,
  Clock,
  Globe,
  Link2,
  Play,
  Share2,
  Star,
  Tv,
} from "lucide-react";
import { useCallback, useState } from "react";

import { CastGrid } from "@/components/media/cast-grid";
import { GenreChips } from "@/components/media/genre-chips";
import { ImageGallery } from "@/components/media/image-gallery";
import { MediaRow } from "@/components/media/media-row";
import { MyListButton } from "@/components/media/my-list-button";
import { TrailerModal } from "@/components/media/trailer-modal";
import { VideoCarousel } from "@/components/media/video-carousel";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClassName } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionShell } from "@/components/ui/section-shell";
import { getBackdropUrl, getPosterUrl } from "@/lib/tmdb/images";
import type { MediaDetail, MediaVideo } from "@/types/media";

interface TitleDetailViewProps {
  detail: MediaDetail | null;
}

const formatRuntime = (runtime: number | null) => {
  if (!runtime) return null;
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
};

const formatReleaseDate = (date: string | null) => {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

const getReleaseYear = (date: string | null) => {
  if (!date) return null;
  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? null : String(year);
};

const getMatchScore = (vote: number) => {
  if (vote <= 0) return null;
  return Math.round(vote * 10);
};

export const TitleDetailView = ({ detail }: TitleDetailViewProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [trailerVideo, setTrailerVideo] = useState<MediaVideo | null>(null);

  const handleShare = useCallback(async () => {
    if (!detail) return;
    const url = `${window.location.origin}/title/${detail.mediaType}/${detail.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: detail.title, text: detail.overview, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  }, [detail]);

  if (!detail) {
    return (
      <div className="pb-16 pt-28">
        <EmptyState
          title="Title unavailable"
          description="We could not load this title right now. Please try again in a moment."
          action={
            <Link href="/" className={buttonClassName({ variant: "secondary" })}>
              Back to Home
            </Link>
          }
        />
      </div>
    );
  }

  const trailer = detail.videos.find(
    (video) => video.type.toLowerCase() === "trailer" && video.official,
  ) ?? detail.videos.find((video) => video.type.toLowerCase() === "trailer");

  const director = detail.crew.find((m) => m.job === "Director");
  const writers = detail.crew
    .filter((m) => m.department === "Writing" || m.job === "Writer" || m.job === "Screenplay")
    .slice(0, 3);
  const releaseLabel = formatReleaseDate(detail.releaseDate);
  const runtimeLabel = formatRuntime(detail.runtime);
  const releaseYear = getReleaseYear(detail.releaseDate);
  const matchScore = getMatchScore(detail.voteAverage);

  return (
    <article className="space-y-8 pb-16 pt-20 md:space-y-12 md:pt-24">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs uppercase tracking-wide text-text-400"
      >
        <Link href="/" className="transition hover:text-text-50">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/${detail.mediaType === "movie" ? "movies" : "tv"}`}
          className="transition hover:text-text-50"
        >
          {detail.mediaType === "movie" ? "Movies" : "TV Shows"}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="line-clamp-1 text-text-50">{detail.title}</span>
      </nav>

      <section className="relative isolate -mx-4 overflow-hidden md:-mx-8 lg:-mx-12 lg:mx-0 lg:rounded-2xl lg:border lg:border-white/10 lg:shadow-card">
        <Image
          src={getBackdropUrl(detail.backdropPath, "w1280")}
          alt={detail.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-950/95 via-surface-950/60 to-surface-950/30" />
        <div className="absolute inset-0 bg-hero-fade" />

        <div className="relative z-10 grid gap-6 p-6 md:grid-cols-[220px,1fr] md:gap-10 md:p-10 lg:p-14">
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative mx-auto aspect-[2/3] w-44 overflow-hidden rounded-xl border border-white/15 shadow-card md:mx-0 md:w-full"
          >
            <Image
              src={getPosterUrl(detail.posterPath, "w500")}
              alt={`${detail.title} poster`}
              fill
              sizes="(max-width: 768px) 44vw, 220px"
              className="object-cover"
              priority
            />
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col justify-end gap-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand">
                {detail.mediaType === "tv" ? "TV SERIES" : "MOVIE"}
              </Badge>
              {detail.voteAverage > 0 && (
                <Badge variant="gold" className="gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  {detail.voteAverage.toFixed(1)}
                </Badge>
              )}
              {matchScore && (
                <span className="text-sm font-bold text-emerald-400">{matchScore}% Match</span>
              )}
              <Badge variant="outline">HD</Badge>
              {detail.originalLanguage && (
                <Badge variant="outline" className="gap-1">
                  <Globe className="h-2.5 w-2.5" />
                  {detail.originalLanguage.toUpperCase()}
                </Badge>
              )}
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              {detail.title}
            </h1>

            {detail.tagline && (
              <p className="text-sm italic text-text-300">&ldquo;{detail.tagline}&rdquo;</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-text-300">
              {releaseYear && <span>{releaseYear}</span>}
              {runtimeLabel && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {runtimeLabel}
                </span>
              )}
              {detail.numberOfSeasons && (
                <span className="flex items-center gap-1">
                  <Tv className="h-3.5 w-3.5" />
                  {detail.numberOfSeasons} Season{detail.numberOfSeasons > 1 ? "s" : ""}
                </span>
              )}
              {detail.status && (
                <Badge variant="outline" className="text-[10px]">{detail.status}</Badge>
              )}
            </div>

            <p className="max-w-3xl text-sm text-text-200 md:text-base leading-relaxed">
              {detail.overview}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {trailer ? (
                <Button
                  size="lg"
                  onClick={() => setTrailerVideo(trailer)}
                >
                  <Play className="h-5 w-5 fill-current" />
                  Play Trailer
                </Button>
              ) : (
                <Link
                  href={`/title/${detail.mediaType}/${detail.id}`}
                  className={buttonClassName({ variant: "primary", size: "lg" })}
                >
                  <Play className="h-5 w-5 fill-current" />
                  Play
                </Link>
              )}
              <MyListButton item={detail} size="lg" />
              <Button variant="outline" size="icon" onClick={handleShare} aria-label="Share">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  void navigator.clipboard.writeText(window.location.href);
                }}
                aria-label="Copy link"
              >
                <Link2 className="h-4 w-4" />
              </Button>
            </div>

            <dl className="mt-2 grid gap-x-6 gap-y-2 text-xs text-text-400 sm:grid-cols-2 md:grid-cols-3 md:text-sm">
              {releaseLabel && (
                <div>
                  <dt className="font-semibold text-text-200">Released</dt>
                  <dd>{releaseLabel}</dd>
                </div>
              )}
              {director && (
                <div>
                  <dt className="font-semibold text-text-200">Director</dt>
                  <dd>{director.name}</dd>
                </div>
              )}
              {writers.length > 0 && (
                <div>
                  <dt className="font-semibold text-text-200">Writers</dt>
                  <dd className="line-clamp-1">{writers.map((w) => w.name).join(", ")}</dd>
                </div>
              )}
            </dl>
          </motion.div>
        </div>
      </section>

      <SectionShell title="Genres">
        <GenreChips genres={detail.genres} />
      </SectionShell>

      <CastGrid cast={detail.cast} maxItems={12} />

      {detail.videos.length > 0 && <VideoCarousel videos={detail.videos} />}

      {detail.images.backdrops.length > 0 && (
        <ImageGallery images={detail.images.backdrops} title="Images" />
      )}

      {detail.recommendations.length > 0 && (
        <MediaRow title="Recommended For You" items={detail.recommendations} variant="poster" />
      )}

      {detail.similar.length > 0 && (
        <MediaRow title="More Like This" items={detail.similar} variant="poster" />
      )}

      <TrailerModal
        video={trailerVideo}
        open={trailerVideo !== null}
        onClose={() => setTrailerVideo(null)}
      />
    </article>
  );
};
