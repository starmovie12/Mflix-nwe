"use client";

import { useAppStore } from "@/lib/store/app-store";

export const useAppHydrated = () => useAppStore((state) => state.hydrated);
