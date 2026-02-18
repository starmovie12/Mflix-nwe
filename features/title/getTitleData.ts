import { fetchMovieDetails, fetchTvDetails } from '@/lib/tmdb/client';
import { mapMovieDetailsToMediaDetail, mapTvDetailsToTvDetail } from '@/lib/tmdb/mappers';
import type { MediaDetail, TvDetail } from '@/lib/tmdb/types';

export type TitleData = MediaDetail | TvDetail;

export async function getTitleData(
  mediaType: 'movie' | 'tv',
  id: number
): Promise<TitleData | null> {
  try {
    if (mediaType === 'movie') {
      const details = await fetchMovieDetails(id);
      return mapMovieDetailsToMediaDetail(
        details as Parameters<typeof mapMovieDetailsToMediaDetail>[0]
      );
    }
    const details = await fetchTvDetails(id);
    return mapTvDetailsToTvDetail(
      details as Parameters<typeof mapTvDetailsToTvDetail>[0]
    );
  } catch (error) {
    console.error('Failed to fetch title data:', error);
    return null;
  }
}
