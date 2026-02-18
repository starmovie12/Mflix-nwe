import type { Metadata } from "next";

import { BrowsePageView } from "@/features/browse/browse-page-view";
import { APP_NAME } from "@/lib/constants";
import { getMoviesPageData } from "@/lib/tmdb/service";

export const metadata: Metadata = {
  title: "Movies",
  description: `Browse trending, top-rated, and upcoming movies on ${APP_NAME}.`,
};

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  const data = await getMoviesPageData();

  return (
    <main className="app-shell">
      <BrowsePageView
        title="Movies"
        description="Explore the biggest blockbusters, critically acclaimed picks, and fresh releases."
        retryHref="/movies"
        data={data}
      />
    </main>
  );
}
