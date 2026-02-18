import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WatchPageView } from "@/features/watch/watch-page-view";
import { APP_NAME } from "@/lib/constants";
import { getMediaDetail } from "@/lib/tmdb/service";
import type { MediaType } from "@/types/media";

interface WatchPageProps {
  params: {
    mediaType: string;
    id: string;
  };
}

export const dynamic = "force-dynamic";

const isMediaType = (value: string): value is MediaType => value === "movie" || value === "tv";

const parseParams = ({ mediaType, id }: WatchPageProps["params"]) => {
  if (!isMediaType(mediaType)) {
    return null;
  }

  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return null;
  }

  return {
    mediaType,
    id: parsedId,
  };
};

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const parsed = parseParams(params);
  if (!parsed) {
    return {
      title: `Watch | ${APP_NAME}`,
      description: "Playback screen",
    };
  }

  const detail = await getMediaDetail(parsed.mediaType, parsed.id);
  if (!detail) {
    return {
      title: `Watch | ${APP_NAME}`,
      description: "Playback is currently unavailable.",
    };
  }

  return {
    title: `Watch ${detail.title}`,
    description: detail.overview.slice(0, 160),
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const parsed = parseParams(params);
  if (!parsed) {
    notFound();
  }

  const detail = await getMediaDetail(parsed.mediaType, parsed.id);

  return (
    <main className="app-shell">
      <WatchPageView detail={detail} />
    </main>
  );
}
