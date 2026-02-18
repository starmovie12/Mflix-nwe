import type { Metadata } from "next";

import { SearchPageView } from "@/features/search/search-page-view";
import { APP_NAME } from "@/lib/constants";
import { getGenreCollections } from "@/lib/tmdb/service";

export const revalidate = 60 * 60;

export const metadata: Metadata = {
  title: `Search | ${APP_NAME}`,
  description: "Search movies, TV shows, and people with instant suggestions and filters.",
};

export default async function SearchPage() {
  const genres = await getGenreCollections();

  return <SearchPageView movieGenres={genres.movie} tvGenres={genres.tv} />;
}
