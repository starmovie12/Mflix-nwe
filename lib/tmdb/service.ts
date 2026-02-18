import type { MediaDetail, MediaGenre, MediaItem, MediaRail, MediaType } from "@/types/media";
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

export interface CatalogPageData {
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

export interface GenreCollections {
  movie: MediaGenre[];
  tv: MediaGenre[];
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

const toRail = (id: string, title: string, items: MediaItem[]): MediaRail => ({
  id,
  title,
  items,
});

const buildCatalogPage = (
  rails: MediaRail[],
  defaultMessage = "TMDB data is currently unavailable right now. Please try again in a few moments.",
): CatalogPageData => {
  const nonEmptyRails = rails.filter((rail) => rail.items.length > 0);
  return {
    featured: nonEmptyRails[0]?.items[0] ?? null,
    rails: nonEmptyRails,
    hasData: nonEmptyRails.length > 0,
    errorMessage: nonEmptyRails.length > 0 ? null : defaultMessage,
  };
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

  const trendingTodayItems = trendingToday.data ? mapPaginatedListToMedia(trendingToday.data) : [];
  const trendingWeekItems = trendingWeek.data ? mapPaginatedListToMedia(trendingWeek.data) : [];
  const popularMovieItems = popularMovies.data
    ? mapPaginatedListToMedia(popularMovies.data, "movie")
    : [];
  const popularTvItems = popularTv.data ? mapPaginatedListToMedia(popularTv.data, "tv") : [];
  const topRatedItems = topRated.data ? mapPaginatedListToMedia(topRated.data, "movie") : [];
  const nowPlayingItems = nowPlaying.data ? mapPaginatedListToMedia(nowPlaying.data, "movie") : [];
  const upcomingItems = upcoming.data ? mapPaginatedListToMedia(upcoming.data, "movie") : [];

  const rails: MediaRail[] = [
    {
      id: "top-10",
      title: "Top 10 Today",
      items: trendingTodayItems.slice(0, 10),
    },
    {
      id: "trending-today",
      title: "Trending Today",
      items: trendingTodayItems,
    },
    {
      id: "trending-week",
      title: "Trending This Week",
      items: trendingWeekItems,
    },
    {
      id: "popular-movies",
      title: "Popular Movies",
      items: popularMovieItems,
    },
    {
      id: "popular-tv",
      title: "Popular TV",
      items: popularTvItems,
    },
    {
      id: "top-rated",
      title: "Top Rated",
      items: topRatedItems,
    },
    {
      id: "now-playing",
      title: "Now Playing",
      items: nowPlayingItems,
    },
    {
      id: "upcoming",
      title: "Upcoming Releases",
      items: upcomingItems,
    },
  ].filter((rail) => rail.items.length > 0);

  const featured = rails.find((rail) => rail.items.length > 0)?.items[0] ?? null;
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

export const getMoviesPageData = async (): Promise<CatalogPageData> => {
  if (!hasTmdbApiKey()) {
    return buildCatalogPage([], MISSING_KEY_MESSAGE);
  }

  const [popular, topRated, nowPlaying, upcoming, trendingWeek] = await Promise.all([
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.popularMovies(),
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
        endpoint: tmdbEndpoints.nowPlayingMovies(),
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
        endpoint: tmdbEndpoints.trendingWeek(),
        schema: tmdbPaginatedListSchema,
      }),
    ),
  ]);

  const rails = [
    toRail(
      "movie-trending-week",
      "Trending Movies",
      trendingWeek.data
        ? mapPaginatedListToMedia(trendingWeek.data).filter((item) => item.mediaType === "movie")
        : [],
    ),
    toRail(
      "movie-popular",
      "Popular Movies",
      popular.data ? mapPaginatedListToMedia(popular.data, "movie") : [],
    ),
    toRail(
      "movie-top-rated",
      "Top Rated Movies",
      topRated.data ? mapPaginatedListToMedia(topRated.data, "movie") : [],
    ),
    toRail(
      "movie-now-playing",
      "Now Playing",
      nowPlaying.data ? mapPaginatedListToMedia(nowPlaying.data, "movie") : [],
    ),
    toRail(
      "movie-upcoming",
      "Upcoming Releases",
      upcoming.data ? mapPaginatedListToMedia(upcoming.data, "movie") : [],
    ),
  ];

