export interface TmdbEndpoint {
  path: string;
  params?: Record<string, string | number | boolean | undefined>;
  revalidate?: number;
}

const DEFAULT_LANGUAGE = "en-US";
const DETAIL_APPEND = "videos,images,credits,similar,recommendations";
const TV_DETAIL_APPEND = "videos,images,credits,similar,recommendations,seasons";

const withLanguage = (
  params: Record<string, string | number | boolean | undefined> = {},
): Record<string, string | number | boolean | undefined> => ({
  language: DEFAULT_LANGUAGE,
  ...params,
});

export const tmdbEndpoints = {
  trendingToday: (): TmdbEndpoint => ({
    path: "/trending/all/day",
    params: withLanguage(),
    revalidate: 60 * 15,
  }),
  trendingWeek: (): TmdbEndpoint => ({
    path: "/trending/all/week",
    params: withLanguage(),
    revalidate: 60 * 30,
  }),
  popularMovies: (): TmdbEndpoint => ({
    path: "/movie/popular",
    params: withLanguage(),
    revalidate: 60 * 30,
  }),
  popularTv: (): TmdbEndpoint => ({
    path: "/tv/popular",
    params: withLanguage(),
    revalidate: 60 * 30,
  }),
  topRated: (): TmdbEndpoint => ({
    path: "/movie/top_rated",
    params: withLanguage(),
    revalidate: 60 * 60,
  }),
  upcomingMovies: (): TmdbEndpoint => ({
    path: "/movie/upcoming",
    params: withLanguage({ region: "US" }),
    revalidate: 60 * 60,
  }),
  nowPlayingMovies: (): TmdbEndpoint => ({
    path: "/movie/now_playing",
    params: withLanguage({ region: "US" }),
    revalidate: 60 * 30,
  }),
  airingTodayTv: (): TmdbEndpoint => ({
    path: "/tv/airing_today",
    params: withLanguage(),
    revalidate: 60 * 30,
  }),
  onTheAirTv: (): TmdbEndpoint => ({
    path: "/tv/on_the_air",
    params: withLanguage(),
    revalidate: 60 * 30,
  }),
  movieGenres: (): TmdbEndpoint => ({
    path: "/genre/movie/list",
    params: withLanguage(),
    revalidate: 60 * 60 * 24,
  }),
  tvGenres: (): TmdbEndpoint => ({
    path: "/genre/tv/list",
    params: withLanguage(),
    revalidate: 60 * 60 * 24,
  }),
  multiSearch: (query: string, page = 1): TmdbEndpoint => ({
    path: "/search/multi",
    params: withLanguage({
      query,
      page,
      include_adult: false,
    }),
    revalidate: 60 * 5,
  }),
  movieDetails: (id: number): TmdbEndpoint => ({
    path: `/movie/${id}`,
    params: withLanguage({
      append_to_response: DETAIL_APPEND,
    }),
    revalidate: 60 * 10,
  }),
  tvDetails: (id: number): TmdbEndpoint => ({
    path: `/tv/${id}`,
    params: withLanguage({
      append_to_response: TV_DETAIL_APPEND,
    }),
    revalidate: 60 * 10,
  }),
} as const;
