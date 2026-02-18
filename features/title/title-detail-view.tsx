import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Play } from "lucide-react";

import { CastGrid } from "@/components/media/cast-grid";
import { MediaRow } from "@/components/media/media-row";
import { Badge } from "@/components/ui/badge";
import { buttonClassName } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionShell } from "@/components/ui/section-shell";
import { getBackdropUrl, getPosterUrl } from "@/lib/tmdb/images";
import type { MediaDetail } from "@/types/media";

interface TitleDetailViewProps {
  detail: MediaDetail | null;
}

const formatRuntime = (runtime: number | null) => {
  if (!runtime) {
    return null;
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
};

const formatReleaseDate = (date: string | null) => {
  if (!date) {
    return null;
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

export const TitleDetailView = ({ detail }: TitleDetailViewProps) => {
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
    (video) => video.type.toLowerCase() === "trailer" && video.site.toLowerCase() === "youtube",
  );
  const director = detail.crew.find((member) => member.job === "Director");
  const releaseLabel = formatReleaseDate(detail.releaseDate);
  const runtimeLabel = formatRuntime(detail.runtime);

  return (
    <article className="space-y-10 pb-16 pt-28 md:space-y-12 md:pt-32">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs uppercase tracking-wide text-text-400"
      >
        <Link href="/" className="transition hover:text-text-50">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/${detail.mediaType === "movie" ? "movies" : "tv"}`} className="transition hover:text-text-50">
          {detail.mediaType === "movie" ? "Movies" : "TV Shows"}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="line-clamp-1 text-text-50">{detail.title}</span>
      </nav>

      <section className="relative isolate overflow-hidden rounded-2xl border border-white/10 shadow-card">
        <Image
          src={getBackdropUrl(detail.backdropPath, "w1280")}
          alt={detail.title}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1400px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-950/90 via-surface-950/55 to-surface-950/30" />
        <div className="absolute inset-0 bg-hero-fade" />

        <div className="relative z-10 grid gap-6 p-6 md:grid-cols-[220px,1fr] md:gap-8 md:p-10">
          <div className="relative mx-auto aspect-[2/3] w-44 overflow-hidden rounded-xl border border-white/15 shadow-card md:mx-0 md:w-full">
            <Image
              src={getPosterUrl(detail.posterPath, "w500")}
              alt={`${detail.title} poster`}
              fill
              sizes="(max-width: 768px) 44vw, 220px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-end gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-brand-500/20 text-white">{detail.mediaType.toUpperCase()}</Badge>
              {detail.voteAverage > 0 ? <Badge>{detail.voteAverage.toFixed(1)} Rating</Badge> : null}
              {runtimeLabel ? <Badge>{runtimeLabel}</Badge> : null}
            </div>
            <h1 className="font-display text-3xl font-semibold text-white md:text-5xl">
              {detail.title}
            </h1>
            {detail.tagline ? <p className="text-sm italic text-text-200">{detail.tagline}</p> : null}

            <p className="max-w-3xl text-sm text-text-200 md:text-base">{detail.overview}</p>

            <div className="flex flex-wrap gap-3">
              {trailer ? (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClassName({ variant: "primary", size: "lg" })}
                >
                  <Play className="h-5 w-5 fill-current" />
                  Play Trailer
                </a>
              ) : (
                <Link
                  href={`/title/${detail.mediaType}/${detail.id}`}
                  className={buttonClassName({ variant: "primary", size: "lg" })}
                >
                  <Play className="h-5 w-5 fill-current" />
                  Play
                </Link>
              )}
            </div>

            <dl className="grid gap-1 text-xs text-text-400 md:grid-cols-3 md:gap-3 md:text-sm">
              {releaseLabel ? (
                <div>
                  <dt className="font-medium text-text-50">Released</dt>
                  <dd>{releaseLabel}</dd>
                </div>
              ) : null}
              {detail.status ? (
                <div>
                  <dt className="font-medium text-text-50">Status</dt>
                  <dd>{detail.status}</dd>
                </div>
              ) : null}
              {director ? (
                <div>
                  <dt className="font-medium text-text-50">Director</dt>
                  <dd>{director.name}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>
      </section>

      <SectionShell title="Genres">
        <div className="flex flex-wrap gap-2">
          {detail.genres.map((genre) => (
            <Badge key={genre.id}>{genre.name}</Badge>
          ))}
        </div>
      </SectionShell>

      <CastGrid cast={detail.cast} />

      {detail.similar.length > 0 ? (
        <MediaRow title="Similar Titles" items={detail.similar} variant="poster" />
      ) : null}
    </article>
  );
};
