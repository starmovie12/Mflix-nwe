import "server-only";

import { z } from "zod";

const normalizeEnvValue = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }

  const hasWrappingQuotes =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"));

  if (!hasWrappingQuotes) {
    return trimmed;
  }

  const unquoted = trimmed.slice(1, -1).trim();
  return unquoted.length > 0 ? unquoted : undefined;
};

const envSchema = z.object({
  TMDB_API_KEY: z.string().min(1).optional(),
  TMDB_BASE_URL: z.string().url().default("https://api.themoviedb.org/3"),
  TMDB_IMAGE_BASE_URL: z.string().url().default("https://image.tmdb.org/t/p"),
  NEXT_PUBLIC_APP_NAME: z.string().default("MFLIX"),
});

const parsedEnv = envSchema.safeParse({
  TMDB_API_KEY: normalizeEnvValue(process.env.TMDB_API_KEY),
  TMDB_BASE_URL: normalizeEnvValue(process.env.TMDB_BASE_URL),
  TMDB_IMAGE_BASE_URL: normalizeEnvValue(process.env.TMDB_IMAGE_BASE_URL),
  NEXT_PUBLIC_APP_NAME: normalizeEnvValue(process.env.NEXT_PUBLIC_APP_NAME),
});

if (!parsedEnv.success) {
  throw new Error(`Invalid environment variables: ${parsedEnv.error.message}`);
}

export const env = parsedEnv.data;

export const hasTmdbApiKey = () =>
  typeof env.TMDB_API_KEY === "string" && env.TMDB_API_KEY.length > 0;

export const requireTmdbApiKey = (): string => {
  const apiKey = env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error(
      "TMDB_API_KEY is missing. Add it to .env.local (local) or deployment environment variables (Vercel/Netlify).",
    );
  }

  return apiKey;
};
