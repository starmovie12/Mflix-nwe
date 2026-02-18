export type MediaType = "movie" | "tv";

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
  originalLanguage: string;
}

export interface MediaDetails extends MediaItem {
  tagline: string | null;
  runtime: number | null;
  status: string;
  genres: Genre[];
  cast: CastMember[];
  crew: CrewMember[];
  videos: Video[];
  images: ImageAsset[];
  similar: MediaItem[];
  recommendations: MediaItem[];
  spokenLanguages: string[];
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  seasons?: Season[];
  createdBy?: string[];
}

export interface Genre {
  id: number;
  name: string;
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

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface ImageAsset {
  filePath: string;
  width: number;
  height: number;
  aspectRatio: number;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  posterPath: string | null;
  seasonNumber: number;
  episodeCount: number;
  airDate: string | null;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episodeNumber: number;
  seasonNumber: number;
  stillPath: string | null;
  airDate: string | null;
  runtime: number | null;
  voteAverage: number;
}

export interface ContentRow {
  id: string;
  title: string;
  items: MediaItem[];
  variant?: "poster" | "backdrop" | "compact" | "top10";
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
  maturityLevel: "all" | "pg" | "pg13" | "r";
}

export interface WatchProgress {
  mediaId: number;
  mediaType: MediaType;
  progress: number;
  duration: number;
  timestamp: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
}
