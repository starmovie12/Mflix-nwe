import { Suspense } from "react";
import type { Metadata } from "next";
import {
  getPopularTV,
  getTopRatedTV,
  getAiringTodayTV,
  getOnTheAirTV,
  getTVGenres,
  discoverTV,
} from "@/lib/tmdb/endpoints";
import { mapTVShow } from "@/lib/tmdb/mappers";
import { ContentRow } from "@/components/ui/content-row";
import { RowSkeleton } from "@/components/ui/skeleton";
import type { MediaItem } from "@/types/app";

export const metadata: Metadata = {
  title: "TV Shows",
  description: "Browse popular, top rated, and airing TV shows on MFLIX.",
};

async function TVContent() {
  const [popular, topRated, airingToday, onTheAir, genreList] =
    await Promise.all([
      getPopularTV(),
      getTopRatedTV(),
      getAiringTodayTV(),
      getOnTheAirTV(),
      getTVGenres(),
    ]);

  const genreRows: { name: string; items: MediaItem[] }[] = [];
  const selectedGenres = genreList.genres.slice(0, 4);

  const genreResults = await Promise.allSettled(
    selectedGenres.map((g) =>
      discoverTV({ with_genres: g.id, sort_by: "popularity.desc" })
    )
  );

  selectedGenres.forEach((genre, i) => {
    const result = genreResults[i];
    if (result.status === "fulfilled") {
      genreRows.push({
        name: genre.name,
        items: result.value.results.map(mapTVShow),
      });
    }
  });

  return (
    <div className="pt-20 md:pt-24 space-y-2">
      <div className="px-4 md:px-12 mb-4">
        <h1 className="text-fluid-2xl font-bold text-white">TV Shows</h1>
      </div>

      <ContentRow
        title="Popular TV Shows"
        items={popular.results.map(mapTVShow)}
        variant="backdrop"
      />
      <ContentRow
        title="Top Rated"
        items={topRated.results.map(mapTVShow)}
        variant="poster"
      />
      <ContentRow
        title="Airing Today"
        items={airingToday.results.map(mapTVShow)}
        variant="backdrop"
      />
      <ContentRow
        title="On The Air"
        items={onTheAir.results.map(mapTVShow)}
        variant="poster"
      />
      {genreRows.map((row) => (
        <ContentRow
          key={row.name}
          title={row.name}
          items={row.items}
          variant="poster"
        />
      ))}
    </div>
  );
}

export default function TVPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-20 md:pt-24 space-y-8">
          <RowSkeleton variant="backdrop" />
          <RowSkeleton variant="poster" />
          <RowSkeleton variant="backdrop" />
          <RowSkeleton variant="poster" />
        </div>
      }
    >
      <TVContent />
    </Suspense>
  );
}
