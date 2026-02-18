import {
  fetchTrendingDay,
  fetchTrendingWeek,
  fetchPopularMovies,
  fetchPopularTv,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchNowPlayingMovies,
} from '@/lib/tmdb/client';
import {
  mapPaginatedTrending,
  mapPaginatedMovies,
  mapPaginatedTv,
} from '@/lib/tmdb/mappers';
import type {
  MediaItem,
  TMDBPaginatedResponse,
  TMDBMovieResult,
  TMDBTvResult,
} from '@/lib/tmdb/types';

export interface HomeData {
  featured: MediaItem | null;
  trendingToday: MediaItem[];
  trendingWeek: MediaItem[];
  popularMovies: MediaItem[];
  popularTv: MediaItem[];
  topRated: MediaItem[];
  upcoming: MediaItem[];
  nowPlaying: MediaItem[];
}

export async function getHomeData(): Promise<HomeData> {
  try {
    const [
      trendingDayRes,
      trendingWeekRes,
      popularMoviesRes,
      popularTvRes,
      topRatedRes,
      upcomingRes,
      nowPlayingRes,
    ] = await Promise.all([
      fetchTrendingDay(),
      fetchTrendingWeek(),
      fetchPopularMovies(1),
      fetchPopularTv(1),
      fetchTopRatedMovies(1),
      fetchUpcomingMovies(1),
      fetchNowPlayingMovies(1),
    ]);

    const trendingDay = mapPaginatedTrending(
      trendingDayRes as TMDBPaginatedResponse<TMDBMovieResult | TMDBTvResult>
    );
    const trendingWeek = mapPaginatedTrending(
      trendingWeekRes as TMDBPaginatedResponse<TMDBMovieResult | TMDBTvResult>
    );
    const popularMovies = mapPaginatedMovies(
      popularMoviesRes as TMDBPaginatedResponse<TMDBMovieResult>
    );
    const popularTv = mapPaginatedTv(
      popularTvRes as TMDBPaginatedResponse<TMDBTvResult>
    );
    const topRated = mapPaginatedMovies(
      topRatedRes as TMDBPaginatedResponse<TMDBMovieResult>
    );
    const upcoming = mapPaginatedMovies(
      upcomingRes as TMDBPaginatedResponse<TMDBMovieResult>
    );
    const nowPlaying = mapPaginatedMovies(
      nowPlayingRes as TMDBPaginatedResponse<TMDBMovieResult>
    );

    const featured =
      trendingDay[0] ||
      popularMovies[0] ||
      popularTv[0] ||
      null;

    return {
      featured,
      trendingToday: trendingDay.slice(0, 10),
      trendingWeek: trendingWeek.slice(0, 10),
      popularMovies: popularMovies.slice(0, 12),
      popularTv: popularTv.slice(0, 12),
      topRated: topRated.slice(0, 12),
      upcoming: upcoming.slice(0, 12),
      nowPlaying: nowPlaying.slice(0, 12),
    };
  } catch (error) {
    console.error('Failed to fetch home data:', error);
    return {
      featured: null,
      trendingToday: [],
      trendingWeek: [],
      popularMovies: [],
      popularTv: [],
      topRated: [],
      upcoming: [],
      nowPlaying: [],
    };
  }
}
