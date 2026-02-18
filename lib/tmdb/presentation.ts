import "server-only";

import { tmdbImageUrl } from "@/lib/tmdb/image";
import type { TitleSummary } from "@/lib/tmdb/types";

export type TitleSummaryWithImages = TitleSummary & {
  posterSrc: string;
  backdropSrc: string;
};

export function withTitleImages(title: TitleSummary): TitleSummaryWithImages {
  return {
    ...title,
    posterSrc: tmdbImageUrl(title.posterPath, "w500") ?? "/placeholders/poster.svg",
    backdropSrc: tmdbImageUrl(title.backdropPath, "w1280") ?? "/placeholders/backdrop.svg"
  };
}

