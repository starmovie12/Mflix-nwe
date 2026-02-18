export interface TmdbEndpoint {
  path: string;
  params?: Record<string, string | number | boolean | undefined>;
  revalidate?: number;
}

const DEFAULT_LANGUAGE = "en-US";
const DETAIL_APPEND = "videos,images,credits,similar,recommendations";
const TV_DETAIL_APPEND = "videos,images,credits,similar,recommendations";

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
  popularMovies: (page = 1): TmdbEndpoint => ({
    path: "/movie/popular",
    params: { language: DEFAULT_LANGUAGE, page },
    revalidate: 60 * 30,
  }),
  popularTv: (page = 1): TmdbEndpoint => ({
    path: "/tv/popular",
    params: { language: DEFAULT_LANGUAGE, page },
    revalidate: 60 * 30,
  }),
  topRated: (page = 1): TmdbEndpoint => ({
    path: "/movie/top_rated",
    params: { language: DEFAULT_LANGUAGE, page },
    revalidate: 60 * 60,
  }),
  topRatedTv: (page = 1): TmdbEndpoint => ({
    path: "/tv/top_rated",
    params: { language: DEFAULT_LANGUAGE, page },
    revalidate: 60 * 60,
  }),
  upcomingMovies: (page = 1): TmdbEndpoint => ({
    path: "/movie/upcoming",
    params: { language: DEFAULT_LANGUAGE, region: "US", page },
    revalidate: 60 * 60,
  }),
  nowPlayingMovies: (page = 1): TmdbEndpoint => ({
    path: "/movie/now_playing",
    params: { language: DEFAULT_LANGUAGE, region: "US", page },
    revalidate: 60 * 30,
  }),
  airingTodayTv: (): TmdbEndpoint => ({
    path: "/tv/airing_today",
    params: { language: DEFAULT_LANGUAGE },
    revalidate: 60 * 30,
  }),
  onTheAirTv: (): TmdbEndpoint => ({
    path: "/tv/on_the_air",
    params: { language: DEFAULT_LANGUAGE },
    revalidate: 60 * 30,
  }),
  movieGenres: (): TmdbEndpoint => ({
    path: "/genre/movie/list",
    params: { language: DEFAULT_LANGUAGE },
    revalidate: 60 * 60 * 24,
  }),
  tvGenres: (): TmdbEndpoint => ({
    path: "/genre/tv/list",
    params: { language: DEFAULT_LANGUAGE },
    revalidate: 60 * 60 * 24,
  }),
  discoverByGenre: (genreId: number, mediaType: "movie" | "tv" = "movie"): TmdbEndpoint => ({
    path: `/discover/${mediaType}`,
    params: {
      language: DEFAULT_LANGUAGE,
      sort_by: "popularity.desc",
      with_genres: genreId,
    },
    revalidate: 60 * 30,
  }),
  multiSearch: (query: string, page = 1): TmdbEndpoint => ({
    path: "/search/multi",
    params: { language: DEFAULT_LANGUAGE, query, page },
    revalidate: 60 * 5,
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
      append_to_response: TV_DETAIL_APPEND,
    },
    revalidate: 60 * 10,
  }),
} as const;
