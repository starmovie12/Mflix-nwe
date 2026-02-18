import { Suspense } from "react";
import {
  getTrending,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getAiringTodayTV,
  getOnTheAirTV,
  getTopRatedTV,
} from "@/lib/tmdb/endpoints";
import {
  mapMovie,
  mapTVShow,
  mapMultiResult,
  getTrailerKey,
  mapVideo,
} from "@/lib/tmdb/mappers";
import { tmdbFetch } from "@/lib/tmdb/client";
import type { TMDBMovieDetails, TMDBTVDetails } from "@/types/tmdb";
import type { MediaItem } from "@/types/app";
import { HeroBillboard } from "@/features/home/hero-billboard";
import { ContentRow } from "@/components/ui/content-row";
import { HeroSkeleton, RowSkeleton } from "@/components/ui/skeleton";

async function getHeroTrailerKeys(
  items: MediaItem[]
): Promise<Record<string, string>> {
  const keys: Record<string, string> = {};
  const topItems = items.slice(0, 5);

  await Promise.allSettled(
    topItems.map(async (item) => {
      try {
        const endpoint =
          item.mediaType === "movie"
            ? `/movie/${item.id}`
            : `/tv/${item.id}`;
        const data = await tmdbFetch<TMDBMovieDetails | TMDBTVDetails>(
          endpoint,
          {
            params: { append_to_response: "videos" },
            revalidate: 7200,
          }
        );
        if (data.videos?.results) {
          const videos = data.videos.results
            .filter((v) => v.site === "YouTube")
            .map(mapVideo);
          const key = getTrailerKey(videos);
          if (key) {
            keys[`${item.mediaType}-${item.id}`] = key;
          }
        }
      } catch {
        // Trailer fetch failure is non-critical
      }
    })
  );

  return keys;
}

async function HomeContent() {
  const [
    trendingDay,
    trendingWeek,
    popularMovies,
    popularTV,
    topRatedMovies,
    nowPlaying,
    upcoming,
    airingToday,
    onTheAir,
    topRatedTV,
  ] = await Promise.all([
    getTrending("all", "day"),
    getTrending("all", "week"),
    getPopularMovies(),
    getPopularTV(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
    getAiringTodayTV(),
    getOnTheAirTV(),
    getTopRatedTV(),
  ]);

  const heroItems = trendingDay.results
    .slice(0, 8)
    .map(mapMultiResult)
    .filter((item): item is MediaItem => item !== null && item.backdropPath !== null);

  const trailerKeys = await getHeroTrailerKeys(heroItems);

  const trendingTodayItems = trendingDay.results
    .map(mapMultiResult)
    .filter((item): item is MediaItem => item !== null);

  const trendingWeekItems = trendingWeek.results
    .map(mapMultiResult)
    .filter((item): item is MediaItem => item !== null);

  const popularMovieItems = popularMovies.results.map(mapMovie);
  const popularTVItems = popularTV.results.map(mapTVShow);
  const topRatedMovieItems = topRatedMovies.results.map(mapMovie);
  const nowPlayingItems = nowPlaying.results.map(mapMovie);
  const upcomingItems = upcoming.results.map(mapMovie);
  const airingTodayItems = airingToday.results.map(mapTVShow);
  const onTheAirItems = onTheAir.results.map(mapTVShow);
  const topRatedTVItems = topRatedTV.results.map(mapTVShow);

  return (
    <>
      <HeroBillboard items={heroItems} trailerKeys={trailerKeys} />

      <div className="-mt-16 md:-mt-24 relative z-10 space-y-2">
        <ContentRow
          title="Top 10 Today"
          items={trendingTodayItems.slice(0, 10)}
          variant="top10"
        />
        <ContentRow
          title="Trending Now"
          items={trendingTodayItems}
          variant="backdrop"
        />
        <ContentRow
          title="Popular Movies"
          items={popularMovieItems}
          variant="poster"
        />
        <ContentRow
          title="Popular TV Shows"
          items={popularTVItems}
          variant="poster"
        />
        <ContentRow
          title="Trending This Week"
          items={trendingWeekItems}
          variant="backdrop"
        />
        <ContentRow
          title="Top Rated Movies"
          items={topRatedMovieItems}
          variant="poster"
        />
        <ContentRow
          title="Now Playing in Theaters"
          items={nowPlayingItems}
          variant="backdrop"
        />
        <ContentRow
          title="Coming Soon"
          items={upcomingItems}
          variant="poster"
        />
        <ContentRow
          title="Airing Today"
          items={airingTodayItems}
          variant="backdrop"
        />
        <ContentRow
          title="On The Air"
          items={onTheAirItems}
          variant="poster"
        />
        <ContentRow
          title="Top Rated TV"
          items={topRatedTVItems}
          variant="poster"
        />
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div>
          <HeroSkeleton />
          <div className="space-y-8 mt-8">
            <RowSkeleton variant="poster" />
            <RowSkeleton variant="backdrop" />
            <RowSkeleton variant="poster" />
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
