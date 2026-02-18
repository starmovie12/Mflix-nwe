"use client";

import Link from "next/link";
import { Check, Copy, Play, Plus, Share2 } from "lucide-react";

import { buttonClassName } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { useAnalytics } from "@/hooks/use-analytics";
import { useAppHydrated } from "@/hooks/use-app-hydrated";
import { useAppStore } from "@/lib/store/app-store";
import type { MediaDetail } from "@/types/media";

interface TitleActionsProps {
  detail: MediaDetail;
  trailerKey?: string;
}

export const TitleActions = ({ detail, trailerKey }: TitleActionsProps) => {
  const hydrated = useAppHydrated();
  const toggleWatchlist = useAppStore((state) => state.toggleWatchlist);
  const hasPlayback = useAppStore((state) =>
    Boolean(state.getPlaybackForTitle(detail.mediaType, detail.id)),
  );
  const inList = useAppStore((state) => {
    const list = state.watchlistByProfile[state.activeProfileId] ?? [];
    return list.some((item) => item.id === detail.id && item.mediaType === detail.mediaType);
  });

  const { success, info, error } = useToast();
  const { trackEvent } = useAnalytics();

  const watchHref = `/watch/${detail.mediaType}/${detail.id}`;
  const titleHref = `/title/${detail.mediaType}/${detail.id}`;
  const getAbsoluteUrl = () =>
    typeof window !== "undefined" ? `${window.location.origin}${titleHref}` : titleHref;

  const toggleList = () => {
    const nowInList = toggleWatchlist({
      id: detail.id,
      mediaType: detail.mediaType,
      title: detail.title,
      overview: detail.overview,
      posterPath: detail.posterPath,
      backdropPath: detail.backdropPath,
      releaseDate: detail.releaseDate,
      voteAverage: detail.voteAverage,
      genreIds: detail.genreIds,
    });

    if (nowInList) {
      success("Added to My List", detail.title);
      trackEvent("watchlist_added", { mediaType: detail.mediaType, mediaId: detail.id });
      return;
    }

    info("Removed from My List", detail.title);
    trackEvent("watchlist_removed", { mediaType: detail.mediaType, mediaId: detail.id });
  };

  const shareTitle = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: detail.title,
          text: `Watch ${detail.title} on MFLIX`,
          url: getAbsoluteUrl(),
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(getAbsoluteUrl());
        success("Link copied", "Share it anywhere.");
      }
      trackEvent("title_opened", { mediaType: detail.mediaType, mediaId: detail.id, source: "share" });
    } catch (shareError) {
      if (shareError instanceof Error && shareError.name === "AbortError") {
        return;
      }
      error("Unable to share this title");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getAbsoluteUrl());
      success("Link copied", detail.title);
    } catch {
      error("Copy failed", "Clipboard access is unavailable.");
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Link href={watchHref} className={buttonClassName({ variant: "primary", size: "lg" })}>
        <Play className="h-5 w-5 fill-current" />
        {hydrated && hasPlayback ? "Resume" : "Play"}
      </Link>
      {trailerKey ? (
        <a
          href={`https://www.youtube.com/watch?v=${trailerKey}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClassName({ variant: "secondary", size: "lg" })}
        >
          <Play className="h-5 w-5 fill-current" />
          Trailer
        </a>
      ) : null}
      <button type="button" onClick={toggleList} className={buttonClassName({ variant: "secondary", size: "lg" })}>
        {inList ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        {inList ? "In My List" : "My List"}
      </button>
      <button type="button" onClick={() => void shareTitle()} className={buttonClassName({ variant: "ghost", size: "lg" })}>
        <Share2 className="h-5 w-5" />
        Share
      </button>
      <button type="button" onClick={() => void copyLink()} className={buttonClassName({ variant: "ghost", size: "lg" })}>
        <Copy className="h-5 w-5" />
        Copy Link
      </button>
    </div>
  );
};
