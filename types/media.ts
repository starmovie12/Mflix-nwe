export type MediaType = "movie" | "tv";

export interface MediaGenre {
  id: number;
  name: string;
}

export interface MediaVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface CastMember {
  id: number;
  name: string;
  character: string | null;
  profilePath: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  profilePath: string | null;
}

export interface MediaItem {
  id: number;
  mediaType: MediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
  genreIds: number[];
}

export interface MediaDetail extends MediaItem {
  genres: MediaGenre[];
  runtime: number | null;
  status: string | null;
  tagline: string | null;
  videos: MediaVideo[];
  cast: CastMember[];
  crew: CrewMember[];
  similar: MediaItem[];
  recommendations: MediaItem[];
}

export interface MediaRail {
  id: string;
  title: string;
  items: MediaItem[];
}
