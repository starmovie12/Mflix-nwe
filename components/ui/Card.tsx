'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  getPosterUrl,
  getBackdropUrl,
  FALLBACK_POSTER,
  FALLBACK_BACKDROP,
} from '@/lib/tmdb/image';
import type { MediaItem } from '@/lib/tmdb/types';

interface MediaCardProps {
  item: MediaItem;
  variant?: 'poster' | 'backdrop' | 'compact';
  rank?: number;
  priority?: boolean;
}

export default function MediaCard({
  item,
  variant = 'poster',
  rank,
  priority = false,
}: MediaCardProps) {
  const posterUrl = getPosterUrl(item.posterPath) || FALLBACK_POSTER;
  const backdropUrl = getBackdropUrl(item.backdropPath) || FALLBACK_BACKDROP;

  const href = `/title/${item.mediaType}/${item.id}`;

  const content = (
    <motion.article
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="group relative block overflow-hidden rounded-lg bg-mflix-gray-700 focus-visible:ring-2 focus-visible:ring-mflix-red focus-visible:ring-offset-2 focus-visible:ring-offset-mflix-black"
    >
      <Link href={href} className="block focus:outline-none">
        {variant === 'poster' && (
          <div className="relative aspect-poster">
            <Image
              src={posterUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={priority}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_POSTER;
              }}
            />
            {rank !== undefined && (
              <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center bg-black/80 text-xl font-bold text-white">
                {rank}
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        )}
        {variant === 'backdrop' && (
          <div className="relative aspect-video">
            <Image
              src={backdropUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={priority}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_BACKDROP;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="font-semibold text-white line-clamp-2">
                {item.title}
              </h3>
            </div>
          </div>
        )}
        {variant === 'compact' && (
          <div className="flex gap-3 p-2">
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded">
              <Image
                src={posterUrl}
                alt={item.title}
                fill
                sizes="48px"
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_POSTER;
                }}
              />
            </div>
            <div className="min-w-0 flex-1 py-1">
              <h3 className="truncate font-medium text-white">{item.title}</h3>
              <p className="text-sm text-mflix-gray-300">
                {item.releaseDate ? new Date(item.releaseDate).getFullYear() : '—'}
              </p>
            </div>
          </div>
        )}
      </Link>
    </motion.article>
  );

  return content;
}
