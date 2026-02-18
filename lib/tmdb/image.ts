import "server-only";

import { env } from "@/lib/env";

export type TmdbImageSize =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "w1280"
  | "original";

export function tmdbImageUrl(path: string | null | undefined, size: TmdbImageSize) {
  if (!path) return null;
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return `${env.TMDB_IMAGE_BASE_URL}/${size}${safePath}`;
}

