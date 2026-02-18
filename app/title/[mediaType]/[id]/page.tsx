import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TitleDetailView } from "@/features/title/title-detail-view";
import { APP_NAME } from "@/lib/constants";
import { getBackdropUrl } from "@/lib/tmdb/images";
import { getMediaDetail } from "@/lib/tmdb/service";
import type { MediaType } from "@/types/media";

interface TitlePageProps {
  params: {
    mediaType: string;
    id: string;
  };
}

export const revalidate = 60 * 10;

const isMediaType = (value: string): value is MediaType =>
  value === "movie" || value === "tv";

const parseId = (value: string) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
};

const parseParams = ({ mediaType, id }: TitlePageProps["params"]) => {
  if (!isMediaType(mediaType)) return null;
  const parsedId = parseId(id);
  if (!parsedId) return null;
  return { mediaType, id: parsedId };
};

export async function generateMetadata({ params }: TitlePageProps): Promise<Metadata> {
  const parsed = parseParams(params);
  if (!parsed) {
    return {
      title: `Title Not Found | ${APP_NAME}`,
      description: "The requested title could not be found.",
    };
  }

  const detail = await getMediaDetail(parsed.mediaType, parsed.id);
  if (!detail) {
    return {
      title: `Title Unavailable | ${APP_NAME}`,
      description: "This title is currently unavailable.",
    };
  }

  const overview = detail.overview.slice(0, 160);

  return {
    title: detail.title,
    description: overview,
    alternates: {
      canonical: `/title/${detail.mediaType}/${detail.id}`,
    },
    openGraph: {
      title: `${detail.title} - ${APP_NAME}`,
      description: overview,
      type: detail.mediaType === "tv" ? "video.tv_show" : "video.movie",
      images: detail.backdropPath
        ? [{ url: getBackdropUrl(detail.backdropPath, "w1280"), alt: detail.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${detail.title} - ${APP_NAME}`,
      description: overview,
      images: detail.backdropPath
        ? [getBackdropUrl(detail.backdropPath, "w1280")]
        : [],
    },
  };
}

export default async function TitleDetailPage({ params }: TitlePageProps) {
  const parsed = parseParams(params);
  if (!parsed) notFound();

  const detail = await getMediaDetail(parsed.mediaType, parsed.id);

  return (
    <main className="app-shell">
      <TitleDetailView detail={detail} />
    </main>
  );
}
