import "server-only";

import { z } from "zod";

const EnvSchema = z.object({
  TMDB_API_KEY: z.string().optional().default(""),
  TMDB_BASE_URL: z
    .string()
    .url()
    .optional()
    .default("https://api.themoviedb.org/3"),
  TMDB_IMAGE_BASE_URL: z
    .string()
    .url()
    .optional()
    .default("https://image.tmdb.org/t/p"),
  NEXT_PUBLIC_APP_NAME: z.string().optional().default("MFLIX")
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse({
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  TMDB_BASE_URL: process.env.TMDB_BASE_URL,
  TMDB_IMAGE_BASE_URL: process.env.TMDB_IMAGE_BASE_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME
});

