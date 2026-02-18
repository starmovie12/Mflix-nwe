import type { Metadata } from "next";

import { CatalogPageView } from "@/features/catalog/catalog-page-view";
import { APP_NAME } from "@/lib/constants";
import { getMoviesPageData } from "@/lib/tmdb/service";

export const revalidate = 60 * 15;

export const metadata: Metadata = {
  title: `Movies | ${APP_NAME}`,
  description: "Browse popular, top-rated, and now-playing movies on MFLIX.",
};

export default async function MoviesPage() {
  const data = await getMoviesPageData();

  return (
    <CatalogPageView
      title="Movies"
      description="Explore trending, top-rated, and upcoming films with a cinematic browsing experience."
      data={data}
    />
  );
}
