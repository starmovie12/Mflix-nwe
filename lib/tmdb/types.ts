import { z } from "zod";

export const MediaTypeSchema = z.enum(["movie", "tv"]);
export type MediaType = z.infer<typeof MediaTypeSchema>;

export const TmdbPaginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    page: z.number().int().nonnegative(),
    results: z.array(item),
    total_pages: z.number().int().nonnegative().optional(),
    total_results: z.number().int().nonnegative().optional()
  });

const NullableString = z.string().nullable().optional();

export const TmdbListItemSchema = z.object({
  id: z.number().int().positive(),
  media_type: z.string().optional(),
  title: z.string().optional(),
  name: z.string().optional(),
  overview: z.string().optional().default(""),
  poster_path: NullableString,
  backdrop_path: NullableString,
  vote_average: z.number().optional().default(0),
  vote_count: z.number().optional().default(0),
  genre_ids: z.array(z.number().int()).optional().default([]),
  release_date: z.string().optional(),
  first_air_date: z.string().optional(),
  adult: z.boolean().optional(),
  original_language: z.string().optional()
});
export type TmdbListItem = z.infer<typeof TmdbListItemSchema>;

export const TmdbGenreSchema = z.object({
  id: z.number().int().positive(),
  name: z.string()
});

export const TmdbVideoSchema = z.object({
  id: z.string().optional(),
  key: z.string(),
  name: z.string(),
  site: z.string(),
  type: z.string(),
  official: z.boolean().optional(),
  published_at: z.string().optional()
});

export const TmdbVideosSchema = z.object({
  results: z.array(TmdbVideoSchema)
});

export const TmdbPersonSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  profile_path: NullableString,
  known_for_department: z.string().optional()
});

export const TmdbCastSchema = TmdbPersonSchema.extend({
  character: z.string().optional(),
  order: z.number().int().optional()
});

export const TmdbCrewSchema = TmdbPersonSchema.extend({
  job: z.string().optional(),
  department: z.string().optional()
});

export const TmdbCreditsSchema = z.object({
  cast: z.array(TmdbCastSchema).optional().default([]),
  crew: z.array(TmdbCrewSchema).optional().default([])
});

export const TmdbImageAssetSchema = z.object({
  file_path: z.string()
});

export const TmdbImagesSchema = z.object({
  backdrops: z.array(TmdbImageAssetSchema).optional().default([]),
  posters: z.array(TmdbImageAssetSchema).optional().default([])
});

export const TmdbMovieDetailsSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  overview: z.string().optional().default(""),
  poster_path: NullableString,
  backdrop_path: NullableString,
  vote_average: z.number().optional().default(0),
  vote_count: z.number().optional().default(0),
  genres: z.array(TmdbGenreSchema).optional().default([]),
  runtime: z.number().int().nullable().optional(),
  release_date: z.string().optional(),
  adult: z.boolean().optional(),
  original_language: z.string().optional(),
  tagline: z.string().optional(),
  videos: TmdbVideosSchema.optional(),
  credits: TmdbCreditsSchema.optional(),
  images: TmdbImagesSchema.optional(),
  similar: TmdbPaginatedSchema(TmdbListItemSchema).optional(),
  recommendations: TmdbPaginatedSchema(TmdbListItemSchema).optional()
});

export const TmdbTvDetailsSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  overview: z.string().optional().default(""),
  poster_path: NullableString,
  backdrop_path: NullableString,
  vote_average: z.number().optional().default(0),
  vote_count: z.number().optional().default(0),
  genres: z.array(TmdbGenreSchema).optional().default([]),
  episode_run_time: z.array(z.number().int()).optional().default([]),
  first_air_date: z.string().optional(),
  number_of_seasons: z.number().int().optional(),
  number_of_episodes: z.number().int().optional(),
  adult: z.boolean().optional(),
  original_language: z.string().optional(),
  tagline: z.string().optional(),
  videos: TmdbVideosSchema.optional(),
  credits: TmdbCreditsSchema.optional(),
  images: TmdbImagesSchema.optional(),
  similar: TmdbPaginatedSchema(TmdbListItemSchema).optional(),
  recommendations: TmdbPaginatedSchema(TmdbListItemSchema).optional()
});

export type TmdbMovieDetails = z.infer<typeof TmdbMovieDetailsSchema>;
export type TmdbTvDetails = z.infer<typeof TmdbTvDetailsSchema>;

export type TitleVideo = {
  key: string;
  name: string;
  site: "YouTube" | "Vimeo" | string;
  type: string;
  official?: boolean;
};

export type TitleSummary = {
  id: number;
  mediaType: MediaType;
  name: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  year: string | null;
  rating: number;
};

export type TitlePerson = {
  id: number;
  name: string;
  role: string | null;
  profilePath: string | null;
};

export type TitleDetails = TitleSummary & {
  tagline?: string;
  runtimeMinutes: number | null;
  genres: Array<{ id: number; name: string }>;
  cast: TitlePerson[];
  crew: TitlePerson[];
  trailer: TitleVideo | null;
  videos: TitleVideo[];
  gallery: { backdrops: string[]; posters: string[] };
  similar: TitleSummary[];
  recommendations: TitleSummary[];
};

