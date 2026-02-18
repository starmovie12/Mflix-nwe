import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { MediaItem } from "@/types/media";

interface MyListState {
  items: MediaItem[];
  addItem: (item: MediaItem) => void;
  removeItem: (id: number, mediaType: string) => void;
  isInList: (id: number, mediaType: string) => boolean;
  toggleItem: (item: MediaItem) => void;
}

export const useMyListStore = create<MyListState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const exists = get().items.some(
          (i) => i.id === item.id && i.mediaType === item.mediaType,
        );
        if (!exists) {
          set((state) => ({ items: [item, ...state.items] }));
        }
      },

      removeItem: (id, mediaType) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.mediaType === mediaType),
          ),
        }));
      },

      isInList: (id, mediaType) =>
        get().items.some((i) => i.id === id && i.mediaType === mediaType),

      toggleItem: (item) => {
        const exists = get().isInList(item.id, item.mediaType);
        if (exists) {
          get().removeItem(item.id, item.mediaType);
        } else {
          get().addItem(item);
        }
      },
    }),
    {
      name: "mflix-my-list",
    },
  ),
);
