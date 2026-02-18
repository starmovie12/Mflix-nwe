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
  discoverMovieByGenre: (genreId: number): TmdbEndpoint => ({
    path: "/discover/movie",
    params: {
      with_genres: genreId,
      sort_by: "popularity.desc",
      language: DEFAULT_LANGUAGE,
      include_adult: false,
    },
    revalidate: 60 * 60,
  }),
  discoverTvByGenre: (genreId: number): TmdbEndpoint => ({
    path: "/discover/tv",
    params: {
      with_genres: genreId,
      sort_by: "popularity.desc",
      language: DEFAULT_LANGUAGE,
      include_adult: false,
    },
    revalidate: 60 * 60,
  }),
  multiSearch: (query: string, page = 1): TmdbEndpoint => ({
    path: "/search/multi",
    params: {
      query,
      page,
      include_adult: false,
      language: DEFAULT_LANGUAGE,
    },
    revalidate: 60,
  }),
  searchMovie: (query: string, page = 1): TmdbEndpoint => ({
    path: "/search/movie",
    params: {
      query,
      page,
      include_adult: false,
      language: DEFAULT_LANGUAGE,
    },
    revalidate: 60,
  }),
  searchTv: (query: string, page = 1): TmdbEndpoint => ({
    path: "/search/tv",
    params: {
      query,
      page,
      include_adult: false,
      language: DEFAULT_LANGUAGE,
    },
    revalidate: 60,
  }),
  searchPerson: (query: string, page = 1): TmdbEndpoint => ({
    path: "/search/person",
    params: {
      query,
      page,
      include_adult: false,
      language: DEFAULT_LANGUAGE,
    },
    revalidate: 60,
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
