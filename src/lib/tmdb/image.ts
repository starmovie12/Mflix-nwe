const TMDB_IMAGE_BASE = process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";

export type PosterSize = "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original";
export type BackdropSize = "w300" | "w780" | "w1280" | "original";
export type ProfileSize = "w45" | "w185" | "h632" | "original";
export type StillSize = "w92" | "w185" | "w300" | "original";

export function getPosterUrl(path: string | null, size: PosterSize = "w500"): string {
  if (!path) return "/images/poster-placeholder.svg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size: BackdropSize = "w1280"): string {
  if (!path) return "/images/backdrop-placeholder.svg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getProfileUrl(path: string | null, size: ProfileSize = "w185"): string {
  if (!path) return "/images/profile-placeholder.svg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getStillUrl(path: string | null, size: StillSize = "w300"): string {
  if (!path) return "/images/backdrop-placeholder.svg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
