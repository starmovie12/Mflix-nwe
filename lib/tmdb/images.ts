import { FALLBACK_IMAGES } from "@/lib/constants";

export type TmdbImageSize =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "w1280"
  | "original";

const TMDB_IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL ?? "https://image.tmdb.org/t/p";

export const getTmdbImageUrl = (
  path: string | null | undefined,
  size: TmdbImageSize,
  fallback: string,
) => {
  if (!path) {
    return fallback;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${TMDB_IMAGE_BASE_URL}/${size}${normalizedPath}`;
};

export const getPosterUrl = (path: string | null | undefined, size: TmdbImageSize = "w500") =>
  getTmdbImageUrl(path, size, FALLBACK_IMAGES.poster);

export const getBackdropUrl = (
  path: string | null | undefined,
  size: TmdbImageSize = "w1280",
) => getTmdbImageUrl(path, size, FALLBACK_IMAGES.backdrop);
