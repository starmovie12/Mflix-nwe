export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "MFLIX";

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
] as const;

export const FALLBACK_IMAGES = {
  poster: "/images/poster-placeholder.svg",
  backdrop: "/images/backdrop-placeholder.svg",
} as const;
