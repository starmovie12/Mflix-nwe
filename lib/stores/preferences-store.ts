import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Profile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
  maturityRating: "all" | "pg13" | "r";
}

const DEFAULT_PROFILES: Profile[] = [
  { id: "default", name: "User", avatar: "👤", isKids: false, maturityRating: "all" },
  { id: "kids", name: "Kids", avatar: "🧒", isKids: true, maturityRating: "pg13" },
];

interface PreferencesState {
  profiles: Profile[];
  activeProfileId: string;
  language: string;
  autoplay: boolean;
  subtitleLanguage: string;

  getActiveProfile: () => Profile;
  setActiveProfile: (id: string) => void;
  addProfile: (profile: Profile) => void;
  removeProfile: (id: string) => void;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
  setLanguage: (lang: string) => void;
  setAutoplay: (autoplay: boolean) => void;
  setSubtitleLanguage: (lang: string) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      profiles: DEFAULT_PROFILES,
      activeProfileId: "default",
      language: "en",
      autoplay: true,
      subtitleLanguage: "off",

      getActiveProfile: () => {
        const state = get();
        return state.profiles.find((p) => p.id === state.activeProfileId) ?? state.profiles[0];
      },

      setActiveProfile: (id) => set({ activeProfileId: id }),

      addProfile: (profile) =>
        set((state) => ({
          profiles: [...state.profiles, profile],
        })),

      removeProfile: (id) => {
        if (id === "default") return;
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
          activeProfileId: state.activeProfileId === id ? "default" : state.activeProfileId,
        }));
      },

      updateProfile: (id, updates) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        })),

      setLanguage: (language) => set({ language }),
      setAutoplay: (autoplay) => set({ autoplay }),
      setSubtitleLanguage: (subtitleLanguage) => set({ subtitleLanguage }),
    }),
    {
      name: "mflix-preferences",
    },
  ),
);
