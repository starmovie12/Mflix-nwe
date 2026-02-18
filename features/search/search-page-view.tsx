"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, X, Film, Tv, Loader2 } from "lucide-react";

import { MediaCard } from "@/components/media/media-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/cn";
import type { MediaItem, MediaType } from "@/types/media";

type FilterTab = "all" | MediaType;

interface SearchResult {
  results: MediaItem[];
  totalPages: number;
  totalResults: number;
  page: number;
}

export const SearchPageView = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 350);

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("Search failed");
      const data: SearchResult = await res.json();
      setResults(data.results);
      setHasSearched(true);
    } catch {
      setResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchResults(debouncedQuery);
  }, [debouncedQuery, fetchResults]);

  const filteredResults =
    activeTab === "all"
      ? results
      : results.filter((item) => item.mediaType === activeTab);

  const tabs: { key: FilterTab; label: string; icon: typeof Search }[] = [
    { key: "all", label: "All", icon: Search },
    { key: "movie", label: "Movies", icon: Film },
    { key: "tv", label: "TV Shows", icon: Tv },
  ];

  return (
    <div className="space-y-6 pb-16 pt-24">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, TV shows, people..."
          className="h-14 w-full rounded-2xl border border-white/10 bg-surface-800/80 pl-12 pr-12 text-base text-white placeholder:text-text-400 backdrop-blur-xl transition focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          autoFocus
          aria-label="Search"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-400 transition hover:text-white"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {hasSearched && results.length > 0 && (
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const count =
              tab.key === "all"
                ? results.length
                : results.filter((r) => r.mediaType === tab.key).length;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all",
                  activeTab === tab.key
                    ? "border-brand-500 bg-brand-500/15 text-white"
                    : "border-white/15 bg-white/5 text-text-300 hover:bg-white/10",
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
                <span className="ml-0.5 text-text-400">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] w-full rounded-xl" />
          ))}
        </div>
      )}

      {!loading && hasSearched && filteredResults.length === 0 && (
        <EmptyState
          title="No results found"
          description={`We couldn't find anything matching "${query}". Try a different search term.`}
        />
      )}

      {!loading && filteredResults.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredResults.map((item, index) => (
            <MediaCard key={`${item.mediaType}-${item.id}`} item={item} index={index} />
          ))}
        </div>
      )}

      {!loading && !hasSearched && query.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10">
            <Search className="h-7 w-7 text-text-400" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-text-200">Search MFLIX</h2>
            <p className="mt-1 text-sm text-text-400">
              Find movies, TV shows, and more
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-brand-500" />
        </div>
      )}
    </div>
  );
};
