"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { MediaItem, MediaType } from "@/types/media";

export type MaturityLevel = "all" | "13+" | "18+";
export type ThemeIntensity = "soft" | "cinema" | "vivid";

export interface AppProfile {
  id: string;
  name: string;
  avatar: string;
  maturity: MaturityLevel;
  isKids: boolean;
  createdAt: number;
}

export interface AppPreferences {
  language: string;
  maturityFilter: MaturityLevel;
  autoplay: boolean;
  autoplayNext: boolean;
  subtitlesEnabled: boolean;
  subtitleLanguage: string;
  themeIntensity: ThemeIntensity;
  reducedMotion: boolean;
  volume: number;
  muted: boolean;
}

export interface WatchlistItem extends MediaItem {
  addedAt: number;
}

export interface PlaybackItem {
  mediaId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  progress: number;
  duration: number;
  updatedAt: number;
}

const DEFAULT_PREFERENCES: AppPreferences = {
  language: "en-US",
  maturityFilter: "all",
  autoplay: true,
  autoplayNext: true,
  subtitlesEnabled: false,
  subtitleLanguage: "en",
  themeIntensity: "cinema",
  reducedMotion: false,
  volume: 0.9,
  muted: false,
};

const createDefaultProfile = (): AppProfile => ({
  id: "profile-main",
  name: "Main",
  avatar: "🎬",
  maturity: "18+",
  isKids: false,
  createdAt: Date.now(),
});

interface AppStoreState {
  hydrated: boolean;
  profiles: AppProfile[];
  activeProfileId: string;
  preferences: AppPreferences;
  watchlistByProfile: Record<string, WatchlistItem[]>;
  playbackByProfile: Record<string, PlaybackItem[]>;
}

interface AppStoreActions {
  setHydrated: () => void;
  setActiveProfile: (profileId: string) => void;
  createProfile: (input: Omit<AppProfile, "id" | "createdAt">) => string;
  updateProfile: (profileId: string, updates: Partial<Omit<AppProfile, "id" | "createdAt">>) => void;
  removeProfile: (profileId: string) => void;
  updatePreferences: (updates: Partial<AppPreferences>) => void;
  addToWatchlist: (item: MediaItem) => void;
  removeFromWatchlist: (mediaType: MediaType, mediaId: number) => void;
  toggleWatchlist: (item: MediaItem) => boolean;
  isInWatchlist: (mediaType: MediaType, mediaId: number) => boolean;
  getActiveWatchlist: () => WatchlistItem[];
  savePlayback: (item: Omit<PlaybackItem, "updatedAt">) => void;
  getPlaybackForTitle: (mediaType: MediaType, mediaId: number) => PlaybackItem | null;
  getContinueWatching: () => PlaybackItem[];
}

type AppStore = AppStoreState & AppStoreActions;

const getInitialState = (): AppStoreState => {
  const mainProfile = createDefaultProfile();
  return {
    hydrated: false,
    profiles: [mainProfile],
    activeProfileId: mainProfile.id,
    preferences: DEFAULT_PREFERENCES,
    watchlistByProfile: {
      [mainProfile.id]: [],
    },
    playbackByProfile: {
      [mainProfile.id]: [],
    },
  };
};

