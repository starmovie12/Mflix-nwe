import type { MediaItem, SearchPerson } from "./media";

export type SearchTab = "all" | "movie" | "tv" | "person";

export interface SearchCatalogResponse {
  media: MediaItem[];
  people: SearchPerson[];
  hasData: boolean;
  errorMessage: string | null;
}
