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
  tmdbMovieDetailSchema,
  tmdbPaginatedListSchema,
  tmdbTvDetailSchema,
} from "./types";

export interface HomePageData {
  featured: MediaDetail | null;
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
      items: trendingToday.data ? mapPaginatedListToMedia(trendingToday.data) : [],
    },
    {
      id: "trending-week",
      title: "Trending This Week",
      items: trendingWeek.data ? mapPaginatedListToMedia(trendingWeek.data) : [],
    },
    {
      id: "popular-movies",
      title: "Popular Movies",
      items: popularMovies.data ? mapPaginatedListToMedia(popularMovies.data, "movie") : [],
    },
    {
      id: "popular-tv",
      title: "Popular TV",
      items: popularTv.data ? mapPaginatedListToMedia(popularTv.data, "tv") : [],
    },
    {
      id: "top-rated",
      title: "Top Rated",
      items: topRated.data ? mapPaginatedListToMedia(topRated.data, "movie") : [],
    },
    {
      id: "now-playing",
      title: "Now Playing",
      items: nowPlaying.data ? mapPaginatedListToMedia(nowPlaying.data, "movie") : [],
    },
    {
      id: "upcoming",
      title: "Upcoming Releases",
      items: upcoming.data ? mapPaginatedListToMedia(upcoming.data, "movie") : [],
    },
  ].filter((rail) => rail.items.length > 0);

  const featuredItem = rails.find((rail) => rail.items.length > 0)?.items[0] ?? null;
  const hasData = rails.length > 0;

  let featured: MediaDetail | null = null;
  if (featuredItem) {
    const detail = await getMediaDetail(featuredItem.mediaType, featuredItem.id);
    featured = detail;
  }

  const firstRequestError =
    [
      trendingToday,
      trendingWeek,
      popularMovies,
      popularTv,
      topRated,
      upcoming,
      nowPlaying,
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
