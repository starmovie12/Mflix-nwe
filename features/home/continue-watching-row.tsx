"use client";

import Image from "next/image";
import Link from "next/link";

import { SectionShell } from "@/components/ui/section-shell";
import { useAppHydrated } from "@/hooks/use-app-hydrated";
import { getBackdropUrl } from "@/lib/tmdb/images";
import { useAppStore } from "@/lib/store/app-store";

export const ContinueWatchingRow = () => {
  const hydrated = useAppHydrated();
  const items = useAppStore((state) =>
    state
      .getContinueWatching()
      .slice(0, 10)
      .sort((a, b) => b.updatedAt - a.updatedAt),
  );

  if (!hydrated || items.length === 0) {
    return null;
  }

  return (
    <SectionShell title="Continue Watching">
      <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        {items.map((item) => (
          <Link
            key={`${item.mediaType}-${item.mediaId}`}
            href={`/watch/${item.mediaType}/${item.mediaId}`}
            className="group block w-[76vw] shrink-0 snap-start overflow-hidden rounded-xl border border-white/10 bg-surface-900 sm:w-80"
            aria-label={`Resume ${item.title}`}
          >
            <div className="relative aspect-video">
              <Image
                src={getBackdropUrl(item.backdropPath, "w780")}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 80vw, 320px"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="line-clamp-1 text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-text-200">{Math.round(item.progress * 100)}% watched</p>
              </div>
            </div>
            <div className="h-1 w-full bg-white/10">
              <div className="h-full bg-brand-500" style={{ width: `${Math.max(4, Math.round(item.progress * 100))}%` }} />
            </div>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
};
