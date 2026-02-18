import type { MediaItem, MediaType } from "./media";

export type ProfileMaturity = "all" | "kids";

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  maturity: ProfileMaturity;
}

export interface ContinueWatchingItem {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  progress: number;
  duration: number;
  lastPlayedAt: number;
}

export interface Preferences {
  language: string;
  maturityFilter: ProfileMaturity;
  autoplayTrailers: boolean;
  autoplayNextEpisode: boolean;
  subtitlesEnabled: boolean;
  subtitleLanguage: string;
  themeIntensity: "cinema" | "soft";
  volume: number;
}

export interface MflixStoreState {
  profiles: Profile[];
  selectedProfileId: string;
  myList: MediaItem[];
  continueWatching: ContinueWatchingItem[];
  preferences: Preferences;
  setSelectedProfile: (id: string) => void;
  createProfile: (name: string, avatar: string, maturity: ProfileMaturity) => void;
  removeProfile: (id: string) => void;
  addToMyList: (item: MediaItem) => void;
  removeFromMyList: (id: number, mediaType: MediaType) => void;
  toggleMyList: (item: MediaItem) => boolean;
  updatePreferences: (changes: Partial<Preferences>) => void;
  upsertProgress: (item: ContinueWatchingItem) => void;
  clearProgress: (id: number, mediaType: MediaType) => void;
}
