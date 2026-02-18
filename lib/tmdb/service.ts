import type { MediaDetail, MediaItem, MediaRail, MediaType } from "@/types/media";
import { hasTmdbApiKey } from "@/lib/env";

import { tmdbRequest } from "./client";
import { tmdbEndpoints } from "./endpoints";
import {
  mapMovieDetail,
  mapPaginatedListToMedia,
  mapTvDetail,
} from "./mappers";
import {
  tmdbMovieDetailSchema,
  tmdbPaginatedListSchema,
  tmdbTvDetailSchema,
} from "./types";

export interface HomePageData {
  featured: MediaItem | null;
  rails: MediaRail[];
  hasData: boolean;
  errorMessage: string | null;
}

const MISSING_KEY_MESSAGE =
  "TMDB_API_KEY is not configured. Add it in .env.local for local development, or in your deployment platform environment variables (Vercel/Netlify).";

const safeRequest = async <T>(promise: Promise<T>): Promise<T | null> => {
  try {
    return await promise;
  } catch {
    return null;
  }
};

export const getHomePageData = async (): Promise<HomePageData> => {
  if (!hasTmdbApiKey()) {
    return {
      featured: null,
      rails: [],
      hasData: false,
      errorMessage: MISSING_KEY_MESSAGE,
    };
  }

  const [
    trendingToday,
    trendingWeek,
    popularMovies,
    popularTv,
    topRated,
    upcoming,
    nowPlaying,
  ] = await Promise.all([
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.trendingToday(),
        schema: tmdbPaginatedListSchema,
      }),
    ),
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.trendingWeek(),
        schema: tmdbPaginatedListSchema,
      }),
    ),
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.popularMovies(),
        schema: tmdbPaginatedListSchema,
      }),
    ),
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.popularTv(),
        schema: tmdbPaginatedListSchema,
      }),
    ),
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.topRated(),
        schema: tmdbPaginatedListSchema,
      }),
    ),
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.upcomingMovies(),
        schema: tmdbPaginatedListSchema,
      }),
    ),
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.nowPlayingMovies(),
        schema: tmdbPaginatedListSchema,
      }),
    ),
  ]);

  const rails: MediaRail[] = [
    {
      id: "trending-today",
      title: "Trending Today",
      items: trendingToday ? mapPaginatedListToMedia(trendingToday) : [],
    },
    {
      id: "trending-week",
      title: "Trending This Week",
      items: trendingWeek ? mapPaginatedListToMedia(trendingWeek) : [],
    },
    {
      id: "popular-movies",
      title: "Popular Movies",
      items: popularMovies ? mapPaginatedListToMedia(popularMovies, "movie") : [],
    },
    {
      id: "popular-tv",
      title: "Popular TV",
      items: popularTv ? mapPaginatedListToMedia(popularTv, "tv") : [],
    },
    {
      id: "top-rated",
      title: "Top Rated",
      items: topRated ? mapPaginatedListToMedia(topRated, "movie") : [],
    },
    {
      id: "now-playing",
      title: "Now Playing",
      items: nowPlaying ? mapPaginatedListToMedia(nowPlaying, "movie") : [],
    },
    {
      id: "upcoming",
      title: "Upcoming Releases",
      items: upcoming ? mapPaginatedListToMedia(upcoming, "movie") : [],
    },
  ].filter((rail) => rail.items.length > 0);

  const featured = rails.find((rail) => rail.items.length > 0)?.items[0] ?? null;
  const hasData = rails.length > 0;

  return {
    featured,
    rails,
    hasData,
    errorMessage: hasData
      ? null
      : "TMDB data is currently unavailable right now. Please try again in a few moments.",
  };
};

export const getMediaDetail = async (
  mediaType: MediaType,
  id: number,
): Promise<MediaDetail | null> => {
  if (!hasTmdbApiKey()) {
    return null;
  }

  if (mediaType === "movie") {
    const movie = await safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.movieDetails(id),
        schema: tmdbMovieDetailSchema,
      }),
    );

    return movie ? mapMovieDetail(movie) : null;
  }

  const tvShow = await safeRequest(
    tmdbRequest({
      endpoint: tmdbEndpoints.tvDetails(id),
      schema: tmdbTvDetailSchema,
    }),
  );

  return tvShow ? mapTvDetail(tvShow) : null;
};
