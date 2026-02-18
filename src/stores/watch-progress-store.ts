"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WatchProgress, MediaType } from "@/types/app";

interface WatchProgressState {
  progress: Record<string, WatchProgress>;
  updateProgress: (entry: WatchProgress) => void;
  getProgress: (mediaId: number, mediaType: MediaType) => WatchProgress | null;
  removeProgress: (mediaId: number, mediaType: MediaType) => void;
  getContinueWatching: () => WatchProgress[];
}

function makeKey(mediaId: number, mediaType: MediaType): string {
  return `${mediaType}-${mediaId}`;
}

export const useWatchProgressStore = create<WatchProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      updateProgress: (entry) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [makeKey(entry.mediaId, entry.mediaType)]: entry,
          },
        })),
      getProgress: (mediaId, mediaType) =>
        get().progress[makeKey(mediaId, mediaType)] ?? null,
      removeProgress: (mediaId, mediaType) =>
        set((state) => {
          const { [makeKey(mediaId, mediaType)]: _removed, ...rest } = state.progress;
          void _removed;
          return { progress: rest };
        }),
      getContinueWatching: () => {
        const all = Object.values(get().progress);
        return all
          .filter((p) => p.progress > 0 && p.progress < p.duration * 0.95)
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 20);
      },
    }),
    { name: "mflix-watch-progress" }
  )
);
