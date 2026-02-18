"use client";

import Link from "next/link";

import { MediaCard } from "@/components/media/media-card";
import { buttonClassName } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useHydrated } from "@/hooks/use-hydrated";
import { useMflixStore } from "@/hooks/use-mflix-store";

export const MyListPageView = () => {
  const hydrated = useHydrated();
  const myList = useMflixStore((state) => state.myList);
  const selectedProfileId = useMflixStore((state) => state.selectedProfileId);
  const profiles = useMflixStore((state) => state.profiles);

  const currentProfile = profiles.find((profile) => profile.id === selectedProfileId) ?? null;

  if (!hydrated) {
    return (
      <div className="pb-16 pt-24">
        <div className="glass-surface rounded-2xl p-8 text-sm text-text-300">
          Loading your list...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 pt-24">
      <section className="glass-surface rounded-2xl p-6 md:p-8">
        <h1 className="font-display text-3xl font-semibold text-text-50 md:text-4xl">My List</h1>
        <p className="mt-2 text-sm text-text-300">
          {currentProfile
            ? `${currentProfile.avatar} ${currentProfile.name}'s saved titles`
            : "Your saved titles"}
        </p>
      </section>

      {myList.length === 0 ? (
        <EmptyState
          title="No saved titles yet"
          description="Add titles from cards or detail pages and they will show up here instantly."
          action={
            <Link href="/" className={buttonClassName({ variant: "secondary" })}>
              Explore Home
            </Link>
          }
        />
      ) : (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {myList.map((item) => (
            <MediaCard key={`${item.mediaType}-${item.id}`} item={item} variant="poster" />
          ))}
        </section>
      )}
    </div>
  );
};
