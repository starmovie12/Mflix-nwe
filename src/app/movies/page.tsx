import { Suspense } from "react";
import type { Metadata } from "next";
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getMovieGenres,
  discoverMovies,
} from "@/lib/tmdb/endpoints";
import { mapMovie } from "@/lib/tmdb/mappers";
import { ContentRow } from "@/components/ui/content-row";
import { RowSkeleton } from "@/components/ui/skeleton";
import type { MediaItem } from "@/types/app";

export const metadata: Metadata = {
  title: "Movies",
  description: "Browse popular, top rated, and upcoming movies on MFLIX.",
};

async function MoviesContent() {
  const [popular, topRated, nowPlaying, upcoming, genreList] =
    await Promise.all([
      getPopularMovies(),
      getTopRatedMovies(),
      getNowPlayingMovies(),
      getUpcomingMovies(),
      getMovieGenres(),
    ]);

  const genreRows: { name: string; items: MediaItem[] }[] = [];
  const selectedGenres = genreList.genres.slice(0, 4);

  const genreResults = await Promise.allSettled(
    selectedGenres.map((g) =>
      discoverMovies({ with_genres: g.id, sort_by: "popularity.desc" })
    )
  );

  selectedGenres.forEach((genre, i) => {
    const result = genreResults[i];
    if (result.status === "fulfilled") {
      genreRows.push({
        name: genre.name,
        items: result.value.results.map(mapMovie),
      });
    }
  });

  return (
    <div className="pt-20 md:pt-24 space-y-2">
      <div className="px-4 md:px-12 mb-4">
        <h1 className="text-fluid-2xl font-bold text-white">Movies</h1>
      </div>

      <ContentRow
        title="Popular Movies"
        items={popular.results.map(mapMovie)}
        variant="backdrop"
      />
      <ContentRow
        title="Top Rated"
        items={topRated.results.map(mapMovie)}
        variant="poster"
      />
      <ContentRow
        title="Now Playing"
        items={nowPlaying.results.map(mapMovie)}
        variant="backdrop"
      />
      <ContentRow
        title="Upcoming"
        items={upcoming.results.map(mapMovie)}
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

export default function MoviesPage() {
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
      <MoviesContent />
    </Suspense>
  );
}
