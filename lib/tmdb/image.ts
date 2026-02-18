/**
 * TMDB image URL builder - centralized to prevent broken image links
 */

const IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

export type ImageSize =
  | 'w92'
  | 'w154'
  | 'w185'
  | 'w342'
  | 'w500'
  | 'w780'
  | 'original';

export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';

export type ProfileSize = 'w45' | 'w185' | 'h632' | 'original';

/**
 * Build full TMDB image URL
 */
export function getImageUrl(
  path: string | null | undefined,
  size: ImageSize | BackdropSize | ProfileSize = 'w500'
): string | null {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

/**
 * Poster URL for cards
 */
export function getPosterUrl(path: string | null | undefined): string | null {
  return getImageUrl(path, 'w500');
}

/**
 * Backdrop URL for hero/billboard
 */
export function getBackdropUrl(path: string | null | undefined): string | null {
  return getImageUrl(path, 'w1280');
}

/**
 * Profile URL for cast
 */
export function getProfileUrl(path: string | null | undefined): string | null {
  return getImageUrl(path, 'w185');
}

/**
 * Fallback placeholder for missing images
 */
export const FALLBACK_POSTER = '/images/placeholder-poster.svg';
export const FALLBACK_BACKDROP = '/images/placeholder-backdrop.svg';
export const FALLBACK_PROFILE = '/images/placeholder-profile.svg';
