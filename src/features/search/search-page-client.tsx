"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MediaCard } from "@/components/ui/media-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MediaItem } from "@/types/app";

interface SearchPageClientProps {
  initialQuery: string;
  initialResults: MediaItem[];
}

export function SearchPageClient({
  initialQuery,
  initialResults,
}: SearchPageClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(initialResults);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const performSearch = useCallback(
    (searchQuery: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!searchQuery.trim()) {
        setResults([]);
        router.replace("/search", { scroll: false });
        return;
      }

      setLoading(true);
      debounceRef.current = setTimeout(() => {
        router.replace(`/search?q=${encodeURIComponent(searchQuery)}`, {
          scroll: false,
        });
      }, 400);
    },
    [router]
  );

  useEffect(() => {
    setResults(initialResults);
    setLoading(false);
  }, [initialResults]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    router.replace("/search", { scroll: false });
    inputRef.current?.focus();
  };

  return (
    <div className="pt-20 md:pt-24 px-4 md:px-12 min-h-screen">
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-mflix-gray-400"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              performSearch(e.target.value);
            }}
            placeholder="Search for movies, TV shows, people..."
            className="w-full h-12 pl-12 pr-12 bg-mflix-gray-700 border border-mflix-gray-600 rounded-lg text-white placeholder:text-mflix-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
            aria-label="Search"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-mflix-gray-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-poster rounded-md" />
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-mflix-gray-300 mb-2">No results found</p>
          <p className="text-sm text-mflix-gray-500">
            Try adjusting your search to find what you&apos;re looking for.
          </p>
        </div>
      )}

      {!loading && !query && (
        <div className="text-center py-20">
          <Search size={48} className="mx-auto text-mflix-gray-600 mb-4" />
          <p className="text-xl text-mflix-gray-300">
            Start typing to search
          </p>
          <p className="text-sm text-mflix-gray-500 mt-2">
            Find movies, TV shows, and more
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!loading && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {results.map((item) => (
              <MediaCard
                key={`${item.mediaType}-${item.id}`}
                item={item}
                variant="poster"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
