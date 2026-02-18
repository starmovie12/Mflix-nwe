import { NextResponse, type NextRequest } from "next/server";

import { hasTmdbApiKey } from "@/lib/env";
import { tmdbRequest } from "@/lib/tmdb/client";
import { tmdbEndpoints } from "@/lib/tmdb/endpoints";
import { mapPaginatedListToMedia } from "@/lib/tmdb/mappers";
import { tmdbPaginatedListSchema } from "@/lib/tmdb/types";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  const page = Number(request.nextUrl.searchParams.get("page")) || 1;

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], totalPages: 0 });
  }

  if (!hasTmdbApiKey()) {
    return NextResponse.json(
      { error: "TMDB API key not configured" },
      { status: 503 },
    );
  }

  try {
    const data = await tmdbRequest({
      endpoint: tmdbEndpoints.multiSearch(query, page),
      schema: tmdbPaginatedListSchema,
    });

    const results = mapPaginatedListToMedia(data);

    return NextResponse.json({
      results,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      page: data.page,
    });
  } catch {
    return NextResponse.json(
      { error: "Search failed. Please try again." },
      { status: 500 },
    );
  }
}
