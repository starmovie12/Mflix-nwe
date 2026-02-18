"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBackdropUrl } from "@/lib/tmdb/image";
import { getYear, formatVoteAverage } from "@/lib/tmdb/mappers";
import type { MediaItem } from "@/types/app";

interface HeroBillboardProps {
  items: MediaItem[];
  trailerKeys?: Record<string, string>;
}

export function HeroBillboard({ items, trailerKeys = {} }: HeroBillboardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [, setImageLoaded] = useState(false);

  const item = items[activeIndex];
  const trailerKey = item ? trailerKeys[`${item.mediaType}-${item.id}`] : null;

  useEffect(() => {
    if (!items.length) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Math.min(items.length, 5));
      setShowTrailer(false);
      setImageLoaded(false);
    }, 12000);
    return () => clearInterval(interval);
  }, [items.length]);

  useEffect(() => {
    if (!trailerKey) return;
    const timer = setTimeout(() => setShowTrailer(true), 3000);
    return () => clearTimeout(timer);
  }, [activeIndex, trailerKey]);

  const handleMuteToggle = useCallback(() => setMuted((prev) => !prev), []);

  if (!item) return null;

  const backdropUrl = getBackdropUrl(item.backdropPath, "original");

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden" aria-label="Featured content">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${item.mediaType}-${item.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {showTrailer && trailerKey ? (
            <div className="absolute inset-0 overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${trailerKey}&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1`}
                className="absolute inset-0 w-full h-full scale-[1.2] pointer-events-none"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={`${item.title} trailer`}
              />
            </div>
          ) : (
            <Image
              src={backdropUrl}
              alt={item.title}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
              onLoad={() => setImageLoaded(true)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-32 px-4 md:px-12 max-w-3xl">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-fluid-3xl md:text-fluid-4xl font-bold text-white leading-tight drop-shadow-lg">
            {item.title}
          </h1>

          <div className="flex items-center gap-3 text-sm">
            {item.voteAverage > 0 && (
              <span className="text-green-400 font-semibold">
                {formatVoteAverage(item.voteAverage)} Match
              </span>
            )}
            {item.releaseDate && (
              <span className="text-mflix-gray-200">{getYear(item.releaseDate)}</span>
            )}
            <span className="border border-mflix-gray-400 text-mflix-gray-200 px-1.5 py-0.5 text-xs rounded">
              HD
            </span>
          </div>

          <p className="text-sm md:text-base text-mflix-gray-100 line-clamp-3 max-w-xl leading-relaxed">
            {item.overview}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Link href={`/watch/${item.mediaType}/${item.id}`}>
              <Button variant="primary" size="lg">
                <Play size={20} fill="black" />
                Play
              </Button>
            </Link>
            <Link href={`/title/${item.mediaType}/${item.id}`}>
              <Button variant="secondary" size="lg">
                <Info size={20} />
                More Info
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {showTrailer && trailerKey && (
        <button
          onClick={handleMuteToggle}
          className="absolute bottom-28 md:bottom-36 right-4 md:right-12 z-20 w-10 h-10 rounded-full border border-mflix-gray-400 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {items.length > 1 && (
        <div className="absolute bottom-16 right-4 md:right-12 z-20 flex items-center gap-1.5">
          {items.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i);
                setShowTrailer(false);
                setImageLoaded(false);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? "bg-white w-6" : "bg-mflix-gray-500 hover:bg-mflix-gray-300"
              }`}
              aria-label={`Show featured item ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
