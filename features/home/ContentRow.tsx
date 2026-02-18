'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MediaCard from '@/components/ui/Card';
import type { MediaItem } from '@/lib/tmdb/types';

interface ContentRowProps {
  title: string;
  items: MediaItem[];
  variant?: 'poster' | 'backdrop';
  showRank?: boolean;
}

export default function ContentRow({
  title,
  items,
  variant = 'poster',
  showRank = false,
}: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (items.length === 0) return null;

  return (
    <section className="group/row">
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <h2 className="text-fluid-xl font-semibold text-white">{title}</h2>
        <div className="flex gap-2 opacity-0 transition-opacity group-hover/row:opacity-100">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="rounded-full bg-mflix-gray-700/80 p-2 text-white transition-colors hover:bg-mflix-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mflix-red"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="rounded-full bg-mflix-gray-700/80 p-2 text-white transition-colors hover:bg-mflix-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mflix-red"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide snap-x-mandatory px-4 pb-4 md:px-8"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {items.map((item, index) => (
            <motion.div
              key={`${item.mediaType}-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="snap-start shrink-0"
              style={{
                width: variant === 'poster' ? 'clamp(120px, 20vw, 200px)' : 'clamp(280px, 40vw, 400px)',
              }}
            >
              <MediaCard
                item={item}
                variant={variant}
                rank={showRank ? index + 1 : undefined}
                priority={index < 6}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
