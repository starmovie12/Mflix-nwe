import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WatchPlayerView } from "@/features/watch/watch-player-view";
import { APP_NAME } from "@/lib/constants";
import { getMediaDetail } from "@/lib/tmdb/service";
import type { MediaType } from "@/types/media";

interface WatchPageProps {
  params: {
    mediaType: string;
    id: string;
  };
}

const isMediaType = (value: string): value is MediaType =>
  value === "movie" || value === "tv";

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  if (!isMediaType(params.mediaType)) {
    return { title: `Watch | ${APP_NAME}` };
  }

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return { title: `Watch | ${APP_NAME}` };
  }

  const detail = await getMediaDetail(params.mediaType, id);
  return {
    title: detail ? `Watch ${detail.title}` : `Watch | ${APP_NAME}`,
    description: detail?.overview?.slice(0, 160),
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  if (!isMediaType(params.mediaType)) notFound();

  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const detail = await getMediaDetail(params.mediaType, id);

  return <WatchPlayerView detail={detail} />;
}
