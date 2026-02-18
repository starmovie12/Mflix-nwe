import "server-only";

import { tmdbGet } from "@/lib/tmdb/client";
import { tmdbEndpoints } from "@/lib/tmdb/endpoints";
import {
  MediaTypeSchema,
  TmdbListItemSchema,
  TmdbMovieDetailsSchema,
  TmdbPaginatedSchema,
  TmdbVideosSchema,
  TmdbTvDetailsSchema,
  type MediaType,
  type TitleDetails,
  type TitleSummary,
  type TitleVideo
} from "@/lib/tmdb/types";
import {
  mapListItemToTitle,
  mapMovieDetailsToTitleDetails,
  mapTvDetailsToTitleDetails,
  mapVideos,
  pickBestTrailer
} from "@/lib/tmdb/mappers";
import { z } from "zod";

const TmdbListResponseSchema = TmdbPaginatedSchema(TmdbListItemSchema);

function filterTitles(items: TitleSummary[]) {
  const seen = new Set<string>();
  const out: TitleSummary[] = [];
  for (const item of items) {
    const k = `${item.mediaType}:${item.id}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

export type HomeRail = {
  id: string;
  title: string;
  items: TitleSummary[];
};

export async function getHomePageData(): Promise<{
  hero: TitleSummary | null;
  rails: HomeRail[];
}> {
  const [trendingDay, trendingWeek, popularMovies, popularTv, topRated, upcoming, nowPlaying] =
    await Promise.all([
      tmdbGet(tmdbEndpoints.trendingAllDay(), TmdbListResponseSchema, { revalidate: 60 * 10, tags: ["home"] }),
      tmdbGet(tmdbEndpoints.trendingAllWeek(), TmdbListResponseSchema, { revalidate: 60 * 30, tags: ["home"] }),
      tmdbGet(tmdbEndpoints.popularMovies(), TmdbListResponseSchema, { revalidate: 60 * 60, tags: ["home"] }),
      tmdbGet(tmdbEndpoints.popularTv(), TmdbListResponseSchema, { revalidate: 60 * 60, tags: ["home"] }),
      tmdbGet(tmdbEndpoints.topRated(), TmdbListResponseSchema, { revalidate: 60 * 60, tags: ["home"] }),
      tmdbGet(tmdbEndpoints.upcoming(), TmdbListResponseSchema, { revalidate: 60 * 60, tags: ["home"] }),
      tmdbGet(tmdbEndpoints.nowPlaying(), TmdbListResponseSchema, { revalidate: 60 * 30, tags: ["home"] })
    ]);

  const trendingDayTitles = filterTitles(
    trendingDay.results
      .filter((x) => x.media_type === "movie" || x.media_type === "tv")
      .map((x) => mapListItemToTitle(x, "movie"))
  );
  const hero = trendingDayTitles[0] ?? null;

  const rails: HomeRail[] = [
    {
      id: "trending-today",
      title: "Trending Today",
      items: trendingDayTitles.slice(0, 20)
    },
    {
      id: "trending-week",
      title: "Trending This Week",
      items: filterTitles(
        trendingWeek.results
          .filter((x) => x.media_type === "movie" || x.media_type === "tv")
          .map((x) => mapListItemToTitle(x, "movie"))
      ).slice(0, 20)
    },
    {
      id: "popular-movies",
      title: "Popular Movies",
      items: popularMovies.results.map((x) => mapListItemToTitle(x, "movie")).slice(0, 20)
    },
    {
      id: "popular-tv",
      title: "Popular TV",
      items: popularTv.results.map((x) => mapListItemToTitle(x, "tv")).slice(0, 20)
    },
    {
      id: "top-rated",
      title: "Top Rated",
      items: topRated.results.map((x) => mapListItemToTitle(x, "movie")).slice(0, 20)
    },
    {
      id: "upcoming",
      title: "Upcoming",
      items: upcoming.results.map((x) => mapListItemToTitle(x, "movie")).slice(0, 20)
    },
    {
      id: "now-playing",
      title: "Now Playing",
      items: nowPlaying.results.map((x) => mapListItemToTitle(x, "movie")).slice(0, 20)
    }
  ];

  return { hero, rails };
}

export async function getTitleDetails(mediaType: MediaType, id: number): Promise<TitleDetails> {
  const safeMediaType = MediaTypeSchema.parse(mediaType);
  const safeId = z.number().int().positive().parse(id);

  if (safeMediaType === "movie") {
    const raw = await tmdbGet(tmdbEndpoints.titleDetails("movie", safeId), TmdbMovieDetailsSchema, {
      revalidate: 60 * 60,
      tags: [`title:movie:${safeId}`]
    });
    return mapMovieDetailsToTitleDetails(raw);
  }

  const raw = await tmdbGet(tmdbEndpoints.titleDetails("tv", safeId), TmdbTvDetailsSchema, {
    revalidate: 60 * 60,
    tags: [`title:tv:${safeId}`]
  });
  return mapTvDetailsToTitleDetails(raw);
}

export async function getTitleTrailer(mediaType: MediaType, id: number): Promise<TitleVideo | null> {
  const safeMediaType = MediaTypeSchema.parse(mediaType);
  const safeId = z.number().int().positive().parse(id);
  const raw = await tmdbGet(tmdbEndpoints.titleVideos(safeMediaType, safeId), TmdbVideosSchema, {
    revalidate: 60 * 60,
    tags: [`videos:${safeMediaType}:${safeId}`]
  });
  const videos = mapVideos(raw);
  return pickBestTrailer(videos);
}

