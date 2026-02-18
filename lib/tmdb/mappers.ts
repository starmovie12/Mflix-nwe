/**
 * TMDB API response mappers - normalize to UI-friendly models
 */

import type {
  TMDBMovieResult,
  TMDBTvResult,
  TMDBMovieDetails,
  TMDBTvDetails,
  TMDBPaginatedResponse,
  MediaItem,
  MediaDetail,
  TvDetail,
  CastMember,
  CrewMember,
  VideoItem,
  ImageItem,
  TvSeason,
} from './types';

type MediaType = 'movie' | 'tv';

function mapMovieToMediaItem(item: TMDBMovieResult): MediaItem {
  return {
    id: item.id,
    mediaType: 'movie',
    title: item.title,
    overview: item.overview || '',
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    releaseDate: item.release_date || '',
    voteAverage: item.vote_average,
    voteCount: item.vote_count,
    popularity: item.popularity,
    genreIds: item.genre_ids || [],
  };
}

function mapTvToMediaItem(item: TMDBTvResult): MediaItem {
  return {
    id: item.id,
    mediaType: 'tv',
    title: item.name,
    overview: item.overview || '',
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    releaseDate: item.first_air_date || '',
    voteAverage: item.vote_average,
    voteCount: item.vote_count,
    popularity: item.popularity,
    genreIds: item.genre_ids || [],
  };
}

function inferMediaType(item: TMDBMovieResult | TMDBTvResult): MediaType {
  if ('title' in item && item.title) return 'movie';
  if ('name' in item && item.name) return 'tv';
  return 'movie';
}

export function mapTrendingToMediaItem(
  item: TMDBMovieResult | TMDBTvResult
): MediaItem {
  const type = inferMediaType(item);
  if (type === 'movie') {
    return mapMovieToMediaItem(item as TMDBMovieResult);
  }
  return mapTvToMediaItem(item as TMDBTvResult);
}

export function mapMovieDetailsToMediaDetail(details: TMDBMovieDetails): MediaDetail {
  const credits = details.credits || { cast: [], crew: [] };
  const videos = details.videos?.results || [];
  const images = details.images || { backdrops: [], posters: [] };

  return {
    ...mapMovieToMediaItem(details),
    runtime: details.runtime ?? null,
    genres: details.genres || [],
    cast: (credits.cast || []).slice(0, 20).map((c): CastMember => ({
      id: c.id,
      name: c.name,
      character: c.character || '',
      profilePath: c.profile_path,
      order: c.order,
    })),
    crew: (credits.crew || [])
      .filter((c) => ['Director', 'Writer', 'Screenplay'].includes(c.job))
      .slice(0, 10)
      .map((c): CrewMember => ({
        id: c.id,
        name: c.name,
        job: c.job,
        department: c.department,
        profilePath: c.profile_path,
      })),
    videos: videos
      .filter((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))
      .slice(0, 5)
      .map((v): VideoItem => ({
        id: v.id,
        key: v.key,
        name: v.name,
        site: v.site,
        type: v.type,
        official: v.official,
      })),
    backdrops: (images.backdrops || [])
      .sort((a, b) => b.vote_count - a.vote_count)
      .slice(0, 10)
      .map((i): ImageItem => ({
        filePath: i.file_path,
        voteAverage: i.vote_average,
        width: i.width,
        height: i.height,
      })),
    posters: (images.posters || [])
      .sort((a, b) => b.vote_count - a.vote_count)
      .slice(0, 10)
      .map((i): ImageItem => ({
        filePath: i.file_path,
        voteAverage: i.vote_average,
        width: i.width,
        height: i.height,
      })),
    similar: (details.similar?.results || [])
      .filter((r): r is TMDBMovieResult => 'title' in r)
      .slice(0, 12)
      .map(mapMovieToMediaItem),
    recommendations: (details.recommendations?.results || [])
      .filter((r): r is TMDBMovieResult => 'title' in r)
      .slice(0, 12)
      .map(mapMovieToMediaItem),
  };
}

export function mapTvDetailsToTvDetail(details: TMDBTvDetails): TvDetail {
  const baseItem = mapTvToMediaItem(details);
  const credits = details.credits || { cast: [], crew: [] };
  const videos = details.videos?.results || [];
  const images = details.images || { backdrops: [], posters: [] };

  return {
    ...baseItem,
    runtime: details.episode_run_time?.[0] ?? null,
    numberOfSeasons: details.number_of_seasons || 0,
    numberOfEpisodes: details.number_of_episodes || 0,
    episodeRunTime: details.episode_run_time,
    genres: details.genres || [],
    cast: (credits.cast || []).slice(0, 20).map((c): CastMember => ({
      id: c.id,
      name: c.name,
      character: c.character || '',
      profilePath: c.profile_path,
      order: c.order,
    })),
    crew: (credits.crew || [])
      .filter((c) => ['Director', 'Writer', 'Creator'].includes(c.job))
      .slice(0, 10)
      .map((c): CrewMember => ({
        id: c.id,
        name: c.name,
        job: c.job,
        department: c.department,
        profilePath: c.profile_path,
      })),
    videos: videos
      .filter((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))
      .slice(0, 5)
      .map((v): VideoItem => ({
        id: v.id,
        key: v.key,
        name: v.name,
        site: v.site,
        type: v.type,
        official: v.official,
      })),
    backdrops: (images.backdrops || [])
      .sort((a, b) => b.vote_count - a.vote_count)
      .slice(0, 10)
      .map((i): ImageItem => ({
        filePath: i.file_path,
        voteAverage: i.vote_average,
        width: i.width,
        height: i.height,
      })),
    posters: (images.posters || [])
      .sort((a, b) => b.vote_count - a.vote_count)
      .slice(0, 10)
      .map((i): ImageItem => ({
        filePath: i.file_path,
        voteAverage: i.vote_average,
        width: i.width,
        height: i.height,
      })),
    similar: (details.similar?.results || [])
      .filter((r): r is TMDBTvResult => 'name' in r)
      .slice(0, 12)
      .map(mapTvToMediaItem),
    recommendations: (details.recommendations?.results || [])
      .filter((r): r is TMDBTvResult => 'name' in r)
      .slice(0, 12)
      .map(mapTvToMediaItem),
    seasons: (details.seasons || [])
      .filter((s) => s.season_number > 0)
      .map((s): TvSeason => ({
        id: s.id,
        name: s.name,
        seasonNumber: s.season_number,
        episodeCount: s.episode_count,
        posterPath: s.poster_path,
        airDate: s.air_date,
      })),
  };
}

export function mapPaginatedMovies(
  response: TMDBPaginatedResponse<TMDBMovieResult>
): MediaItem[] {
  return response.results.map(mapMovieToMediaItem);
}

export function mapPaginatedTv(
  response: TMDBPaginatedResponse<TMDBTvResult>
): MediaItem[] {
  return response.results.map(mapTvToMediaItem);
}

export function mapPaginatedTrending(
  response: TMDBPaginatedResponse<TMDBMovieResult | TMDBTvResult>
): MediaItem[] {
  return response.results.map(mapTrendingToMediaItem);
}
