import type { MediaItem, MediaType } from "@/types/media";

export interface PersonSearchItem {
  id: number;
  mediaType: "person";
  name: string;
  profilePath: string | null;
  knownForDepartment: string | null;
}

export type SearchItem =
  | {
      kind: "media";
      value: MediaItem;
    }
  | {
      kind: "person";
      value: PersonSearchItem;
    };

export interface SearchResponsePayload {
  query: string;
  page: number;
  totalPages: number;
  items: SearchItem[];
}

export type SearchFilterMediaType = "all" | MediaType | "person";
