"use client";

import Link from "next/link";
import { ListPlus } from "lucide-react";

import { MediaCard } from "@/components/media/media-card";
import { buttonClassName } from "@/components/ui/button";
import { useMyListStore } from "@/lib/stores/my-list-store";

export const MyListPageView = () => {
  const items = useMyListStore((state) => state.items);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10">
          <ListPlus className="h-8 w-8 text-text-400" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-text-50">Your List is Empty</h2>
          <p className="max-w-md text-sm text-text-400">
            Add movies and TV shows to your list by clicking the + button on any title.
          </p>
        </div>
        <Link href="/" className={buttonClassName({ variant: "secondary" })}>
          Browse Titles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 pt-24">
      <div>
        <h1 className="font-display text-3xl font-bold text-white md:text-4xl">My List</h1>
        <p className="mt-2 text-sm text-text-400">
          {items.length} title{items.length !== 1 ? "s" : ""} in your list
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item, index) => (
          <MediaCard key={`${item.mediaType}-${item.id}`} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};
