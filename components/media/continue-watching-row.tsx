"use client";

import Link from "next/link";

import { SectionShell } from "@/components/ui/section-shell";
import { useHydrated } from "@/hooks/use-hydrated";
import { useMflixStore } from "@/hooks/use-mflix-store";
import { getPosterUrl } from "@/lib/tmdb/images";

const toProgressPercent = (progress: number, duration: number) => {
  if (duration <= 0) {
    return 0;
  }

  const percent = (progress / duration) * 100;
  return Math.max(0, Math.min(100, percent));
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const ContinueWatchingRow = () => {
  const hydrated = useHydrated();
  const entries = useMflixStore((state) => state.continueWatching);

  if (!hydrated || entries.length === 0) {
    return null;
  }

  return (
    <SectionShell title="Continue Watching" description="Jump back where you left off">
      <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        {entries.slice(0, 12).map((entry) => (
          <Link
            key={`${entry.mediaType}-${entry.id}`}
            href={`/watch/${entry.mediaType}/${entry.id}`}
            className="group w-[58vw] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-surface-900 transition hover:border-white/20 sm:w-60"
          >
            <div
              className="aspect-[2/3] w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${getPosterUrl(entry.posterPath, "w500")})` }}
            />
            <div className="space-y-2 p-3">
              <p className="line-clamp-1 text-sm font-semibold text-text-50">{entry.title}</p>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{ width: `${toProgressPercent(entry.progress, entry.duration)}%` }}
                />
              </div>
              <p className="text-xs text-text-400">
                {formatTime(entry.progress)} / {formatTime(entry.duration)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
};
