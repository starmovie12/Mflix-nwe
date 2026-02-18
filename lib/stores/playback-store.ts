import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlaybackProgress {
  id: number;
  mediaType: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  currentTime: number;
  duration: number;
  lastWatched: number;
}

interface PlaybackState {
  progress: Record<string, PlaybackProgress>;
  volume: number;
  isMuted: boolean;
  playbackSpeed: number;
  autoplayNext: boolean;

  saveProgress: (entry: PlaybackProgress) => void;
  getProgress: (id: number, mediaType: string) => PlaybackProgress | null;
  getContinueWatching: () => PlaybackProgress[];
  clearProgress: (id: number, mediaType: string) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setAutoplayNext: (autoplay: boolean) => void;
}

const makeKey = (id: number, mediaType: string) => `${mediaType}-${id}`;

export const usePlaybackStore = create<PlaybackState>()(
  persist(
    (set, get) => ({
      progress: {},
      volume: 1,
      isMuted: false,
      playbackSpeed: 1,
      autoplayNext: true,

      saveProgress: (entry) => {
        const key = makeKey(entry.id, entry.mediaType);
        set((state) => ({
          progress: {
            ...state.progress,
            [key]: { ...entry, lastWatched: Date.now() },
          },
        }));
      },

      getProgress: (id, mediaType) => {
        const key = makeKey(id, mediaType);
        return get().progress[key] ?? null;
      },

      getContinueWatching: () =>
        Object.values(get().progress)
          .filter((p) => p.currentTime > 0 && p.currentTime / p.duration < 0.95)
          .sort((a, b) => b.lastWatched - a.lastWatched)
          .slice(0, 20),

      clearProgress: (id, mediaType) => {
        const key = makeKey(id, mediaType);
        set((state) => {
          const updated = { ...state.progress };
          delete updated[key];
          return { progress: updated };
        });
      },

      setVolume: (volume) => set({ volume }),
      setMuted: (isMuted) => set({ isMuted }),
      setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
      setAutoplayNext: (autoplayNext) => set({ autoplayNext }),
    }),
    {
      name: "mflix-playback",
    },
  ),
);
