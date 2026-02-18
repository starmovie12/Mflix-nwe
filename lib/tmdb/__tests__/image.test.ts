import { describe, it, expect } from 'vitest';
import {
  getImageUrl,
  getPosterUrl,
  getBackdropUrl,
  getProfileUrl,
} from '../image';

describe('TMDB image utilities', () => {
  it('getImageUrl returns full URL for valid path', () => {
    const result = getImageUrl('/abc123', 'w500');
    expect(result).toContain('image.tmdb.org');
    expect(result).toContain('w500');
    expect(result).toContain('abc123');
  });

  it('getImageUrl returns null for null path', () => {
    expect(getImageUrl(null)).toBeNull();
    expect(getImageUrl(undefined)).toBeNull();
  });

  it('getPosterUrl uses w500 size', () => {
    expect(getPosterUrl('/poster.jpg')).toContain('w500');
  });

  it('getBackdropUrl uses w1280 size', () => {
    expect(getBackdropUrl('/backdrop.jpg')).toContain('w1280');
  });

  it('getProfileUrl uses w185 size', () => {
    expect(getProfileUrl('/profile.jpg')).toContain('w185');
  });
});
