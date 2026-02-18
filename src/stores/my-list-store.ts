"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MediaItem } from "@/types/app";

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
      addItem: (item) =>
        set((state) => {
          if (state.items.some((i) => i.id === item.id && i.mediaType === item.mediaType)) {
            return state;
          }
          return { items: [item, ...state.items] };
        }),
      removeItem: (id, mediaType) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.mediaType === mediaType)
          ),
        })),
      isInList: (id, mediaType) =>
        get().items.some((i) => i.id === id && i.mediaType === mediaType),
      toggleItem: (item) => {
        const { isInList, addItem, removeItem } = get();
        if (isInList(item.id, item.mediaType)) {
          removeItem(item.id, item.mediaType);
        } else {
          addItem(item);
        }
      },
    }),
    { name: "mflix-my-list" }
  )
);
