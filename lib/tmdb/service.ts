import type {
  MediaDetail,
  MediaItem,
  MediaRail,
  MediaType,
} from "@/types/media";
import type { SearchCatalogResponse, SearchTab } from "@/types/search";
import { hasTmdbApiKey } from "@/lib/env";

import { TmdbClientError, tmdbRequest } from "./client";
import type { TmdbEndpoint } from "./endpoints";
import { tmdbEndpoints } from "./endpoints";
import {
  mapMovieDetail,
  mapPaginatedListToMedia,
  mapPersonSearchToPeople,
  mapTvDetail,
} from "./mappers";
import {
  tmdbGenreListSchema,
  tmdbMovieDetailSchema,
  tmdbPaginatedListSchema,
  tmdbPersonSearchSchema,
  tmdbTvDetailSchema,
} from "./types";

export interface HomePageData {
  featured: MediaItem | null;
  rails: MediaRail[];
  hasData: boolean;
  errorMessage: string | null;
}

export interface BrowsePageData {
  rails: MediaRail[];
  hasData: boolean;
  errorMessage: string | null;
}

export type { SearchTab };

const MISSING_KEY_MESSAGE =
  "TMDB_API_KEY is not configured. Add it in .env.local for local development, or in your deployment platform environment variables (Vercel/Netlify).";
const FALLBACK_TMBD_ERROR =
  "TMDB data is currently unavailable right now. Please try again in a few moments.";

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

  return FALLBACK_TMBD_ERROR;
};

interface SafeRequestResult<T> {
  data: T | null;
  errorMessage: string | null;
}

interface RailRequestResult {
  rail: MediaRail;
  errorMessage: string | null;
}