const clampProgress = (value: number) => {
  if (Number.isNaN(value) || value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...getInitialState(),
      setHydrated: () => {
        set({ hydrated: true });
      },
      setActiveProfile: (profileId) => {
        set((state) => {
          const profileExists = state.profiles.some((profile) => profile.id === profileId);
          if (!profileExists) {
            return state;
          }

          return {
            activeProfileId: profileId,
            watchlistByProfile: {
              ...state.watchlistByProfile,
              [profileId]: state.watchlistByProfile[profileId] ?? [],
            },
            playbackByProfile: {
              ...state.playbackByProfile,
              [profileId]: state.playbackByProfile[profileId] ?? [],
            },
          };
        });
      },
      createProfile: (input) => {
        const newProfileId = `profile-${crypto.randomUUID()}`;
        set((state) => ({
          profiles: [
            ...state.profiles,
            {
              id: newProfileId,
              createdAt: Date.now(),
              ...input,
            },
          ],
          watchlistByProfile: {
            ...state.watchlistByProfile,
            [newProfileId]: [],
          },
          playbackByProfile: {
            ...state.playbackByProfile,
            [newProfileId]: [],
          },
        }));

        return newProfileId;
      },
      updateProfile: (profileId, updates) => {
        set((state) => ({
          profiles: state.profiles.map((profile) =>
            profile.id === profileId ? { ...profile, ...updates } : profile,
          ),
        }));
      },
      removeProfile: (profileId) => {
        set((state) => {
          if (state.profiles.length <= 1) {
            return state;
          }

          const nextProfiles = state.profiles.filter((profile) => profile.id !== profileId);
          const nextActiveProfileId =
            state.activeProfileId === profileId ? nextProfiles[0]?.id ?? state.activeProfileId : state.activeProfileId;

          const { [profileId]: deletedWatchlist, ...nextWatchlistByProfile } = state.watchlistByProfile;
          const { [profileId]: deletedPlayback, ...nextPlaybackByProfile } = state.playbackByProfile;
          void deletedWatchlist;
          void deletedPlayback;

          return {
            profiles: nextProfiles,
            activeProfileId: nextActiveProfileId,
            watchlistByProfile: nextWatchlistByProfile,
            playbackByProfile: nextPlaybackByProfile,
          };
        });
      },
      updatePreferences: (updates) => {
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        }));
      },
      addToWatchlist: (item) => {
        set((state) => {
          const profileId = state.activeProfileId;
          const current = state.watchlistByProfile[profileId] ?? [];
          const exists = current.some((entry) => entry.mediaType === item.mediaType && entry.id === item.id);
          if (exists) {
            return state;
          }

          return {
            watchlistByProfile: {
              ...state.watchlistByProfile,
              [profileId]: [{ ...item, addedAt: Date.now() }, ...current],
            },
          };
        });
      },
      removeFromWatchlist: (mediaType, mediaId) => {
        set((state) => {
          const profileId = state.activeProfileId;
          const current = state.watchlistByProfile[profileId] ?? [];
          return {
            watchlistByProfile: {
              ...state.watchlistByProfile,
              [profileId]: current.filter((entry) => !(entry.mediaType === mediaType && entry.id === mediaId)),
            },
          };
        });
      },
      toggleWatchlist: (item) => {
        const existing = get().isInWatchlist(item.mediaType, item.id);
        if (existing) {
          get().removeFromWatchlist(item.mediaType, item.id);
          return false;
        }

        get().addToWatchlist(item);
        return true;
      },
      isInWatchlist: (mediaType, mediaId) => {
        const state = get();
        const profileId = state.activeProfileId;
        const watchlist = state.watchlistByProfile[profileId] ?? [];
        return watchlist.some((entry) => entry.mediaType === mediaType && entry.id === mediaId);
      },
      getActiveWatchlist: () => {
        const state = get();
        return state.watchlistByProfile[state.activeProfileId] ?? [];
      },
      savePlayback: (item) => {
        set((state) => {
          const profileId = state.activeProfileId;
          const current = state.playbackByProfile[profileId] ?? [];
          const progress = clampProgress(item.progress);
          const nextItem: PlaybackItem = {
            ...item,
            progress,
            updatedAt: Date.now(),
          };

          const filtered = current.filter(
            (entry) => !(entry.mediaId === item.mediaId && entry.mediaType === item.mediaType),
          );

          return {
            playbackByProfile: {
              ...state.playbackByProfile,
              [profileId]: [nextItem, ...filtered].slice(0, 30),
            },
          };
        });
      },
      getPlaybackForTitle: (mediaType, mediaId) => {
        const state = get();
        const entries = state.playbackByProfile[state.activeProfileId] ?? [];
        return entries.find((entry) => entry.mediaType === mediaType && entry.mediaId === mediaId) ?? null;
      },
      getContinueWatching: () => {
        const state = get();
        const entries = state.playbackByProfile[state.activeProfileId] ?? [];
        return entries
          .filter((entry) => entry.progress > 0.02 && entry.progress < 0.98)
          .sort((a, b) => b.updatedAt - a.updatedAt);
      },
    }),
    {
      name: "mflix-app-store-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
        preferences: state.preferences,
        watchlistByProfile: state.watchlistByProfile,
        playbackByProfile: state.playbackByProfile,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
