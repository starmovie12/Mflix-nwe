import type {
  TMDBMovie,
  TMDBTVShow,
  TMDBMultiResult,
  TMDBMovieDetails,
  TMDBTVDetails,
  TMDBCastMember,
  TMDBCrewMember,
  TMDBVideo,
  TMDBImage,
  TMDBSeason,
} from "@/types/tmdb";
import type {
  MediaItem,
  MediaDetails,
  CastMember,
  CrewMember,
  Video,
  ImageAsset,
  Season,
  MediaType,
} from "@/types/app";

export function mapMovie(movie: TMDBMovie): MediaItem {
  return {
    id: movie.id,
    mediaType: "movie",
    title: movie.title,
    overview: movie.overview,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date || "",
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    popularity: movie.popularity,
    genreIds: movie.genre_ids,
    originalLanguage: movie.original_language,
  };
}

export function mapTVShow(show: TMDBTVShow): MediaItem {
  return {
    id: show.id,
    mediaType: "tv",
    title: show.name,
    overview: show.overview,
    posterPath: show.poster_path,
    backdropPath: show.backdrop_path,
    releaseDate: show.first_air_date || "",
    voteAverage: show.vote_average,
    voteCount: show.vote_count,
    popularity: show.popularity,
    genreIds: show.genre_ids,
    originalLanguage: show.original_language,
  };
}

export function mapMultiResult(item: TMDBMultiResult): MediaItem | null {
  if ("title" in item) return mapMovie(item as TMDBMovie);
  if ("name" in item && "first_air_date" in item) return mapTVShow(item as TMDBTVShow);
  return null;
}

export function mapCast(cast: TMDBCastMember): CastMember {
  return {
    id: cast.id,
    name: cast.name,
    character: cast.character,
    profilePath: cast.profile_path,
    order: cast.order,
  };
}

export function mapCrew(crew: TMDBCrewMember): CrewMember {
  return {
    id: crew.id,
    name: crew.name,
    job: crew.job,
    department: crew.department,
    profilePath: crew.profile_path,
  };
}

export function mapVideo(video: TMDBVideo): Video {
  return {
    id: video.id,
    key: video.key,
    name: video.name,
    site: video.site,
    type: video.type,
    official: video.official,
  };
}

export function mapImage(image: TMDBImage): ImageAsset {
  return {
    filePath: image.file_path,
    width: image.width,
    height: image.height,
    aspectRatio: image.aspect_ratio,
  };
}

export function mapSeason(season: TMDBSeason): Season {
  return {
    id: season.id,
    name: season.name,
    overview: season.overview,
    posterPath: season.poster_path,
    seasonNumber: season.season_number,
    episodeCount: season.episode_count,
    airDate: season.air_date,
  };
}

export function mapMovieDetails(movie: TMDBMovieDetails): MediaDetails {
  return {
    id: movie.id,
    mediaType: "movie",
    title: movie.title,
    overview: movie.overview,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date || "",
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    popularity: movie.popularity,
    genreIds: movie.genres.map((g) => g.id),
    originalLanguage: movie.original_language,
    tagline: movie.tagline,
    runtime: movie.runtime,
    status: movie.status,
    genres: movie.genres,
    cast: movie.credits?.cast.slice(0, 20).map(mapCast) ?? [],
    crew: movie.credits?.crew.filter(
      (c) => ["Director", "Writer", "Screenplay", "Producer"].includes(c.job)
    ).map(mapCrew) ?? [],
    videos: movie.videos?.results
      .filter((v) => v.site === "YouTube")
      .map(mapVideo) ?? [],
    images: movie.images?.backdrops.slice(0, 10).map(mapImage) ?? [],
    similar: movie.similar?.results.slice(0, 12).map(mapMovie) ?? [],
    recommendations: movie.recommendations?.results.slice(0, 12).map(mapMovie) ?? [],
    spokenLanguages: movie.spoken_languages?.map((l) => l.english_name) ?? [],
  };
}

export function mapTVDetails(show: TMDBTVDetails): MediaDetails {
  return {
    id: show.id,
    mediaType: "tv",
    title: show.name,
    overview: show.overview,
    posterPath: show.poster_path,
    backdropPath: show.backdrop_path,
    releaseDate: show.first_air_date || "",
    voteAverage: show.vote_average,
    voteCount: show.vote_count,
    popularity: show.popularity,
    genreIds: show.genres.map((g) => g.id),
    originalLanguage: show.original_language,
    tagline: show.tagline,
    runtime: show.episode_run_time?.[0] ?? null,
    status: show.status,
    genres: show.genres,
    cast: show.credits?.cast.slice(0, 20).map(mapCast) ?? [],
    crew: show.credits?.crew
      .filter((c) => ["Director", "Writer", "Creator", "Executive Producer"].includes(c.job))
      .map(mapCrew) ?? [],
    videos: show.videos?.results
      .filter((v) => v.site === "YouTube")
      .map(mapVideo) ?? [],
    images: show.images?.backdrops.slice(0, 10).map(mapImage) ?? [],
    similar: show.similar?.results.slice(0, 12).map(mapTVShow) ?? [],
    recommendations: show.recommendations?.results.slice(0, 12).map(mapTVShow) ?? [],
    spokenLanguages: show.spoken_languages?.map((l) => l.english_name) ?? [],
    numberOfSeasons: show.number_of_seasons,
    numberOfEpisodes: show.number_of_episodes,
    seasons: show.seasons?.filter((s) => s.season_number > 0).map(mapSeason),
    createdBy: show.created_by?.map((c) => c.name),
  };
}

export function getTrailerKey(videos: Video[]): string | null {
  const trailer = videos.find(
    (v) => v.type === "Trailer" && v.official && v.site === "YouTube"
  ) ?? videos.find((v) => v.type === "Trailer" && v.site === "YouTube")
    ?? videos.find((v) => v.site === "YouTube");
  return trailer?.key ?? null;
}

export function formatRuntime(minutes: number | null): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatVoteAverage(vote: number): string {
  return `${Math.round(vote * 10)}%`;
}

export function getYear(dateStr: string): string {
  if (!dateStr) return "";
  return dateStr.split("-")[0];
}

export function getMediaType(item: TMDBMultiResult): MediaType | null {
  if ("title" in item) return "movie";
  if ("name" in item && "first_air_date" in item) return "tv";
  return null;
}
