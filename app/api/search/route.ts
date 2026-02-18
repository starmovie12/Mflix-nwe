import { NextResponse } from "next/server";
import { z } from "zod";

import { searchCatalog } from "@/lib/tmdb/service";
import type { SearchTab } from "@/types/search";

const searchQuerySchema = z.object({
  q: z.string().default(""),
  tab: z.enum(["all", "movie", "tv", "person"]).default("all"),
});

export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryResult = searchQuerySchema.safeParse({
    q: searchParams.get("q") ?? "",
    tab: (searchParams.get("tab") as SearchTab | null) ?? "all",
  });

  if (!queryResult.success) {
    return NextResponse.json(
      {
        media: [],
        people: [],
        hasData: false,
        errorMessage: "Invalid search query.",
      },
      { status: 400 },
    );
  }

  const data = await searchCatalog(queryResult.data.q, queryResult.data.tab);
  return NextResponse.json(data);
}
