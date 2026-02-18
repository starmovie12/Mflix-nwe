import { z } from "zod";

const nullableString = z.string().nullable();

export const tmdbMediaTypeSchema = z.enum(["movie", "tv", "person"]);

export const tmdbListItemSchema = z
  .object({
    id: z.number(),
    media_type: tmdbMediaTypeSchema.optional(),
    title: z.string().optional(),
    name: z.string().optional(),
    overview: z.string().nullable().optional(),
    poster_path: nullableString.optional(),
    backdrop_path: nullableString.optional(),
    release_date: z.string().optional(),
    first_air_date: z.string().optional(),
    vote_average: z.number().optional(),
    genre_ids: z.array(z.number()).optional(),
  })
  .passthrough();

export const tmdbPaginatedListSchema = z.object({
  page: z.number(),
  results: z.array(tmdbListItemSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export const tmdbGenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const tmdbVideoSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  site: z.string(),
  type: z.string(),
  official: z.boolean().optional().default(false),
});

export const tmdbVideosSchema = z.object({
  results: z.array(tmdbVideoSchema).default([]),
});

export const tmdbImageSchema = z.object({
  aspect_ratio: z.number(),
  file_path: z.string(),
  width: z.number(),
  height: z.number(),
});

export const tmdbImagesSchema = z.object({
  backdrops: z.array(tmdbImageSchema).default([]),
  posters: z.array(tmdbImageSchema).default([]),
});

export const tmdbCastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string().nullable().optional(),
  profile_path: nullableString.optional(),
});

export const tmdbCrewMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string().optional().default("Unknown"),
  profile_path: nullableString.optional(),
});

export const tmdbCreditsSchema = z.object({
  cast: z.array(tmdbCastMemberSchema).default([]),
  crew: z.array(tmdbCrewMemberSchema).default([]),
});

const tmdbDetailBaseSchema = z.object({
  id: z.number(),
  overview: z.string().nullable().optional(),
  poster_path: nullableString.optional(),
  backdrop_path: nullableString.optional(),
  vote_average: z.number().optional(),
  genres: z.array(tmdbGenreSchema).default([]),
  status: z.string().nullable().optional(),
  tagline: z.string().nullable().optional(),
  videos: tmdbVideosSchema.optional(),
  images: tmdbImagesSchema.optional(),
  credits: tmdbCreditsSchema.optional(),
  similar: tmdbPaginatedListSchema.optional(),
  recommendations: tmdbPaginatedListSchema.optional(),
});

export const tmdbMovieDetailSchema = tmdbDetailBaseSchema.extend({
  title: z.string(),
  release_date: z.string().optional(),
  runtime: z.number().nullable().optional(),
});

export const tmdbTvDetailSchema = tmdbDetailBaseSchema.extend({
  name: z.string(),
  first_air_date: z.string().optional(),
  episode_run_time: z.array(z.number()).optional(),
});

export type TmdbPaginatedListResponse = z.infer<typeof tmdbPaginatedListSchema>;
export type TmdbMovieDetailResponse = z.infer<typeof tmdbMovieDetailSchema>;
export type TmdbTvDetailResponse = z.infer<typeof tmdbTvDetailSchema>;
