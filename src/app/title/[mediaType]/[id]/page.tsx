import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMovieDetails, getTVDetails } from "@/lib/tmdb/endpoints";
import { mapMovieDetails, mapTVDetails } from "@/lib/tmdb/mappers";
import { getBackdropUrl } from "@/lib/tmdb/image";
import { DetailPageClient } from "@/features/detail/detail-page-client";
import { HeroSkeleton, RowSkeleton } from "@/components/ui/skeleton";

interface PageProps {
  params: { mediaType: string; id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { mediaType, id } = params;
  const numId = parseInt(id, 10);

  if (isNaN(numId) || (mediaType !== "movie" && mediaType !== "tv")) {
    return { title: "Not Found" };
  }

  try {
    const details =
      mediaType === "movie"
        ? mapMovieDetails(await getMovieDetails(numId))
        : mapTVDetails(await getTVDetails(numId));

    return {
      title: details.title,
      description: details.overview,
      openGraph: {
        title: details.title,
        description: details.overview,
        images: details.backdropPath
          ? [{ url: getBackdropUrl(details.backdropPath, "w1280") }]
          : [],
        type: mediaType === "movie" ? "video.movie" : "video.tv_show",
      },
      twitter: {
        card: "summary_large_image",
        title: details.title,
        description: details.overview,
        images: details.backdropPath
          ? [getBackdropUrl(details.backdropPath, "w1280")]
          : [],
      },
    };
  } catch {
    return { title: "Not Found" };
  }
}

async function DetailContent({ params }: PageProps) {
  const { mediaType, id } = params;
  const numId = parseInt(id, 10);

  if (isNaN(numId) || (mediaType !== "movie" && mediaType !== "tv")) {
    notFound();
  }

  try {
    const details =
      mediaType === "movie"
        ? mapMovieDetails(await getMovieDetails(numId))
        : mapTVDetails(await getTVDetails(numId));

    return <DetailPageClient details={details} />;
  } catch {
    notFound();
  }
}

export default function TitleDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div>
          <HeroSkeleton />
          <div className="space-y-8 mt-8 px-4 md:px-12">
            <RowSkeleton variant="poster" />
          </div>
        </div>
      }
    >
      <DetailContent params={params} />
    </Suspense>
  );
}
