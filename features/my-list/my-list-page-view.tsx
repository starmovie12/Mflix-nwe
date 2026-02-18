"use client";

import Link from "next/link";
import { Play, Trash2 } from "lucide-react";

import { MediaCard } from "@/components/media/media-card";
import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionShell } from "@/components/ui/section-shell";
import { useToast } from "@/components/providers/toast-provider";
import { useAppHydrated } from "@/hooks/use-app-hydrated";
import { useAppStore } from "@/lib/store/app-store";

export const MyListPageView = () => {
  const hydrated = useAppHydrated();
  const watchlist = useAppStore((state) => state.getActiveWatchlist().slice().sort((a, b) => b.addedAt - a.addedAt));
  const continueWatching = useAppStore((state) =>
    state
      .getContinueWatching()
      .slice()
      .sort((a, b) => b.updatedAt - a.updatedAt),
  );
  const removeFromWatchlist = useAppStore((state) => state.removeFromWatchlist);
  const { info } = useToast();

  if (!hydrated) {
    return (
      <main className="app-shell pb-16 pt-24">
        <Card className="h-32 animate-pulse" />
      </main>
    );
  }

  const hasAnyItems = watchlist.length > 0 || continueWatching.length > 0;
  if (!hasAnyItems) {
    return (
      <main className="app-shell pb-16 pt-28">
        <EmptyState
          title="Your list is empty"
          description="Save movies and series to watch later. Start by exploring trending titles."
          action={
            <Link href="/" className={buttonClassName({ variant: "secondary" })}>
              Browse Home
            </Link>
          }
        />
      </main>
    );
  }

  return (
    <main className="app-shell space-y-10 pb-16 pt-20 md:pt-24">
      <section className="space-y-3">
        <h1 className="font-display text-3xl font-semibold text-text-50 md:text-5xl">My List</h1>
        <p className="max-w-3xl text-sm text-text-200 md:text-base">
          Your saved titles and in-progress sessions are linked to the active profile.
        </p>
      </section>

      {continueWatching.length > 0 ? (
        <SectionShell title="Continue Watching">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {continueWatching.map((item) => (
              <Card key={`${item.mediaType}-${item.mediaId}`} className="space-y-3">
                <div className="space-y-1">
                  <p className="line-clamp-1 font-medium text-text-50">{item.title}</p>
                  <p className="text-xs text-text-400">{Math.round(item.progress * 100)}% completed</p>
                </div>
                <div className="h-1 w-full rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${item.progress * 100}%` }} />
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/watch/${item.mediaType}/${item.mediaId}`}
                    className={buttonClassName({ size: "md", variant: "primary" })}
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Resume
                  </Link>
                  <Link
                    href={`/title/${item.mediaType}/${item.mediaId}`}
                    className={buttonClassName({ size: "md", variant: "ghost" })}
                  >
                    Details
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </SectionShell>
      ) : null}

      {watchlist.length > 0 ? (
        <SectionShell title={`Saved Titles (${watchlist.length})`}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {watchlist.map((item) => (
              <div key={`${item.mediaType}-${item.id}`} className="space-y-2">
                <MediaCard item={item} variant="poster" />
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs text-text-400 transition hover:text-text-50"
                  onClick={() => {
                    removeFromWatchlist(item.mediaType, item.id);
                    info("Removed from My List", item.title);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        </SectionShell>
      ) : null}
    </main>
  );
};
