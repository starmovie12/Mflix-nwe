import type { Metadata } from "next";
import { multiSearch } from "@/lib/tmdb/endpoints";
import { mapMultiResult } from "@/lib/tmdb/mappers";
import { SearchPageClient } from "@/features/search/search-page-client";
import type { MediaItem } from "@/types/app";

export const metadata: Metadata = {
  title: "Search",
  description: "Search for movies, TV shows, and people on MFLIX.",
};

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q ?? "";
  let results: MediaItem[] = [];

  if (query.trim()) {
    try {
      const data = await multiSearch(query.trim());
      results = data.results
        .map(mapMultiResult)
        .filter((item): item is MediaItem => item !== null);
    } catch {
      results = [];
    }
  }

  return <SearchPageClient initialQuery={query} initialResults={results} />;
}
