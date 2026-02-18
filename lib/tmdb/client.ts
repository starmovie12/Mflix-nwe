/**
 * TMDB API client with retry logic and error handling
 */

import { endpoints } from './endpoints';

const API_KEY = process.env.TMDB_API_KEY;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class TMDBError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'TMDBError';
  }
}

async function fetchWithRetry<T>(
  url: string,
  retries = MAX_RETRIES
): Promise<T> {
  if (!API_KEY) {
    throw new TMDBError('TMDB_API_KEY is not configured');
  }

  const urlWithKey = `${url}${url.includes('?') ? '&' : '?'}api_key=${API_KEY}`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(urlWithKey, {
        next: { revalidate: 3600 }, // 1 hour cache
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new TMDBError(
          `TMDB API error: ${response.status} ${response.statusText} - ${text.slice(0, 200)}`,
          response.status,
          url
        );
      }

      const data = (await response.json()) as T;
      return data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (error instanceof TMDBError) {
        throw error;
      }

      if (attempt < retries) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }

  throw lastError || new TMDBError('Unknown fetch error');
}

export const tmdbClient = {
  get: <T>(url: string): Promise<T> => fetchWithRetry<T>(url),
};

export async function fetchTrendingDay() {
  return tmdbClient.get(endpoints.trending('day'));
}

export async function fetchTrendingWeek() {
  return tmdbClient.get(endpoints.trending('week'));
}

export async function fetchPopularMovies(page = 1) {
  return tmdbClient.get(endpoints.popularMovies(page));
}

export async function fetchPopularTv(page = 1) {
  return tmdbClient.get(endpoints.popularTv(page));
}

export async function fetchTopRatedMovies(page = 1) {
  return tmdbClient.get(endpoints.topRatedMovies(page));
}

export async function fetchTopRatedTv(page = 1) {
  return tmdbClient.get(endpoints.topRatedTv(page));
}

export async function fetchUpcomingMovies(page = 1) {
  return tmdbClient.get(endpoints.upcomingMovies(page));
}

export async function fetchNowPlayingMovies(page = 1) {
  return tmdbClient.get(endpoints.nowPlayingMovies(page));
}

export async function fetchMovieDetails(id: number) {
  return tmdbClient.get(endpoints.movieDetails(id));
}

export async function fetchTvDetails(id: number) {
  return tmdbClient.get(endpoints.tvDetails(id));
}

export async function fetchMovieGenres() {
  return tmdbClient.get(endpoints.movieGenres());
}

export async function fetchTvGenres() {
  return tmdbClient.get(endpoints.tvGenres());
}
