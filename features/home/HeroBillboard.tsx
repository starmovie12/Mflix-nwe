'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import Button from '@/components/ui/Button';
import { getBackdropUrl, FALLBACK_BACKDROP } from '@/lib/tmdb/image';
import type { MediaItem } from '@/lib/tmdb/types';

interface HeroBillboardProps {
  featured: MediaItem;
}

export default function HeroBillboard({ featured }: HeroBillboardProps) {
  const backdropUrl = getBackdropUrl(featured.backdropPath) || FALLBACK_BACKDROP;
  const year = featured.releaseDate
    ? new Date(featured.releaseDate).getFullYear()
    : null;

  return (
    <section className="relative z-0 min-h-[56vw] w-full md:min-h-[45vw]">
      <div className="absolute inset-0">
        <Image
          src={backdropUrl}
          alt={featured.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_BACKDROP;
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-hero"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex min-h-[56vw] flex-col justify-end px-4 pb-12 md:min-h-[45vw] md:max-w-[40%] md:px-8 md:pb-16 lg:max-w-[35%]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-4"
        >
          <h1 className="text-fluid-4xl font-bold leading-tight text-white drop-shadow-lg">
            {featured.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-mflix-gray-200">
            {year && <span>{year}</span>}
            <span className="font-semibold text-green-400">
              {Math.round(featured.voteAverage * 10)}% Match
            </span>
          </div>
          <p className="line-clamp-3 text-fluid-base text-mflix-gray-100 md:line-clamp-4">
            {featured.overview}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href={`/watch/${featured.mediaType}/${featured.id}`}>
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Play className="h-5 w-5 fill-current" />}
              >
                Play
              </Button>
            </Link>
            <Link href={`/title/${featured.mediaType}/${featured.id}`}>
              <Button variant="secondary" size="lg" leftIcon={<Info className="h-5 w-5" />}>
                More Info
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
