import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WatchPlayerView } from "@/features/watch/watch-player-view";
import { APP_NAME } from "@/lib/constants";
import { getMediaDetail } from "@/lib/tmdb/service";
import type { MediaDetail, MediaType } from "@/types/media";

interface WatchPageProps {
  params: {
    mediaType: string;
    id: string;
  };
}

const isMediaType = (value: string): value is MediaType => value === "movie" || value === "tv";

const parseId = (value: string) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

const parseParams = ({ mediaType, id }: WatchPageProps["params"]) => {
  if (!isMediaType(mediaType)) {
    return null;
  }
  const parsedId = parseId(id);
  if (!parsedId) {
    return null;
  }

  return { mediaType, id: parsedId };
};

const buildFallbackDetail = (mediaType: MediaType, id: number): MediaDetail => ({
  id,
  mediaType,
  title: "Demo Stream",
  overview:
    "This is a demo playback screen. Configure TMDB_API_KEY to load title metadata while testing advanced player controls.",
  posterPath: null,
  backdropPath: null,
  releaseDate: null,
  voteAverage: 0,
  genreIds: [],
  genres: [],
  runtime: null,
  status: null,
  tagline: null,
  seasons: [],
  videos: [],
  cast: [],
  crew: [],
  similar: [],
  recommendations: [],
});

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const parsed = parseParams(params);
  if (!parsed) {
    return {
      title: `Watch | ${APP_NAME}`,
    };
  }

  const detail = await getMediaDetail(parsed.mediaType, parsed.id);
  if (!detail) return { title: `Watch | ${APP_NAME}` };

  return {
    title: `Watch ${detail.title} | ${APP_NAME}`,
    description: detail.overview.slice(0, 150),
    alternates: {
      canonical: `/watch/${detail.mediaType}/${detail.id}`,
    },
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const parsed = parseParams(params);
  if (!parsed) {
    notFound();
  }

  const detail = (await getMediaDetail(parsed.mediaType, parsed.id)) ?? buildFallbackDetail(parsed.mediaType, parsed.id);

  return <WatchPlayerView detail={detail} />;
}
