"use client";

import Image from "next/image";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { MediaCard } from "@/components/media/media-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { FALLBACK_IMAGES } from "@/lib/constants";
import { getTmdbImageUrl } from "@/lib/tmdb/images";
import type { SearchCatalogResponse, SearchTab } from "@/types/search";

const SEARCH_TABS: Array<{ id: SearchTab; label: string }> = [
  { id: "all", label: "All" },
  { id: "movie", label: "Movies" },
  { id: "tv", label: "TV Shows" },
  { id: "person", label: "People" },
];

const INITIAL_DATA: SearchCatalogResponse = {
  media: [],
  people: [],
  hasData: false,
  errorMessage: null,
};

const extractYear = (date: string | null) => {
  if (!date) {
    return null;
  }

  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? null : year;
};

type SortOption = "relevance" | "rating" | "date";

export const SearchPageView = () => {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<SearchTab>("all");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [minYear, setMinYear] = useState<number | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchCatalogResponse>(INITIAL_DATA);
  const debouncedQuery = useDebouncedValue(query, 350);

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();
    if (trimmedQuery.length < 2) {
      setResults(INITIAL_DATA);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}&tab=${tab}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorPayload = (await response.json()) as { errorMessage?: string };
          throw new Error(errorPayload.errorMessage ?? "Search failed.");
        }

        return (await response.json()) as SearchCatalogResponse;
      })
      .then((payload) => {
        setResults(payload);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setResults({
          media: [],
          people: [],
          hasData: false,
          errorMessage: error instanceof Error ? error.message : "Search is unavailable.",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, tab]);

  const filteredMedia = useMemo(() => {
    const items = results.media.filter((item) => {
      const releaseYear = extractYear(item.releaseDate);
      const yearMatch = minYear ? releaseYear !== null && releaseYear >= minYear : true;
      const ratingMatch = item.voteAverage >= minRating;

      return yearMatch && ratingMatch;
    });

    if (sortBy === "rating") {
      return [...items].sort((a, b) => b.voteAverage - a.voteAverage);
    }

    if (sortBy === "date") {
      return [...items].sort((a, b) => {
        const aTime = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const bTime = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        return bTime - aTime;
      });
    }

    return items;
  }, [minRating, minYear, results.media, sortBy]);

  const shouldShowSuggestions = query.trim().length < 2;
  const hasAnyResults = filteredMedia.length > 0 || results.people.length > 0;

  return (
    <div className="space-y-8 pb-16 pt-24">
      <section className="glass-surface rounded-2xl p-6 md:p-8">
        <h1 className="font-display text-3xl font-semibold text-text-50 md:text-4xl">Search</h1>
        <p className="mt-2 text-sm text-text-300">
          Find movies, series, and cast instantly with smart filters.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          <label
            htmlFor="search-input"
            className="flex items-center gap-3 rounded-xl border border-white/15 bg-surface-900 px-4 py-3"
          >
            <Search className="h-4 w-4 text-text-400" />
            <input
              id="search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies, TV shows, cast..."
              className="w-full bg-transparent text-sm text-text-50 outline-none placeholder:text-text-400"
              aria-label="Search titles"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {SEARCH_TABS.map((searchTab) => (
              <button
                key={searchTab.id}
                type="button"
                onClick={() => setTab(searchTab.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  tab === searchTab.id
                    ? "bg-brand-500 text-white"
                    : "border border-white/15 bg-white/5 text-text-300 hover:text-text-50"
                }`}
              >
                {searchTab.label}
              </button>
            ))}
          </div>

          <div className="grid gap-3 rounded-xl border border-white/10 bg-surface-900/70 p-3 md:grid-cols-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-400">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </div>
            <label className="flex items-center gap-2 text-xs text-text-300">
              Min Year
              <input
                type="number"
                value={minYear ?? ""}
                onChange={(event) => setMinYear(event.target.value ? Number(event.target.value) : null)}
                className="w-full rounded-lg border border-white/15 bg-surface-800 px-2 py-1 text-xs text-text-50 outline-none focus:border-brand-400"
                placeholder="e.g. 2020"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-text-300">
              Min Rating
              <input
                type="number"
                min={0}
                max={10}
                step={0.5}
                value={minRating}
                onChange={(event) => setMinRating(Number(event.target.value))}
                className="w-full rounded-lg border border-white/15 bg-surface-800 px-2 py-1 text-xs text-text-50 outline-none focus:border-brand-400"
              />
            </label>
            <label className="md:col-span-3 flex items-center gap-2 text-xs text-text-300">
              Sort By
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="rounded-lg border border-white/15 bg-surface-800 px-2 py-1 text-xs text-text-50 outline-none focus:border-brand-400"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="date">Release Date</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      {shouldShowSuggestions ? (
        <EmptyState
          title="Start typing to search"
          description="Use at least 2 characters to discover titles, cast, and trending picks."
        />
      ) : null}

      {isLoading ? (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[2/3] w-full rounded-xl" />
          ))}
        </section>
      ) : null}

      {!isLoading && !shouldShowSuggestions && !hasAnyResults ? (
        <EmptyState
          title="No matching titles"
          description={
            results.errorMessage ??
            "Try a different keyword, remove filters, or switch search tabs."
          }
        />
      ) : null}

      {!isLoading && filteredMedia.length > 0 ? (
        <section className="space-y-3">
          <h2 className="section-title">Titles</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {filteredMedia.map((item) => (
              <MediaCard key={`${item.mediaType}-${item.id}`} item={item} variant="poster" />
            ))}
          </div>
        </section>
      ) : null}

      {!isLoading && results.people.length > 0 ? (
        <section className="space-y-3">
          <h2 className="section-title">People</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {results.people.map((person) => (
              <article
                key={person.id}
                className="glass-surface overflow-hidden rounded-xl border border-white/10"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={getTmdbImageUrl(person.profilePath, "w342", FALLBACK_IMAGES.poster)}
                    alt={person.name}
                    fill
                    sizes="(max-width: 768px) 42vw, (max-width: 1200px) 24vw, 16vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1 p-3">
                  <p className="line-clamp-1 text-sm font-semibold text-text-50">{person.name}</p>
                  <p className="line-clamp-1 text-xs text-text-400">
                    {person.knownForDepartment ?? "Performer"}
                  </p>
                  {person.knownForTitles.length > 0 ? (
                    <p className="line-clamp-2 text-xs text-text-300">
                      Known for: {person.knownForTitles.slice(0, 2).join(", ")}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};
