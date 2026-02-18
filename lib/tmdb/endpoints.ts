/**
 * TMDB API endpoint builders
 */

const BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(`${BASE_URL.replace(/\/$/, '')}/${normalizedPath}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

export const endpoints = {
  trending: (timeWindow: 'day' | 'week') =>
    buildUrl(`/trending/all/${timeWindow}`),

  popularMovies: (page = 1) =>
    buildUrl('/movie/popular', { page }),

  popularTv: (page = 1) =>
    buildUrl('/tv/popular', { page }),

  topRatedMovies: (page = 1) =>
    buildUrl('/movie/top_rated', { page }),

  topRatedTv: (page = 1) =>
    buildUrl('/tv/top_rated', { page }),

  upcomingMovies: (page = 1) =>
    buildUrl('/movie/upcoming', { page }),

  nowPlayingMovies: (page = 1) =>
    buildUrl('/movie/now_playing', { page }),

  airingTodayTv: (page = 1) =>
    buildUrl('/tv/airing_today', { page }),

  onTheAirTv: (page = 1) =>
    buildUrl('/tv/on_the_air', { page }),

  movieGenres: () =>
    buildUrl('/genre/movie/list'),

  tvGenres: () =>
    buildUrl('/genre/tv/list'),

  discoverMovies: (params: Record<string, string | number> = {}) =>
    buildUrl('/discover/movie', { page: 1, ...params }),

  discoverTv: (params: Record<string, string | number> = {}) =>
    buildUrl('/discover/tv', { page: 1, ...params }),

  movieDetails: (id: number) =>
    buildUrl(`/movie/${id}`, {
      append_to_response: 'videos,images,credits,similar,recommendations',
    }),

  tvDetails: (id: number) =>
    buildUrl(`/tv/${id}`, {
      append_to_response: 'videos,images,credits,similar,recommendations',
    }),

  searchMulti: (query: string, page = 1) =>
    buildUrl('/search/multi', { query, page }),
};
