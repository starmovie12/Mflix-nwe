import { describe, expect, it } from "vitest";

import { mapListItemToMedia } from "@/lib/tmdb/mappers";

describe("mapListItemToMedia", () => {
  it("maps movie payload to normalized media item", () => {
    const result = mapListItemToMedia({
      id: 42,
      media_type: "movie",
      title: "MFLIX Test Movie",
      overview: "Overview",
      poster_path: "/poster.jpg",
      backdrop_path: "/backdrop.jpg",
      release_date: "2024-01-01",
      vote_average: 7.3,
      genre_ids: [18, 80],
    });

    expect(result).toEqual({
      id: 42,
      mediaType: "movie",
      title: "MFLIX Test Movie",
      overview: "Overview",
      posterPath: "/poster.jpg",
      backdropPath: "/backdrop.jpg",
      releaseDate: "2024-01-01",
      voteAverage: 7.3,
      genreIds: [18, 80],
    });
  });

  it("returns null for unsupported media payload", () => {
    const result = mapListItemToMedia({
      id: 9,
      media_type: "person",
      name: "Actor name",
    });

    expect(result).toBeNull();
  });
});
