"use client";

import { Check, Plus } from "lucide-react";
import { useMemo } from "react";

import { useMflixStore } from "@/hooks/use-mflix-store";
import type { MediaItem } from "@/types/media";

interface MyListToggleButtonProps {
  item: MediaItem;
}

export const MyListToggleButton = ({ item }: MyListToggleButtonProps) => {
  const myList = useMflixStore((state) => state.myList);
  const toggleMyList = useMflixStore((state) => state.toggleMyList);

  const isInList = useMemo(
    () => myList.some((saved) => saved.id === item.id && saved.mediaType === item.mediaType),
    [item.id, item.mediaType, myList],
  );

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleMyList(item);
      }}
      aria-label={isInList ? `Remove ${item.title} from My List` : `Add ${item.title} to My List`}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition hover:border-brand-400 hover:text-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
    >
      {isInList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  );
};
