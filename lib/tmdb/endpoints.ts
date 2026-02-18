import type { MediaType } from "@/lib/tmdb/types";

export type TmdbEndpoint = {
  path: string;
  query?: Record<string, string | number | boolean | null | undefined>;
};

const DEFAULT_LANGUAGE = "en-US";

export const tmdbEndpoints = {
  trendingAllDay(): TmdbEndpoint {
    return {
      path: "/trending/all/day",
      query: { language: DEFAULT_LANGUAGE }
    };
  },
  trendingAllWeek(): TmdbEndpoint {
    return {
      path: "/trending/all/week",
      query: { language: DEFAULT_LANGUAGE }
    };
  },
  popularMovies(): TmdbEndpoint {
    return { path: "/movie/popular", query: { language: DEFAULT_LANGUAGE, page: 1 } };
  },
  popularTv(): TmdbEndpoint {
    return { path: "/tv/popular", query: { language: DEFAULT_LANGUAGE, page: 1 } };
  },
  topRated(): TmdbEndpoint {
    return { path: "/movie/top_rated", query: { language: DEFAULT_LANGUAGE, page: 1 } };
  },
  upcoming(): TmdbEndpoint {
    return { path: "/movie/upcoming", query: { language: DEFAULT_LANGUAGE, page: 1 } };
  },
  nowPlaying(): TmdbEndpoint {
    return { path: "/movie/now_playing", query: { language: DEFAULT_LANGUAGE, page: 1 } };
  },
  titleDetails(mediaType: MediaType, id: number): TmdbEndpoint {
    const append = [
      "videos",
      "images",
      "credits",
      "similar",
      "recommendations"
    ].join(",");
    return {
      path: `/${mediaType}/${id}`,
      query: {
        language: DEFAULT_LANGUAGE,
        append_to_response: append,
        include_image_language: "en,null"
      }
    };
  },
  titleVideos(mediaType: MediaType, id: number): TmdbEndpoint {
    return {
      path: `/${mediaType}/${id}/videos`,
      query: { language: DEFAULT_LANGUAGE }
    };
  }
};

