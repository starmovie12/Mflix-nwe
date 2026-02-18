import type {
  CastMember,
  CrewMember,
  MediaDetail,
  MediaImage,
  MediaItem,
  MediaType,
  MediaVideo,
} from "@/types/media";

import type {
  TmdbMovieDetailResponse,
  TmdbPaginatedListResponse,
  TmdbTvDetailResponse,
} from "./types";

const isSupportedMediaType = (value: string | undefined): value is MediaType =>
  value === "movie" || value === "tv";

const toMediaType = (input: string | undefined, fallback?: MediaType): MediaType | null => {
  if (isSupportedMediaType(input)) {
    return input;
  }
  return fallback ?? null;
};

const roundVote = (value: number | undefined) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }
  return Number(value.toFixed(1));
};

export const mapListItemToMedia = (
  item: TmdbPaginatedListResponse["results"][number],
  fallbackType?: MediaType,
): MediaItem | null => {
  const mediaType = toMediaType(item.media_type, fallbackType);
  const title = item.title ?? item.name;

  if (!mediaType || !title) {
    return null;
  }

  return {
    id: item.id,
    mediaType,
    title,
    overview: item.overview ?? "No description available.",
    posterPath: item.poster_path ?? null,
    backdropPath: item.backdrop_path ?? null,
    releaseDate: item.release_date ?? item.first_air_date ?? null,
    voteAverage: roundVote(item.vote_average),
    genreIds: item.genre_ids ?? [],
    originalLanguage: item.original_language,
  };
};

export const mapPaginatedListToMedia = (
  response: TmdbPaginatedListResponse,
  fallbackType?: MediaType,
) =>
  response.results
    .map((item) => mapListItemToMedia(item, fallbackType))
    .filter((item): item is MediaItem => Boolean(item));

const mapVideos = (
  videos: TmdbMovieDetailResponse["videos"] | TmdbTvDetailResponse["videos"] | undefined,
): MediaVideo[] =>
  (videos?.results ?? [])
    .filter((video) => video.site.toLowerCase() === "youtube")
    .map((video) => ({
      id: video.id,
      key: video.key,
      name: video.name,
      site: video.site,
      type: video.type,
      official: video.official ?? false,
    }));

const mapImages = (
  images: TmdbMovieDetailResponse["images"] | TmdbTvDetailResponse["images"] | undefined,
): { backdrops: MediaImage[]; posters: MediaImage[] } => ({
  backdrops: (images?.backdrops ?? []).map((img) => ({
    aspectRatio: img.aspect_ratio,
    filePath: img.file_path,
    width: img.width,
    height: img.height,
  })),
  posters: (images?.posters ?? []).map((img) => ({
    aspectRatio: img.aspect_ratio,
    filePath: img.file_path,
    width: img.width,
    height: img.height,
  })),
});

const mapCast = (
  cast: TmdbMovieDetailResponse["credits"] | TmdbTvDetailResponse["credits"],
): CastMember[] =>
  (cast?.cast ?? []).map((member) => ({
    id: member.id,
    name: member.name,
    character: member.character ?? null,
    profilePath: member.profile_path ?? null,
    order: member.order,
  }));

const mapCrew = (
  crew: TmdbMovieDetailResponse["credits"] | TmdbTvDetailResponse["credits"],
): CrewMember[] =>
  (crew?.crew ?? []).map((member) => ({
    id: member.id,
    name: member.name,
    job: member.job ?? "Unknown",
    department: member.department,
    profilePath: member.profile_path ?? null,
  }));

export const mapMovieDetail = (movie: TmdbMovieDetailResponse): MediaDetail => ({
  id: movie.id,
  mediaType: "movie",
  title: movie.title,
  overview: movie.overview ?? "No description available.",
  posterPath: movie.poster_path ?? null,
  backdropPath: movie.backdrop_path ?? null,
  releaseDate: movie.release_date ?? null,
  voteAverage: roundVote(movie.vote_average),
  genreIds: movie.genres.map((genre) => genre.id),
  originalLanguage: movie.original_language,
  genres: movie.genres,
  runtime: movie.runtime ?? null,
  status: movie.status ?? null,
  tagline: movie.tagline ?? null,
  videos: mapVideos(movie.videos),
  images: mapImages(movie.images),
  cast: mapCast(movie.credits),
  crew: mapCrew(movie.credits),
  similar: movie.similar ? mapPaginatedListToMedia(movie.similar, "movie") : [],
  recommendations: movie.recommendations
    ? mapPaginatedListToMedia(movie.recommendations, "movie")
    : [],
});

export const mapTvDetail = (tv: TmdbTvDetailResponse): MediaDetail => ({
  id: tv.id,
  mediaType: "tv",
  title: tv.name,
  overview: tv.overview ?? "No description available.",
  posterPath: tv.poster_path ?? null,
  backdropPath: tv.backdrop_path ?? null,
  releaseDate: tv.first_air_date ?? null,
  voteAverage: roundVote(tv.vote_average),
  genreIds: tv.genres.map((genre) => genre.id),
  originalLanguage: tv.original_language,
  genres: tv.genres,
  runtime: tv.episode_run_time && tv.episode_run_time.length > 0 ? tv.episode_run_time[0] : null,
  status: tv.status ?? null,
  tagline: tv.tagline ?? null,
  videos: mapVideos(tv.videos),
  images: mapImages(tv.images),
  cast: mapCast(tv.credits),
  crew: mapCrew(tv.credits),
  similar: tv.similar ? mapPaginatedListToMedia(tv.similar, "tv") : [],
  recommendations: tv.recommendations ? mapPaginatedListToMedia(tv.recommendations, "tv") : [],
  numberOfSeasons: tv.number_of_seasons,
  numberOfEpisodes: tv.number_of_episodes,
});
