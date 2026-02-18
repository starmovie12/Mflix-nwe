import type { Metadata } from "next";

import { CatalogPageView } from "@/features/catalog/catalog-page-view";
import { APP_NAME } from "@/lib/constants";
import { getTvPageData } from "@/lib/tmdb/service";

export const revalidate = 60 * 15;

export const metadata: Metadata = {
  title: `TV Shows | ${APP_NAME}`,
  description: "Stream-worthy TV picks including trending, airing today, and on-the-air series.",
};

export default async function TvPage() {
  const data = await getTvPageData();

  return (
    <CatalogPageView
      title="TV Shows"
      description="Discover trending series, airing episodes, and high-rated shows curated for binge sessions."
      data={data}
    />
  );
}
