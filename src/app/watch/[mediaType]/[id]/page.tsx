import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMovieDetails, getTVDetails } from "@/lib/tmdb/endpoints";
import { mapMovieDetails, mapTVDetails, getTrailerKey } from "@/lib/tmdb/mappers";
import { WatchPageClient } from "@/features/watch/watch-page-client";

interface WatchPageProps {
  params: { mediaType: string; id: string };
}

export async function generateMetadata({
  params,
}: WatchPageProps): Promise<Metadata> {
  const numId = parseInt(params.id, 10);
  if (isNaN(numId) || (params.mediaType !== "movie" && params.mediaType !== "tv")) {
    return { title: "Watch" };
  }

  try {
    const details =
      params.mediaType === "movie"
        ? mapMovieDetails(await getMovieDetails(numId))
        : mapTVDetails(await getTVDetails(numId));
    return { title: `Watch ${details.title}` };
  } catch {
    return { title: "Watch" };
  }
}

export default async function WatchPage({ params }: WatchPageProps) {
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

    const trailerKey = getTrailerKey(details.videos);

    return (
      <WatchPageClient
        details={details}
        trailerKey={trailerKey}
      />
    );
  } catch {
    notFound();
  }
}
