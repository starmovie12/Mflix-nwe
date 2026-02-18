import type { MediaDetail, MediaItem, MediaRail, MediaType } from "@/types/media";
import { hasTmdbApiKey } from "@/lib/env";

import { TmdbClientError, tmdbRequest } from "./client";
import { tmdbEndpoints } from "./endpoints";
import {
  mapMovieDetail,
  mapPaginatedListToMedia,
  mapTvDetail,
} from "./mappers";
import {
  tmdbGenreListSchema,
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

const getUserFriendlyTmdbErrorMessage = (error: unknown) => {
  if (error instanceof TmdbClientError) {
    if (error.status === 401 || /invalid api key/i.test(error.message)) {
      return "TMDB_API_KEY appears invalid. Use your TMDB v3 API key in environment variables and redeploy.";
    }
    if (error.status === 404) {
      return "TMDB endpoint not found (404). Verify TMDB_BASE_URL is exactly https://api.themoviedb.org/3.";
    }
    if (error.status === 429) {
      return "TMDB rate limit reached. Please retry after a short while.";
    }
    if (error.status && error.status >= 500) {
      return "TMDB service is temporarily unavailable. Please try again shortly.";
    }
    return `TMDB request failed (${error.status ?? "unknown"}).`;
  }

  if (error instanceof Error) {
    if (/timed out/i.test(error.message)) {
      return "TMDB request timed out. Please retry in a moment.";
    }
    if (/fetch failed/i.test(error.message)) {
      return "TMDB request failed at runtime (network/API blocked). Verify hosting environment outbound access and TMDB key.";
    }
    return `TMDB request failed: ${error.message}`;
  }

  return "TMDB data is currently unavailable right now. Please try again in a few moments.";
};

interface SafeRequestResult<T> {
  data: T | null;
  errorMessage: string | null;
}

const safeRequest = async <T>(promise: Promise<T>): Promise<SafeRequestResult<T>> => {
  try {
    return {
      data: await promise,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: getUserFriendlyTmdbErrorMessage(error),
    };
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
    airingToday,
    topRatedTv,
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
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.airingTodayTv(),
        schema: tmdbPaginatedListSchema,
      }),
    ),
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.topRatedTv(),
        schema: tmdbPaginatedListSchema,
      }),
    ),
  ]);

  const trendingTodayItems = trendingToday.data
    ? mapPaginatedListToMedia(trendingToday.data)
    : [];

  const allRails: MediaRail[] = [
    {
      id: "trending-today",
      title: "Trending Today",
      items: trendingTodayItems,
      variant: "backdrop" as const,
    },
    {
      id: "top-10-movies",
      title: "Top 10 Movies This Week",
      items: trendingWeek.data
        ? mapPaginatedListToMedia(trendingWeek.data)
            .filter((item) => item.mediaType === "movie")
            .slice(0, 10)
        : [],
      variant: "top10" as const,
    },
    {
      id: "popular-movies",
      title: "Popular Movies",
      items: popularMovies.data ? mapPaginatedListToMedia(popularMovies.data, "movie") : [],
      variant: "poster" as const,
    },
    {
      id: "now-playing",
      title: "Now Playing in Theaters",
      items: nowPlaying.data ? mapPaginatedListToMedia(nowPlaying.data, "movie") : [],
      variant: "backdrop" as const,
    },
    {
      id: "popular-tv",
      title: "Popular TV Shows",
      items: popularTv.data ? mapPaginatedListToMedia(popularTv.data, "tv") : [],
      variant: "poster" as const,
    },
    {
      id: "airing-today",
      title: "TV Airing Today",
      items: airingToday.data ? mapPaginatedListToMedia(airingToday.data, "tv") : [],
      variant: "backdrop" as const,
    },
    {
      id: "top-rated",
      title: "Top Rated Movies",
      items: topRated.data ? mapPaginatedListToMedia(topRated.data, "movie") : [],
      variant: "poster" as const,
    },
    {
      id: "top-rated-tv",
      title: "Top Rated TV Shows",
      items: topRatedTv.data ? mapPaginatedListToMedia(topRatedTv.data, "tv") : [],
      variant: "poster" as const,
    },
    {
      id: "upcoming",
      title: "Upcoming Releases",
      items: upcoming.data ? mapPaginatedListToMedia(upcoming.data, "movie") : [],
      variant: "poster" as const,
    },
    {
      id: "trending-week",
      title: "Trending This Week",
      items: trendingWeek.data ? mapPaginatedListToMedia(trendingWeek.data) : [],
      variant: "backdrop" as const,
    },
  ];

  const rails = allRails.filter((rail) => rail.items.length > 0);

  const featured = trendingTodayItems.find((item) => item.backdropPath) ?? null;
  const hasData = rails.length > 0;

  const firstRequestError =
    [
      trendingToday,
      trendingWeek,
      popularMovies,
      popularTv,
      topRated,
      upcoming,
      nowPlaying,
      airingToday,
      topRatedTv,
    ].find((response) => response.errorMessage)?.errorMessage ?? null;

  return {
    featured,
    rails,
    hasData,
    errorMessage: hasData
      ? null
      : firstRequestError ?? "TMDB data is currently unavailable right now. Please try again in a few moments.",
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
    return movie.data ? mapMovieDetail(movie.data) : null;
  }

  const tvShow = await safeRequest(
    tmdbRequest({
      endpoint: tmdbEndpoints.tvDetails(id),
      schema: tmdbTvDetailSchema,
    }),
  );
  return tvShow.data ? mapTvDetail(tvShow.data) : null;
};
