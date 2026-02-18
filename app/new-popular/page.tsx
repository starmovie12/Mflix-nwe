import type { Metadata } from "next";

import { BrowsePageView } from "@/features/browse/browse-page-view";
import { APP_NAME } from "@/lib/constants";
import { hasTmdbApiKey } from "@/lib/env";
import { tmdbRequest } from "@/lib/tmdb/client";
import { tmdbEndpoints } from "@/lib/tmdb/endpoints";
import { mapPaginatedListToMedia } from "@/lib/tmdb/mappers";
import { tmdbPaginatedListSchema, type TmdbPaginatedListResponse } from "@/lib/tmdb/types";
import type { MediaRail } from "@/types/media";

export const metadata: Metadata = {
  title: `New & Popular | ${APP_NAME}`,
  description: "Discover new and popular movies and TV shows on MFLIX.",
};

export const dynamic = "force-dynamic";

async function fetchList(endpoint: ReturnType<typeof tmdbEndpoints.trendingToday>): Promise<TmdbPaginatedListResponse | null> {
  try {
    return await tmdbRequest({ endpoint, schema: tmdbPaginatedListSchema });
  } catch {
    return null;
  }
}

export default async function NewPopularPage() {
  if (!hasTmdbApiKey()) {
    return (
      <main className="app-shell pt-24 pb-16">
        <p className="text-center text-text-400">TMDB API key required.</p>
      </main>
    );
  }

  const [trendingToday, trendingWeek, upcoming, nowPlaying, onTheAir] = await Promise.all([
    fetchList(tmdbEndpoints.trendingToday()),
    fetchList(tmdbEndpoints.trendingWeek()),
    fetchList(tmdbEndpoints.upcomingMovies()),
    fetchList(tmdbEndpoints.nowPlayingMovies()),
    fetchList(tmdbEndpoints.onTheAirTv()),
  ]);

  const rails: MediaRail[] = [
    {
      id: "trending-today",
      title: "Trending Today",
      items: trendingToday ? mapPaginatedListToMedia(trendingToday) : [],
      variant: "backdrop" as const,
    },
    {
      id: "trending-week",
      title: "Trending This Week",
      items: trendingWeek ? mapPaginatedListToMedia(trendingWeek) : [],
      variant: "backdrop" as const,
    },
    {
      id: "upcoming",
      title: "Coming Soon",
      items: upcoming ? mapPaginatedListToMedia(upcoming, "movie") : [],
    },
    {
      id: "now-playing",
      title: "Now In Theaters",
      items: nowPlaying ? mapPaginatedListToMedia(nowPlaying, "movie") : [],
    },
    {
      id: "on-the-air",
      title: "New TV Episodes",
      items: onTheAir ? mapPaginatedListToMedia(onTheAir, "tv") : [],
    },
  ].filter((r) => r.items.length > 0);

  return (
    <main className="app-shell">
      <BrowsePageView
        title="New & Popular"
        description="The latest trending content and upcoming releases"
        rails={rails}
      />
    </main>
  );
}
