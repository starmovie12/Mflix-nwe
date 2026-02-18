export interface TmdbEndpoint {
  path: string;
  params?: Record<string, string | number | boolean | undefined>;
  revalidate?: number;
}

const DEFAULT_LANGUAGE = "en-US";
const DETAIL_APPEND = "videos,images,credits,similar,recommendations";

export const tmdbEndpoints = {
  trendingToday: (): TmdbEndpoint => ({
    path: "/trending/all/day",
    params: { language: DEFAULT_LANGUAGE },
    revalidate: 60 * 15,
  }),
  trendingWeek: (): TmdbEndpoint => ({
    path: "/trending/all/week",
    params: { language: DEFAULT_LANGUAGE },
    revalidate: 60 * 30,
  }),
  popularMovies: (): TmdbEndpoint => ({
    path: "/movie/popular",
    params: { language: DEFAULT_LANGUAGE },
    revalidate: 60 * 30,
  }),
  popularTv: (): TmdbEndpoint => ({
    path: "/tv/popular",
    params: { language: DEFAULT_LANGUAGE },
    revalidate: 60 * 30,
  }),
  topRated: (): TmdbEndpoint => ({
    path: "/movie/top_rated",
    params: { language: DEFAULT_LANGUAGE },
    revalidate: 60 * 60,
  }),
  upcomingMovies: (): TmdbEndpoint => ({
    path: "/movie/upcoming",
    params: { language: DEFAULT_LANGUAGE, region: "US" },
    revalidate: 60 * 60,
  }),
  nowPlayingMovies: (): TmdbEndpoint => ({
    path: "/movie/now_playing",
    params: { language: DEFAULT_LANGUAGE, region: "US" },
    revalidate: 60 * 30,
  }),
  movieDetails: (id: number): TmdbEndpoint => ({
    path: `/movie/${id}`,
    params: {
      language: DEFAULT_LANGUAGE,
      append_to_response: DETAIL_APPEND,
    },
    revalidate: 60 * 10,
  }),
  tvDetails: (id: number): TmdbEndpoint => ({
    path: `/tv/${id}`,
    params: {
      language: DEFAULT_LANGUAGE,
      append_to_response: DETAIL_APPEND,
    },
    revalidate: 60 * 10,
  }),
} as const;
