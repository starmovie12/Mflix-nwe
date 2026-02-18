/**
 * TMDB API response types and UI-friendly normalized types
 */

export type MediaType = 'movie' | 'tv' | 'person';

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieResult {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  adult?: boolean;
  video?: boolean;
}

export interface TMDBTvResult {
  id: number;
  name: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  origin_country?: string[];
}

export interface TMDBPersonResult {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
  known_for?: Array<TMDBMovieResult | TMDBTvResult>;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TMDBMovieDetails extends TMDBMovieResult {
  runtime: number | null;
  genres: TMDBGenre[];
  credits?: {
    cast: TMDBCastMember[];
    crew: TMDBCrewMember[];
  };
  videos?: { results: TMDBVideo[] };
  images?: {
    backdrops: TMDBImage[];
    posters: TMDBImage[];
  };
  similar?: TMDBPaginatedResponse<TMDBMovieResult>;
  recommendations?: TMDBPaginatedResponse<TMDBMovieResult>;
}

export interface TMDBTvDetails extends TMDBTvResult {
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time?: number[];
  genres: TMDBGenre[];
  seasons?: TMDBCreditSeason[];
  credits?: {
    cast: TMDBCastMember[];
    crew: TMDBCrewMember[];
  };
  videos?: { results: TMDBVideo[] };
  images?: {
    backdrops: TMDBImage[];
    posters: TMDBImage[];
  };
  similar?: TMDBPaginatedResponse<TMDBTvResult>;
  recommendations?: TMDBPaginatedResponse<TMDBTvResult>;
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDBImage {
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
  height: number;
}

export interface TMDBCreditSeason {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string | null;
}

// UI-friendly normalized types
export interface MediaItem {
  id: number;
  mediaType: MediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  genreIds: number[];
}

export interface MediaDetail extends MediaItem {
  runtime?: number | null;
  genres: { id: number; name: string }[];
  cast: CastMember[];
  crew: CrewMember[];
  videos: VideoItem[];
  backdrops: ImageItem[];
  posters: ImageItem[];
  similar: MediaItem[];
  recommendations: MediaItem[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profilePath: string | null;
}

export interface VideoItem {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface ImageItem {
  filePath: string;
  voteAverage: number;
  width: number;
  height: number;
}

export interface TvDetail extends MediaDetail {
  numberOfSeasons: number;
  numberOfEpisodes: number;
  episodeRunTime?: number[];
  seasons?: TvSeason[];
}

export interface TvSeason {
  id: number;
  name: string;
  seasonNumber: number;
  episodeCount: number;
  posterPath: string | null;
  airDate: string | null;
}
