import { tmdbFetch } from "./client";
import type {
  TMDBMovie,
  TMDBTVShow,
  TMDBMultiResult,
  TMDBMovieDetails,
  TMDBTVDetails,
  TMDBPaginatedResponse,
  TMDBGenreListResponse,
  TMDBSeasonDetails,
} from "@/types/tmdb";

const APPEND_MOVIE = "videos,images,credits,similar,recommendations";
const APPEND_TV = "videos,images,credits,similar,recommendations";

export async function getTrending(
  mediaType: "all" | "movie" | "tv" = "all",
  timeWindow: "day" | "week" = "day"
) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMultiResult>>(
    `/trending/${mediaType}/${timeWindow}`,
    { revalidate: 1800 }
  );
}

export async function getPopularMovies(page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>("/movie/popular", {
    params: { page },
    revalidate: 3600,
  });
}

export async function getPopularTV(page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBTVShow>>("/tv/popular", {
    params: { page },
    revalidate: 3600,
  });
}

export async function getTopRatedMovies(page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>("/movie/top_rated", {
    params: { page },
    revalidate: 3600,
  });
}

export async function getTopRatedTV(page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBTVShow>>("/tv/top_rated", {
    params: { page },
    revalidate: 3600,
  });
}

export async function getUpcomingMovies(page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>("/movie/upcoming", {
    params: { page },
    revalidate: 3600,
  });
}

export async function getNowPlayingMovies(page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>("/movie/now_playing", {
    params: { page },
    revalidate: 3600,
  });
}

export async function getAiringTodayTV(page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBTVShow>>("/tv/airing_today", {
    params: { page },
    revalidate: 3600,
  });
}

export async function getOnTheAirTV(page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBTVShow>>("/tv/on_the_air", {
    params: { page },
    revalidate: 3600,
  });
}

export async function getMovieDetails(id: number) {
  return tmdbFetch<TMDBMovieDetails>(`/movie/${id}`, {
    params: { append_to_response: APPEND_MOVIE },
    revalidate: 7200,
  });
}

export async function getTVDetails(id: number) {
  return tmdbFetch<TMDBTVDetails>(`/tv/${id}`, {
    params: { append_to_response: APPEND_TV },
    revalidate: 7200,
  });
}

export async function getTVSeasonDetails(tvId: number, seasonNumber: number) {
  return tmdbFetch<TMDBSeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`, {
    revalidate: 7200,
  });
}

export async function getMovieGenres() {
  return tmdbFetch<TMDBGenreListResponse>("/genre/movie/list", {
    revalidate: 86400,
  });
}

export async function getTVGenres() {
  return tmdbFetch<TMDBGenreListResponse>("/genre/tv/list", {
    revalidate: 86400,
  });
}

export async function multiSearch(query: string, page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMultiResult>>("/search/multi", {
    params: { query, page, include_adult: "false" },
    revalidate: 600,
  });
}

export async function searchMovies(query: string, page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>("/search/movie", {
    params: { query, page, include_adult: "false" },
    revalidate: 600,
  });
}

export async function searchTV(query: string, page = 1) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBTVShow>>("/search/tv", {
    params: { query, page, include_adult: "false" },
    revalidate: 600,
  });
}

export async function discoverMovies(params: Record<string, string | number> = {}) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovie>>("/discover/movie", {
    params: { ...params, include_adult: "false" },
    revalidate: 3600,
  });
}

export async function discoverTV(params: Record<string, string | number> = {}) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBTVShow>>("/discover/tv", {
    params: { ...params, include_adult: "false" },
    revalidate: 3600,
  });
}
