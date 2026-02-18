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
  title: `Movies | ${APP_NAME}`,
  description: "Browse popular, top rated, upcoming, and now playing movies on MFLIX.",
};

export const dynamic = "force-dynamic";

async function fetchList(endpoint: ReturnType<typeof tmdbEndpoints.popularMovies>): Promise<TmdbPaginatedListResponse | null> {
  try {
    return await tmdbRequest({ endpoint, schema: tmdbPaginatedListSchema });
  } catch {
    return null;
  }
}

export default async function MoviesPage() {
  if (!hasTmdbApiKey()) {
    return (
      <main className="app-shell pt-24 pb-16">
        <p className="text-center text-text-400">TMDB API key required.</p>
      </main>
    );
  }

  const [popular, topRated, upcoming, nowPlaying] = await Promise.all([
    fetchList(tmdbEndpoints.popularMovies()),
    fetchList(tmdbEndpoints.topRated()),
    fetchList(tmdbEndpoints.upcomingMovies()),
    fetchList(tmdbEndpoints.nowPlayingMovies()),
  ]);

  const rails: MediaRail[] = [
    { id: "popular", title: "Popular Movies", items: popular ? mapPaginatedListToMedia(popular, "movie") : [] },
    { id: "now-playing", title: "Now Playing", items: nowPlaying ? mapPaginatedListToMedia(nowPlaying, "movie") : [] },
    { id: "top-rated", title: "Top Rated", items: topRated ? mapPaginatedListToMedia(topRated, "movie") : [] },
    { id: "upcoming", title: "Upcoming", items: upcoming ? mapPaginatedListToMedia(upcoming, "movie") : [] },
  ].filter((r) => r.items.length > 0);

  return (
    <main className="app-shell">
      <BrowsePageView
        title="Movies"
        description="Explore the latest and greatest in cinema"
        rails={rails}
      />
    </main>
  );
}
