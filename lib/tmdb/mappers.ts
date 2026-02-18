import type {
  MediaType,
  TmdbListItem,
  TmdbMovieDetails,
  TmdbTvDetails,
  TitleDetails,
  TitlePerson,
  TitleSummary,
  TitleVideo
} from "@/lib/tmdb/types";

export function mapListItemToTitle(item: TmdbListItem, fallbackMediaType: MediaType): TitleSummary {
  const mediaType = (item.media_type === "movie" || item.media_type === "tv"
    ? item.media_type
    : fallbackMediaType) satisfies MediaType;

  const name = mediaType === "movie" ? item.title : item.name;
  const date = mediaType === "movie" ? item.release_date : item.first_air_date;
  const year = date?.slice(0, 4) ?? null;

  return {
    id: item.id,
    mediaType,
    name: name ?? "Untitled",
    overview: item.overview ?? "",
    posterPath: item.poster_path ?? null,
    backdropPath: item.backdrop_path ?? null,
    year,
    rating: typeof item.vote_average === "number" ? item.vote_average : 0
  };
}

export function mapVideos(videos: unknown): TitleVideo[] {
  if (!videos || typeof videos !== "object") return [];
  const results = (videos as { results?: unknown }).results;
  if (!Array.isArray(results)) return [];
  return results
    .map((v) => {
      if (!v || typeof v !== "object") return null;
      const vv = v as Record<string, unknown>;
      if (typeof vv.key !== "string" || typeof vv.name !== "string") return null;
      const official = typeof vv.official === "boolean" ? vv.official : undefined;
      const mapped: TitleVideo = {
        key: vv.key,
        name: vv.name,
        site: typeof vv.site === "string" ? vv.site : "YouTube",
        type: typeof vv.type === "string" ? vv.type : "Video",
        ...(official === undefined ? {} : { official })
      };
      return mapped;
    })
    .filter((x): x is TitleVideo => Boolean(x));
}

export function pickBestTrailer(videos: TitleVideo[]): TitleVideo | null {
  const yt = videos.filter((v) => v.site.toLowerCase() === "youtube");
  const officialTrailer =
    yt.find((v) => v.type.toLowerCase() === "trailer" && v.official) ??
    yt.find((v) => v.type.toLowerCase() === "trailer") ??
    yt.find((v) => v.type.toLowerCase() === "teaser") ??
    yt[0];
  return officialTrailer ?? null;
}

function mapPeopleToCast(
  people: Array<{ id: number; name: string; profile_path?: string | null; character?: string | null }>,
  limit: number
): TitlePerson[] {
  return people
    .slice(0, limit)
    .map((p) => ({
      id: p.id,
      name: p.name,
      role: p.character ?? null,
      profilePath: p.profile_path ?? null
    }));
}

function mapPeopleToCrew(
  people: Array<{ id: number; name: string; profile_path?: string | null; job?: string | null }>,
  limit: number
): TitlePerson[] {
  return people
    .filter((p) => p.job && ["director", "writer", "screenplay", "creator", "producer"].includes(p.job.toLowerCase()))
    .slice(0, limit)
    .map((p) => ({
      id: p.id,
      name: p.name,
      role: p.job ?? null,
      profilePath: p.profile_path ?? null
    }));
}

export function mapMovieDetailsToTitleDetails(raw: TmdbMovieDetails): TitleDetails {
  const base: TitleSummary = {
    id: raw.id,
    mediaType: "movie",
    name: raw.title,
    overview: raw.overview ?? "",
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    year: raw.release_date?.slice(0, 4) ?? null,
    rating: raw.vote_average ?? 0
  };

  const videos = mapVideos(raw.videos);
  const trailer = pickBestTrailer(videos);
  const cast = mapPeopleToCast(raw.credits?.cast ?? [], 18);
  const crew = mapPeopleToCrew(raw.credits?.crew ?? [], 10);

  return {
    ...base,
    tagline: raw.tagline,
    runtimeMinutes: typeof raw.runtime === "number" ? raw.runtime : null,
    genres: raw.genres ?? [],
    cast,
    crew,
    trailer,
    videos,
    gallery: {
      backdrops: (raw.images?.backdrops ?? []).slice(0, 10).map((b) => b.file_path),
      posters: (raw.images?.posters ?? []).slice(0, 10).map((p) => p.file_path)
    },
    similar: (raw.similar?.results ?? []).map((x) => mapListItemToTitle(x, "movie")),
    recommendations: (raw.recommendations?.results ?? []).map((x) => mapListItemToTitle(x, "movie"))
  };
}

export function mapTvDetailsToTitleDetails(raw: TmdbTvDetails): TitleDetails {
  const base: TitleSummary = {
    id: raw.id,
    mediaType: "tv",
    name: raw.name,
    overview: raw.overview ?? "",
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    year: raw.first_air_date?.slice(0, 4) ?? null,
    rating: raw.vote_average ?? 0
  };

  const videos = mapVideos(raw.videos);
  const trailer = pickBestTrailer(videos);
  const cast = mapPeopleToCast(raw.credits?.cast ?? [], 18);
  const crew = mapPeopleToCrew(raw.credits?.crew ?? [], 10);
  const runtimeMinutes = raw.episode_run_time.length ? raw.episode_run_time[0] : null;

  return {
    ...base,
    tagline: raw.tagline,
    runtimeMinutes,
    genres: raw.genres ?? [],
    cast,
    crew,
    trailer,
    videos,
    gallery: {
      backdrops: (raw.images?.backdrops ?? []).slice(0, 10).map((b) => b.file_path),
      posters: (raw.images?.posters ?? []).slice(0, 10).map((p) => p.file_path)
    },
    similar: (raw.similar?.results ?? []).map((x) => mapListItemToTitle(x, "tv")),
    recommendations: (raw.recommendations?.results ?? []).map((x) => mapListItemToTitle(x, "tv"))
  };
}