  const firstError = [popular, topRated, nowPlaying, upcoming, trendingWeek].find(
    (result) => result.errorMessage,
  )?.errorMessage;

  return buildCatalogPage(rails, firstError ?? undefined);
};

export const getTvPageData = async (): Promise<CatalogPageData> => {
  if (!hasTmdbApiKey()) {
    return buildCatalogPage([], MISSING_KEY_MESSAGE);
  }

  const [popular, airingToday, onTheAir, trendingWeek] = await Promise.all([
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.popularTv(),
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
        endpoint: tmdbEndpoints.onTheAirTv(),
        schema: tmdbPaginatedListSchema,
      }),
    ),
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.trendingWeek(),
        schema: tmdbPaginatedListSchema,
      }),
    ),
  ]);

  const rails = [
    toRail(
      "tv-trending-week",
      "Trending TV This Week",
      trendingWeek.data
        ? mapPaginatedListToMedia(trendingWeek.data).filter((item) => item.mediaType === "tv")
        : [],
    ),
    toRail("tv-popular", "Popular TV", popular.data ? mapPaginatedListToMedia(popular.data, "tv") : []),
    toRail(
      "tv-airing-today",
      "Airing Today",
      airingToday.data ? mapPaginatedListToMedia(airingToday.data, "tv") : [],
    ),
    toRail("tv-on-the-air", "On The Air", onTheAir.data ? mapPaginatedListToMedia(onTheAir.data, "tv") : []),
  ];

  const firstError = [popular, airingToday, onTheAir, trendingWeek].find(
    (result) => result.errorMessage,
  )?.errorMessage;

  return buildCatalogPage(rails, firstError ?? undefined);
};

export const getNewPopularPageData = async (): Promise<CatalogPageData> => {
  if (!hasTmdbApiKey()) {
    return buildCatalogPage([], MISSING_KEY_MESSAGE);
  }

  const [upcomingMovies, nowPlayingMovies, onTheAirTv, trendingToday] = await Promise.all([
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
        endpoint: tmdbEndpoints.onTheAirTv(),
        schema: tmdbPaginatedListSchema,
      }),
    ),
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.trendingToday(),
        schema: tmdbPaginatedListSchema,
      }),
    ),
  ]);

  const rails = [
    toRail(
      "new-upcoming-movies",
      "Coming Soon (Movies)",
      upcomingMovies.data ? mapPaginatedListToMedia(upcomingMovies.data, "movie") : [],
    ),
    toRail(
      "new-now-playing",
      "Now Streaming",
      nowPlayingMovies.data ? mapPaginatedListToMedia(nowPlayingMovies.data, "movie") : [],
    ),
    toRail(
      "new-on-the-air",
      "New Episodes",
      onTheAirTv.data ? mapPaginatedListToMedia(onTheAirTv.data, "tv") : [],
    ),
    toRail(
      "new-trending",
      "Trending Right Now",
      trendingToday.data ? mapPaginatedListToMedia(trendingToday.data) : [],
    ),
  ];

  const firstError = [upcomingMovies, nowPlayingMovies, onTheAirTv, trendingToday].find(
    (result) => result.errorMessage,
  )?.errorMessage;

  return buildCatalogPage(rails, firstError ?? undefined);
};

export const getGenreCollections = async (): Promise<GenreCollections> => {
  if (!hasTmdbApiKey()) {
    return { movie: [], tv: [] };
  }

  const [movieGenres, tvGenres] = await Promise.all([
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.movieGenres(),
        schema: tmdbGenreListSchema,
      }),
    ),
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.tvGenres(),
        schema: tmdbGenreListSchema,
      }),
    ),
  ]);

  return {
    movie: movieGenres.data?.genres ?? [],
    tv: tvGenres.data?.genres ?? [],
  };
};

export const searchMedia = async (query: string, page = 1): Promise<MediaItem[]> => {
  const normalizedQuery = query.trim();
  if (!hasTmdbApiKey() || normalizedQuery.length === 0) {
    return [];
  }

  const results = await safeRequest(
    tmdbRequest({
      endpoint: tmdbEndpoints.multiSearch(normalizedQuery, page),
      schema: tmdbPaginatedListSchema,
    }),
  );

  return results.data ? mapPaginatedListToMedia(results.data) : [];
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
