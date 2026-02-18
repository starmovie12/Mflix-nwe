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
  title: `TV Shows | ${APP_NAME}`,
  description: "Browse popular, top rated, and airing TV shows on MFLIX.",
};

export const dynamic = "force-dynamic";

async function fetchList(endpoint: ReturnType<typeof tmdbEndpoints.popularTv>): Promise<TmdbPaginatedListResponse | null> {
  try {
    return await tmdbRequest({ endpoint, schema: tmdbPaginatedListSchema });
  } catch {
    return null;
  }
}

export default async function TvShowsPage() {
  if (!hasTmdbApiKey()) {
    return (
      <main className="app-shell pt-24 pb-16">
        <p className="text-center text-text-400">TMDB API key required.</p>
      </main>
    );
  }

  const [popular, topRated, airingToday, onTheAir] = await Promise.all([
    fetchList(tmdbEndpoints.popularTv()),
    fetchList(tmdbEndpoints.topRatedTv()),
    fetchList(tmdbEndpoints.airingTodayTv()),
    fetchList(tmdbEndpoints.onTheAirTv()),
  ]);

  const rails: MediaRail[] = [
    { id: "popular", title: "Popular TV Shows", items: popular ? mapPaginatedListToMedia(popular, "tv") : [] },
    { id: "airing-today", title: "Airing Today", items: airingToday ? mapPaginatedListToMedia(airingToday, "tv") : [] },
    { id: "on-the-air", title: "On The Air", items: onTheAir ? mapPaginatedListToMedia(onTheAir, "tv") : [] },
    { id: "top-rated", title: "Top Rated", items: topRated ? mapPaginatedListToMedia(topRated, "tv") : [] },
  ].filter((r) => r.items.length > 0);

  return (
    <main className="app-shell">
      <BrowsePageView
        title="TV Shows"
        description="Discover the best series and shows"
        rails={rails}
      />
    </main>
  );
}
