"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PreferencesState {
  autoplay: boolean;
  reducedMotion: boolean;
  language: string;
  activeProfile: string;
  setAutoplay: (val: boolean) => void;
  setReducedMotion: (val: boolean) => void;
  setLanguage: (val: string) => void;
  setActiveProfile: (val: string) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      autoplay: true,
      reducedMotion: false,
      language: "en",
      activeProfile: "default",
      setAutoplay: (autoplay) => set({ autoplay }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setLanguage: (language) => set({ language }),
      setActiveProfile: (activeProfile) => set({ activeProfile }),
    }),
    { name: "mflix-preferences" }
  )
);
