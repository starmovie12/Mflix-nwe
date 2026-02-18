import { Suspense } from "react";
import type { Metadata } from "next";
import {
  getTrending,
  getUpcomingMovies,
  getNowPlayingMovies,
  getAiringTodayTV,
} from "@/lib/tmdb/endpoints";
import { mapMovie, mapTVShow, mapMultiResult } from "@/lib/tmdb/mappers";
import { ContentRow } from "@/components/ui/content-row";
import { RowSkeleton } from "@/components/ui/skeleton";
import type { MediaItem } from "@/types/app";

export const metadata: Metadata = {
  title: "New & Popular",
  description: "Discover new and popular movies and TV shows on MFLIX.",
};

async function NewPopularContent() {
  const [trendingDay, trendingWeek, upcoming, nowPlaying, airingToday] =
    await Promise.all([
      getTrending("all", "day"),
      getTrending("all", "week"),
      getUpcomingMovies(),
      getNowPlayingMovies(),
      getAiringTodayTV(),
    ]);

  const trendingTodayItems = trendingDay.results
    .map(mapMultiResult)
    .filter((item): item is MediaItem => item !== null);

  const trendingWeekItems = trendingWeek.results
    .map(mapMultiResult)
    .filter((item): item is MediaItem => item !== null);

  return (
    <div className="pt-20 md:pt-24 space-y-2">
      <div className="px-4 md:px-12 mb-4">
        <h1 className="text-fluid-2xl font-bold text-white">New & Popular</h1>
      </div>

      <ContentRow
        title="Trending Today"
        items={trendingTodayItems}
        variant="backdrop"
      />
      <ContentRow
        title="Trending This Week"
        items={trendingWeekItems}
        variant="backdrop"
      />
      <ContentRow
        title="Coming Soon"
        items={upcoming.results.map(mapMovie)}
        variant="poster"
      />
      <ContentRow
        title="Now Playing"
        items={nowPlaying.results.map(mapMovie)}
        variant="backdrop"
      />
      <ContentRow
        title="Airing Today"
        items={airingToday.results.map(mapTVShow)}
        variant="poster"
      />
    </div>
  );
}

export default function NewPopularPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-20 md:pt-24 space-y-8">
          <RowSkeleton variant="backdrop" />
          <RowSkeleton variant="poster" />
          <RowSkeleton variant="backdrop" />
        </div>
      }
    >
      <NewPopularContent />
    </Suspense>
  );
}
