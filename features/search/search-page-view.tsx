"use client";

import Image from "next/image";
import { Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { MediaCard } from "@/components/media/media-card";
import { Accordion } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionShell } from "@/components/ui/section-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs } from "@/components/ui/tabs";
import { Tag } from "@/components/ui/tag";
import { useToast } from "@/components/providers/toast-provider";
import { useAnalytics } from "@/hooks/use-analytics";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getTmdbImageUrl } from "@/lib/tmdb/images";
import type { MediaGenre, MediaItem } from "@/types/media";
import type { SearchFilterMediaType, SearchItem, SearchResponsePayload } from "@/types/search";

interface SearchPageViewProps {
  movieGenres: MediaGenre[];
  tvGenres: MediaGenre[];
}

type SortOption = "relevance" | "rating" | "latest";

const TAB_OPTIONS = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV Shows" },
  { value: "person", label: "People" },
] as const;

const FILTER_YEAR_OPTIONS = [
  "all",
  String(new Date().getFullYear()),
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
] as const;

const parseYear = (date: string | null) => {
  if (!date) {
    return null;
  }
  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? null : String(year);
};

const isMediaResult = (item: SearchItem): item is { kind: "media"; value: MediaItem } => item.kind === "media";

export const SearchPageView = ({ movieGenres, tvGenres }: SearchPageViewProps) => {
  const { error: toastError } = useToast();
  const { trackEvent } = useAnalytics();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<SearchResponsePayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<SearchFilterMediaType>("all");
  const [selectedGenreId, setSelectedGenreId] = useState<number | "all">("all");
  const [minRating, setMinRating] = useState(0);
  const [selectedYear, setSelectedYear] = useState<(typeof FILTER_YEAR_OPTIONS)[number]>("all");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  const debouncedQuery = useDebouncedValue(query.trim(), 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setData(null);
      setErrorMessage(null);
      return;
    }

    const controller = new AbortController();
    const run = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}&page=${page}`,
          { signal: controller.signal },
        );
        const payload = (await response.json()) as SearchResponsePayload | { message?: string };
        if (!response.ok) {
          const message =
            "message" in payload && typeof payload.message === "string"
              ? payload.message
              : "Search failed. Please retry.";
          throw new Error(message);
        }

        setData(payload as SearchResponsePayload);
        trackEvent("search_performed", { query: debouncedQuery, page });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        const message = error instanceof Error ? error.message : "Search failed.";
        setErrorMessage(message);
        toastError("Search unavailable", message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, page, toastError, trackEvent]);

  const activeGenres = useMemo(() => {
    if (activeTab === "tv") {
      return tvGenres;
    }
    if (activeTab === "movie") {
      return movieGenres;
    }
    return [...movieGenres, ...tvGenres].filter(
      (genre, index, array) => array.findIndex((item) => item.id === genre.id) === index,
    );
  }, [activeTab, movieGenres, tvGenres]);

  const filteredItems = useMemo(() => {
    if (!data) {
      return [];
    }

    const matchesTab = (item: SearchItem) => {
      if (activeTab === "all") {
        return true;
      }

      if (activeTab === "person") {
        return item.kind === "person";
      }

      return item.kind === "media" && item.value.mediaType === activeTab;
    };

    const matchesFilters = (item: SearchItem) => {
      if (!isMediaResult(item)) {
        return true;
      }

      if (selectedGenreId !== "all" && !item.value.genreIds.includes(selectedGenreId)) {
        return false;
      }
      if (item.value.voteAverage < minRating) {
        return false;
      }
      if (selectedYear !== "all" && parseYear(item.value.releaseDate) !== selectedYear) {
        return false;
      }

      return true;
    };

    const result = data.items.filter((item) => matchesTab(item) && matchesFilters(item));
    if (sortBy === "relevance") {
      return result;
    }

    if (sortBy === "rating") {
      return result.slice().sort((a, b) => {
        const aScore = a.kind === "media" ? a.value.voteAverage : 0;
        const bScore = b.kind === "media" ? b.value.voteAverage : 0;
        return bScore - aScore;
      });
    }

    return result.slice().sort((a, b) => {
      const aDate = a.kind === "media" ? new Date(a.value.releaseDate ?? 0).getTime() : 0;
      const bDate = b.kind === "media" ? new Date(b.value.releaseDate ?? 0).getTime() : 0;
      return bDate - aDate;
    });
  }, [activeTab, data, minRating, selectedGenreId, selectedYear, sortBy]);

  const suggestions = useMemo(() => filteredItems.slice(0, 6), [filteredItems]);

  return (
    <main className="app-shell space-y-8 pb-16 pt-20 md:space-y-10 md:pt-24">
      <section className="space-y-4">
        <Tag>Search & Discover</Tag>
        <h1 className="font-display text-3xl font-semibold text-text-50 md:text-5xl">Find your next binge</h1>
        <p className="max-w-2xl text-sm text-text-200 md:text-base">
          Search across movies, TV shows, and people with fast suggestions, filters, and smart sorting.
        </p>
      </section>

      <section className="space-y-4">
        <label className="relative block" htmlFor="search-input">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-400" />
          <input
            id="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles, cast, creators..."
            className="w-full rounded-2xl border border-white/15 bg-surface-900/70 py-3 pl-12 pr-4 text-base text-text-50 placeholder:text-text-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            autoComplete="off"
          />
        </label>

        {query.trim().length >= 2 && suggestions.length > 0 ? (
          <Card className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-text-400">Instant suggestions</p>
            <ul className="space-y-1">
              {suggestions.map((item, index) => (
                <li key={`${item.kind}-${index}`} className="line-clamp-1 text-sm text-text-200">
                  {item.kind === "media" ? item.value.title : item.value.name}
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
      </section>

      <section className="space-y-4">
        <Tabs
          options={TAB_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
          value={activeTab}
          onChange={(value) => {
            const nextTab = value as SearchFilterMediaType;
            setActiveTab(nextTab);
            setSelectedGenreId("all");
          }}
        />

        <Accordion
          defaultOpenId="filters"
          items={[
            {
              id: "filters",
              title: "Filters & sorting",
              content: (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="space-y-1">
                    <span className="text-xs uppercase tracking-wide text-text-400">Genre</span>
                    <select
                      value={selectedGenreId}
                      onChange={(event) =>
                        setSelectedGenreId(
                          event.target.value === "all" ? "all" : Number(event.target.value),
                        )
                      }
                      className="w-full rounded-lg border border-white/15 bg-surface-900 px-3 py-2 text-sm text-text-50"
                    >
                      <option value="all">All genres</option>
                      {activeGenres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="text-xs uppercase tracking-wide text-text-400">Minimum rating</span>
                    <select
                      value={String(minRating)}
                      onChange={(event) => setMinRating(Number(event.target.value))}
                      className="w-full rounded-lg border border-white/15 bg-surface-900 px-3 py-2 text-sm text-text-50"
                    >
                      <option value="0">Any rating</option>
                      <option value="5">5+</option>
                      <option value="6">6+</option>
                      <option value="7">7+</option>
                      <option value="8">8+</option>
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="text-xs uppercase tracking-wide text-text-400">Year</span>
                    <select
                      value={selectedYear}
                      onChange={(event) => setSelectedYear(event.target.value as (typeof FILTER_YEAR_OPTIONS)[number])}
                      className="w-full rounded-lg border border-white/15 bg-surface-900 px-3 py-2 text-sm text-text-50"
                    >
                      {FILTER_YEAR_OPTIONS.map((year) => (
                        <option key={year} value={year}>
                          {year === "all" ? "All years" : year}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="text-xs uppercase tracking-wide text-text-400">Sort by</span>
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value as SortOption)}
                      className="w-full rounded-lg border border-white/15 bg-surface-900 px-3 py-2 text-sm text-text-50"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="rating">Rating</option>
                      <option value="latest">Release date</option>
                    </select>
                  </label>
                </div>
              ),
            },
          ]}
        />
      </section>

      <SectionShell
        title={query.trim().length < 2 ? "Type at least 2 characters to search" : `Results (${filteredItems.length})`}
        action={
          data && data.totalPages > 1 ? (
            <div className="flex items-center gap-2 text-xs text-text-400">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-white/20 px-2 py-1 disabled:opacity-40"
              >
                Prev
              </button>
              <span>
                Page {page} / {Math.min(data.totalPages, 500)}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(current + 1, Math.min(data.totalPages, 500)))}
                disabled={page >= Math.min(data.totalPages, 500)}
                className="rounded-lg border border-white/20 px-2 py-1 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null
        }
      >
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="aspect-[2/3] w-full rounded-xl" />
            ))}
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <EmptyState title="Search failed" description={errorMessage} action={null} />
        ) : null}

        {!isLoading && !errorMessage && query.trim().length >= 2 && filteredItems.length === 0 ? (
          <EmptyState
            title="No results found"
            description="Try a different title, cast name, or broaden your filters."
            action={null}
          />
        ) : null}

        {!isLoading && !errorMessage && filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {filteredItems.map((item, index) =>
              item.kind === "media" ? (
                <MediaCard
                  key={`${item.value.mediaType}-${item.value.id}-${index}`}
                  item={item.value}
                  variant="poster"
                />
              ) : (
                <Card key={`person-${item.value.id}-${index}`} className="overflow-hidden p-0">
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={getTmdbImageUrl(item.value.profilePath, "w500", "/images/poster-placeholder.svg")}
                      alt={item.value.name}
                      fill
                      sizes="(max-width: 768px) 48vw, (max-width: 1200px) 24vw, 16vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="line-clamp-1 text-sm font-semibold text-white">{item.value.name}</p>
                      <p className="line-clamp-1 text-xs text-text-200">
                        {item.value.knownForDepartment ?? "Person"}
                      </p>
                    </div>
                  </div>
                </Card>
              ),
            )}
          </div>
        ) : null}

        {!isLoading && !errorMessage && query.trim().length < 2 ? (
          <Card className="flex items-center gap-3 border-dashed">
            <Sparkles className="h-5 w-5 text-brand-400" />
            <p className="text-sm text-text-200">
              Start typing to unlock smart suggestions, genre filters, and quick discovery.
            </p>
          </Card>
        ) : null}
      </SectionShell>
    </main>
  );
};