interface RailRequestOptions {
  fallbackType?: MediaType;
  filterMediaType?: MediaType;
  limit?: number;
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

const getFirstError = (errors: Array<string | null>) => errors.find((error) => error) ?? null;

const requestMediaRail = async (
  id: string,
  title: string,
  endpoint: TmdbEndpoint,
  options: RailRequestOptions = {},
): Promise<RailRequestResult> => {
  const response = await safeRequest(
    tmdbRequest({
      endpoint,
      schema: tmdbPaginatedListSchema,
    }),
  );

  let items = response.data
    ? mapPaginatedListToMedia(response.data, options.fallbackType)
    : [];

  if (options.filterMediaType) {
    items = items.filter((item) => item.mediaType === options.filterMediaType);
  }

  if (options.limit && options.limit > 0) {
    items = items.slice(0, options.limit);
  }

  return {
    rail: {
      id,
      title,
      items,
    },
    errorMessage: response.errorMessage,
  };
};

const requestGenreRails = async (
  mediaType: MediaType,
  limit = 2,
): Promise<{ rails: MediaRail[]; errorMessage: string | null }> => {
  const genreListResponse = await safeRequest(
    tmdbRequest({
      endpoint: mediaType === "movie" ? tmdbEndpoints.movieGenres() : tmdbEndpoints.tvGenres(),
      schema: tmdbGenreListSchema,
    }),
  );

  if (!genreListResponse.data) {
    return {
      rails: [],
      errorMessage: genreListResponse.errorMessage,
    };
  }

  const selectedGenres = genreListResponse.data.genres.slice(0, limit);

  const genreRails = await Promise.all(
    selectedGenres.map((genre) =>
      requestMediaRail(
        `${mediaType}-genre-${genre.id}`,
        `${genre.name} Picks`,
        mediaType === "movie"
          ? tmdbEndpoints.discoverMovieByGenre(genre.id)
          : tmdbEndpoints.discoverTvByGenre(genre.id),
        {
          fallbackType: mediaType,
        },
      ),
    ),
  );

  return {
    rails: genreRails.map((result) => result.rail).filter((rail) => rail.items.length > 0),
    errorMessage: getFirstError(genreRails.map((result) => result.errorMessage)),
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

  const [trendingToday, trendingWeek, popularMovies, popularTv, topRated, nowPlaying, upcoming] =
    await Promise.all([
      requestMediaRail("trending-today", "Trending Today", tmdbEndpoints.trendingToday(), {
        limit: 24,
      }),
      requestMediaRail("trending-week", "Trending This Week", tmdbEndpoints.trendingWeek(), {
        limit: 24,
      }),
      requestMediaRail("popular-movies", "Popular Movies", tmdbEndpoints.popularMovies(), {
        fallbackType: "movie",
        limit: 24,
      }),
      requestMediaRail("popular-tv", "Popular TV", tmdbEndpoints.popularTv(), {
        fallbackType: "tv",
        limit: 24,
      }),
      requestMediaRail("top-rated", "Top Rated", tmdbEndpoints.topRated(), {
        fallbackType: "movie",
        limit: 24,
      }),
      requestMediaRail("now-playing", "Now Playing", tmdbEndpoints.nowPlayingMovies(), {
        fallbackType: "movie",
        limit: 24,
      }),
      requestMediaRail("upcoming", "Upcoming Releases", tmdbEndpoints.upcomingMovies(), {
        fallbackType: "movie",
        limit: 24,
      }),
    ]);

  const rails = [
    trendingToday.rail,
    trendingWeek.rail,
    popularMovies.rail,
    popularTv.rail,
    topRated.rail,
    nowPlaying.rail,
    upcoming.rail,
  ].filter((rail) => rail.items.length > 0);

  const featured = rails.find((rail) => rail.items.length > 0)?.items[0] ?? null;
  const hasData = rails.length > 0;

  return {
    featured,
    rails,
    hasData,
    errorMessage: hasData
      ? null
      : getFirstError([
          trendingToday.errorMessage,
          trendingWeek.errorMessage,
          popularMovies.errorMessage,
          popularTv.errorMessage,
          topRated.errorMessage,
          nowPlaying.errorMessage,
          upcoming.errorMessage,
        ]) ?? FALLBACK_TMBD_ERROR,
  };
};

export const getMoviesPageData = async (): Promise<BrowsePageData> => {
  if (!hasTmdbApiKey()) {
    return {
      rails: [],
      hasData: false,
      errorMessage: MISSING_KEY_MESSAGE,
    };
  }

  const [popular, topRated, nowPlaying, upcoming, trending, genreRails] = await Promise.all([
    requestMediaRail("movies-popular", "Popular Movies", tmdbEndpoints.popularMovies(), {
      fallbackType: "movie",
      limit: 30,
    }),
    requestMediaRail("movies-top-rated", "Top Rated Movies", tmdbEndpoints.topRated(), {
      fallbackType: "movie",
      limit: 30,
    }),
    requestMediaRail("movies-now-playing", "Now Playing", tmdbEndpoints.nowPlayingMovies(), {
      fallbackType: "movie",
      limit: 30,
    }),
    requestMediaRail("movies-upcoming", "Upcoming Movies", tmdbEndpoints.upcomingMovies(), {
      fallbackType: "movie",
      limit: 30,
    }),
    requestMediaRail("movies-trending", "Trending Movies", tmdbEndpoints.trendingWeek(), {
      filterMediaType: "movie",
      limit: 30,
    }),
    requestGenreRails("movie", 3),
  ]);

  const rails = [
    popular.rail,
    topRated.rail,
    nowPlaying.rail,
    upcoming.rail,
    trending.rail,
    ...genreRails.rails,
  ].filter((rail) => rail.items.length > 0);

  return {
    rails,
    hasData: rails.length > 0,
    errorMessage:
      rails.length > 0
        ? null
        : getFirstError([
            popular.errorMessage,
            topRated.errorMessage,
            nowPlaying.errorMessage,
            upcoming.errorMessage,
            trending.errorMessage,
            genreRails.errorMessage,
          ]) ?? FALLBACK_TMBD_ERROR,
  };
};

export const getTvPageData = async (): Promise<BrowsePageData> => {
  if (!hasTmdbApiKey()) {
    return {
      rails: [],
      hasData: false,
      errorMessage: MISSING_KEY_MESSAGE,
    };
  }

  const [popular, onTheAir, airingToday, trending, genreRails] = await Promise.all([
    requestMediaRail("tv-popular", "Popular TV", tmdbEndpoints.popularTv(), {
      fallbackType: "tv",
      limit: 30,
    }),
    requestMediaRail("tv-on-air", "On The Air", tmdbEndpoints.onTheAirTv(), {
      fallbackType: "tv",
      limit: 30,
    }),
    requestMediaRail("tv-airing-today", "Airing Today", tmdbEndpoints.airingTodayTv(), {
      fallbackType: "tv",
      limit: 30,
    }),
    requestMediaRail("tv-trending", "Trending TV", tmdbEndpoints.trendingWeek(), {
      filterMediaType: "tv",
      limit: 30,
    }),
    requestGenreRails("tv", 3),
  ]);

  const rails = [
    popular.rail,
    onTheAir.rail,
    airingToday.rail,
    trending.rail,
    ...genreRails.rails,
  ].filter((rail) => rail.items.length > 0);

  return {
    rails,
    hasData: rails.length > 0,
    errorMessage:
      rails.length > 0
        ? null
        : getFirstError([
            popular.errorMessage,
            onTheAir.errorMessage,
            airingToday.errorMessage,
            trending.errorMessage,
            genreRails.errorMessage,
          ]) ?? FALLBACK_TMBD_ERROR,
  };
};

export const getNewPopularPageData = async (): Promise<BrowsePageData> => {
  if (!hasTmdbApiKey()) {
    return {
      rails: [],
      hasData: false,
      errorMessage: MISSING_KEY_MESSAGE,
    };
  }

  const [trendingWeek, upcomingMovies, onTheAir, nowPlaying] = await Promise.all([
    requestMediaRail("new-trending", "Trending This Week", tmdbEndpoints.trendingWeek(), {
      limit: 30,
    }),
    requestMediaRail("new-upcoming-movies", "Upcoming Movies", tmdbEndpoints.upcomingMovies(), {
      fallbackType: "movie",
      limit: 30,
    }),
    requestMediaRail("new-on-the-air", "TV On The Air", tmdbEndpoints.onTheAirTv(), {
      fallbackType: "tv",
      limit: 30,
    }),
    requestMediaRail("new-now-playing", "Now Playing", tmdbEndpoints.nowPlayingMovies(), {
      fallbackType: "movie",
      limit: 30,
    }),
  ]);

  const rails = [trendingWeek.rail, upcomingMovies.rail, onTheAir.rail, nowPlaying.rail].filter(
    (rail) => rail.items.length > 0,
  );

  return {
    rails,
    hasData: rails.length > 0,
    errorMessage:
      rails.length > 0
        ? null
        : getFirstError([
            trendingWeek.errorMessage,
            upcomingMovies.errorMessage,
            onTheAir.errorMessage,
            nowPlaying.errorMessage,
          ]) ?? FALLBACK_TMBD_ERROR,
  };
};

export const searchCatalog = async (
  query: string,
  tab: SearchTab = "all",
): Promise<SearchCatalogResponse> => {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 2) {
    return {
      media: [],
      people: [],
      hasData: false,
      errorMessage: null,
    };
  }

  if (!hasTmdbApiKey()) {
    return {
      media: [],
      people: [],
      hasData: false,
      errorMessage: MISSING_KEY_MESSAGE,
    };
  }

  if (tab === "movie") {
    const movieSearch = await safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.searchMovie(normalizedQuery),
        schema: tmdbPaginatedListSchema,
      }),
    );

    const media = movieSearch.data ? mapPaginatedListToMedia(movieSearch.data, "movie") : [];
    return {
      media,
      people: [],
      hasData: media.length > 0,
      errorMessage: media.length > 0 ? null : movieSearch.errorMessage ?? FALLBACK_TMBD_ERROR,
    };
  }

  if (tab === "tv") {
    const tvSearch = await safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.searchTv(normalizedQuery),
        schema: tmdbPaginatedListSchema,
      }),
    );

    const media = tvSearch.data ? mapPaginatedListToMedia(tvSearch.data, "tv") : [];
    return {
      media,
      people: [],
      hasData: media.length > 0,
      errorMessage: media.length > 0 ? null : tvSearch.errorMessage ?? FALLBACK_TMBD_ERROR,
    };
  }

  if (tab === "person") {
    const personSearch = await safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.searchPerson(normalizedQuery),
        schema: tmdbPersonSearchSchema,
      }),
    );

    const people = personSearch.data ? mapPersonSearchToPeople(personSearch.data) : [];
    return {
      media: [],
      people,
      hasData: people.length > 0,
      errorMessage: people.length > 0 ? null : personSearch.errorMessage ?? FALLBACK_TMBD_ERROR,
    };
  }

  const [mixedMediaSearch, personSearch] = await Promise.all([
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.multiSearch(normalizedQuery),
        schema: tmdbPaginatedListSchema,
      }),
    ),
    safeRequest(
      tmdbRequest({
        endpoint: tmdbEndpoints.searchPerson(normalizedQuery),
        schema: tmdbPersonSearchSchema,
      }),
    ),
  ]);

  const media = mixedMediaSearch.data ? mapPaginatedListToMedia(mixedMediaSearch.data) : [];
  const people = personSearch.data ? mapPersonSearchToPeople(personSearch.data) : [];
  const hasData = media.length > 0 || people.length > 0;

  return {
    media,
    people,
    hasData,
    errorMessage: hasData
      ? null
      : getFirstError([mixedMediaSearch.errorMessage, personSearch.errorMessage]) ??
        FALLBACK_TMBD_ERROR,
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
