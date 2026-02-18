"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { MediaItem, MediaType } from "@/types/media";
import type {
  ContinueWatchingItem,
  MflixStoreState,
  Preferences,
  Profile,
} from "@/types/user";

const DEFAULT_PROFILES: Profile[] = [
  {
    id: "profile-main",
    name: "You",
    avatar: "🎬",
    maturity: "all",
  },
  {
    id: "profile-kids",
    name: "Kids",
    avatar: "🧸",
    maturity: "kids",
  },
];

const DEFAULT_PREFERENCES: Preferences = {
  language: "en-US",
  maturityFilter: "all",
  autoplayTrailers: true,
  autoplayNextEpisode: true,
  subtitlesEnabled: false,
  subtitleLanguage: "en",
  themeIntensity: "cinema",
  volume: 1,
};

const MAX_CONTINUE_WATCHING_ITEMS = 30;

const createProfileId = () => `profile-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const isSameMedia = (
  item: { id: number; mediaType: MediaType },
  target: { id: number; mediaType: MediaType },
) => item.id === target.id && item.mediaType === target.mediaType;

const dedupeMyList = (items: MediaItem[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.mediaType}-${item.id}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const dedupeContinueWatching = (items: ContinueWatchingItem[]) => {
  const map = new Map<string, ContinueWatchingItem>();
  items.forEach((item) => {
    const key = `${item.mediaType}-${item.id}`;
    const existing = map.get(key);
    if (!existing || existing.lastPlayedAt < item.lastPlayedAt) {
      map.set(key, item);
    }
  });

  return Array.from(map.values())
    .sort((a, b) => b.lastPlayedAt - a.lastPlayedAt)
    .slice(0, MAX_CONTINUE_WATCHING_ITEMS);
};

export const useMflixStore = create<MflixStoreState>()(
  persist(
    (set, get) => ({
      profiles: DEFAULT_PROFILES,
      selectedProfileId: DEFAULT_PROFILES[0].id,
      myList: [],
      continueWatching: [],
      preferences: DEFAULT_PREFERENCES,
      setSelectedProfile: (id) =>
        set((state) => ({
          selectedProfileId: state.profiles.some((profile) => profile.id === id)
            ? id
            : state.selectedProfileId,
        })),
      createProfile: (name, avatar, maturity) =>
        set((state) => ({
          profiles: [
            ...state.profiles,
            {
              id: createProfileId(),
              name,
              avatar,
              maturity,
            },
          ],
        })),
      removeProfile: (id) =>
        set((state) => {
          const nextProfiles = state.profiles.filter((profile) => profile.id !== id);
          if (nextProfiles.length === 0) {
            return state;
          }

          return {
            profiles: nextProfiles,
            selectedProfileId:
              state.selectedProfileId === id ? nextProfiles[0].id : state.selectedProfileId,
          };
        }),
      addToMyList: (item) =>
        set((state) => ({
          myList: dedupeMyList([item, ...state.myList]),
        })),
      removeFromMyList: (id, mediaType) =>
        set((state) => ({
          myList: state.myList.filter((item) => !isSameMedia(item, { id, mediaType })),
        })),
      toggleMyList: (item) => {
        const exists = get().myList.some((saved) => isSameMedia(saved, item));
        if (exists) {
          set((state) => ({
            myList: state.myList.filter((saved) => !isSameMedia(saved, item)),
          }));
          return false;
        }

        set((state) => ({
          myList: dedupeMyList([item, ...state.myList]),
        }));
        return true;
      },
      updatePreferences: (changes) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...changes,
          },
        })),
      upsertProgress: (entry) =>
        set((state) => ({
          continueWatching: dedupeContinueWatching([entry, ...state.continueWatching]),
        })),
      clearProgress: (id, mediaType) =>
        set((state) => ({
          continueWatching: state.continueWatching.filter(
            (item) => !isSameMedia(item, { id, mediaType }),
          ),
        })),
    }),
    {
      name: "mflix-store-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profiles: state.profiles,
        selectedProfileId: state.selectedProfileId,
        myList: state.myList,
        continueWatching: state.continueWatching,
        preferences: state.preferences,
      }),
    },
  ),
);
