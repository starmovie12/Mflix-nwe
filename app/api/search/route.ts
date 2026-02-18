import { NextResponse } from "next/server";

import { mapListItemToMedia } from "@/lib/tmdb/mappers";
import { tmdbRequest } from "@/lib/tmdb/client";
import { tmdbEndpoints } from "@/lib/tmdb/endpoints";
import { tmdbPaginatedListSchema } from "@/lib/tmdb/types";
import type { SearchItem } from "@/types/search";

const parsePage = (value: string | null) => {
  if (!value) {
    return 1;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const page = parsePage(searchParams.get("page"));

  if (query.length < 2) {
    return NextResponse.json({
      query,
      page,
      totalPages: 0,
      items: [],
    });
  }

  try {
    const response = await tmdbRequest({
      endpoint: tmdbEndpoints.multiSearch(query, page),
      schema: tmdbPaginatedListSchema,
    });

    const items = response.results.reduce<SearchItem[]>((accumulator, item) => {
      if (item.media_type === "person") {
        const extra = item as Record<string, unknown>;
        const profilePathValue = extra.profile_path;
        const knownForDepartmentValue = extra.known_for_department;

        accumulator.push({
          kind: "person",
          value: {
            id: item.id,
            mediaType: "person",
            name: item.name ?? item.title ?? "Unknown person",
            profilePath: typeof profilePathValue === "string" ? profilePathValue : null,
            knownForDepartment:
              typeof knownForDepartmentValue === "string" ? knownForDepartmentValue : null,
          },
        });
        return accumulator;
      }

      const mappedMedia = mapListItemToMedia(item);
      if (mappedMedia) {
        accumulator.push({
          kind: "media",
          value: mappedMedia,
        });
      }

      return accumulator;
    }, []);

    return NextResponse.json({
      query,
      page: response.page,
      totalPages: response.total_pages,
      items,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search unavailable";
    return NextResponse.json({ message }, { status: 500 });
  }
}
