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

export interface MediaImage {
  aspectRatio: number;
  filePath: string;
  width: number;
  height: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string | null;
  profilePath: string | null;
  order?: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department?: string;
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
  originalLanguage?: string;
}

export interface MediaDetail extends MediaItem {
  genres: MediaGenre[];
  runtime: number | null;
  status: string | null;
  tagline: string | null;
  videos: MediaVideo[];
  images: {
    backdrops: MediaImage[];
    posters: MediaImage[];
  };
  cast: CastMember[];
  crew: CrewMember[];
  similar: MediaItem[];
  recommendations: MediaItem[];
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
}

export interface MediaRail {
  id: string;
  title: string;
  items: MediaItem[];
  variant?: "poster" | "backdrop" | "top10";
}
