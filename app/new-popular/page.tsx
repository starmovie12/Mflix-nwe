import type { Metadata } from "next";

import { CatalogPageView } from "@/features/catalog/catalog-page-view";
import { APP_NAME } from "@/lib/constants";
import { getNewPopularPageData } from "@/lib/tmdb/service";

export const revalidate = 60 * 10;

export const metadata: Metadata = {
  title: `New & Popular | ${APP_NAME}`,
  description: "Track what is new, trending, and coming soon on MFLIX.",
};

export default async function NewPopularPage() {
  const data = await getNewPopularPageData();

  return (
    <CatalogPageView
      title="New & Popular"
      description="Fresh releases, upcoming drops, and trending highlights updated throughout the day."
      data={data}
    />
  );
}
