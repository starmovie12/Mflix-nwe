'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Plus, Share2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import MediaCard from '@/components/ui/Card';
import {
  getBackdropUrl,
  getProfileUrl,
  FALLBACK_BACKDROP,
  FALLBACK_PROFILE,
} from '@/lib/tmdb/image';
import type { MediaDetail, TvDetail } from '@/lib/tmdb/types';

interface TitleDetailContentProps {
  data: MediaDetail | TvDetail;
}

function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function TitleDetailContent({ data }: TitleDetailContentProps) {
  const backdropUrl = getBackdropUrl(data.backdropPath) || FALLBACK_BACKDROP;
  const year = data.releaseDate
    ? new Date(data.releaseDate).getFullYear()
    : null;
  const isTv = data.mediaType === 'tv';
  const tvData = isTv ? (data as TvDetail) : null;

  const runtime = data.runtime
    ? formatRuntime(data.runtime)
    : tvData?.episodeRunTime?.[0]
      ? formatRuntime(tvData.episodeRunTime[0])
      : '';

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="relative min-h-[50vh]">
        <div className="absolute inset-0">
          <Image
            src={backdropUrl}
            alt={data.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_BACKDROP;
            }}
          />
          <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
        </div>

        <div className="relative z-10 flex min-h-[50vh] flex-col justify-end px-4 pb-8 md:px-8 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-fluid-4xl font-bold text-white drop-shadow-lg">
              {data.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-mflix-gray-200">
              {year && <span>{year}</span>}
              {runtime && (
                <>
                  <span aria-hidden>•</span>
                  <span>{runtime}</span>
                </>
              )}
              {isTv && tvData && (
                <>
                  <span aria-hidden>•</span>
                  <span>{tvData.numberOfSeasons} Seasons</span>
                </>
              )}
              <span aria-hidden>•</span>
              <span className="font-semibold text-green-400">
                {Math.round(data.voteAverage * 10)}% Match
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={`/watch/${data.mediaType}/${data.id}`}>
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<Play className="h-5 w-5 fill-current" />}
                >
                  Play
                </Button>
              </Link>
              <Button variant="secondary" size="lg" leftIcon={<Plus className="h-5 w-5" />}>
                My List
              </Button>
              <Button variant="ghost" size="lg" leftIcon={<Share2 className="h-5 w-5" />}>
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="px-4 py-8 md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-7xl space-y-10"
        >
          {/* Overview */}
          {data.overview && (
            <section>
              <h2 className="mb-3 text-fluid-xl font-semibold text-white">
                Overview
              </h2>
              <p className="max-w-3xl text-fluid-base text-mflix-gray-200 leading-relaxed">
                {data.overview}
              </p>
            </section>
          )}

          {/* Genres */}
          {data.genres.length > 0 && (
            <section>
              <h2 className="mb-3 text-fluid-xl font-semibold text-white">
                Genres
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.genres.map((genre) => (
                  <Badge key={genre.id} variant="gray">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Cast */}
          {data.cast.length > 0 && (
            <section>
              <h2 className="mb-4 text-fluid-xl font-semibold text-white">
                Cast
              </h2>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {data.cast.slice(0, 12).map((member) => {
                  const profileUrl = getProfileUrl(member.profilePath) || FALLBACK_PROFILE;
                  return (
                    <div
                      key={member.id}
                      className="flex shrink-0 flex-col items-center"
                    >
                      <div className="relative h-24 w-24 overflow-hidden rounded-full md:h-32 md:w-32">
                        <Image
                          src={profileUrl}
                          alt={member.name}
                          fill
                          sizes="128px"
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_PROFILE;
                          }}
                        />
                      </div>
                      <p className="mt-2 max-w-[100px] truncate text-center text-sm font-medium text-white">
                        {member.name}
                      </p>
                      <p className="max-w-[100px] truncate text-center text-xs text-mflix-gray-300">
                        {member.character}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Crew */}
          {data.crew.length > 0 && (
            <section>
              <h2 className="mb-3 text-fluid-xl font-semibold text-white">
                Crew
              </h2>
              <div className="flex flex-wrap gap-4">
                {data.crew.map((member) => (
                  <div key={`${member.id}-${member.job}`}>
                    <p className="font-medium text-white">{member.name}</p>
                    <p className="text-sm text-mflix-gray-300">{member.job}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Similar */}
          {data.similar.length > 0 && (
            <section>
              <h2 className="mb-4 text-fluid-xl font-semibold text-white">
                More Like This
              </h2>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {data.similar.map((item) => (
                  <div
                    key={`${item.mediaType}-${item.id}`}
                    className="w-[140px] shrink-0 md:w-[180px]"
                  >
                    <MediaCard item={item} variant="poster" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recommendations */}
          {data.recommendations.length > 0 && (
            <section>
              <h2 className="mb-4 text-fluid-xl font-semibold text-white">
                Recommendations
              </h2>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {data.recommendations.map((item) => (
                  <div
                    key={`${item.mediaType}-${item.id}`}
                    className="w-[140px] shrink-0 md:w-[180px]"
                  >
                    <MediaCard item={item} variant="poster" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </motion.div>
      </div>
    </div>
  );
}
