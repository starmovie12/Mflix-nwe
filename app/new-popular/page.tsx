import type { Metadata } from "next";

import { BrowsePageView } from "@/features/browse/browse-page-view";
import { APP_NAME } from "@/lib/constants";
import { getNewPopularPageData } from "@/lib/tmdb/service";

export const metadata: Metadata = {
  title: "New & Popular",
  description: `Stay ahead with fresh and trending releases on ${APP_NAME}.`,
};

export const dynamic = "force-dynamic";

export default async function NewPopularPage() {
  const data = await getNewPopularPageData();

  return (
    <main className="app-shell">
      <BrowsePageView
        title="New & Popular"
        description="Track what's new this week and what everyone is watching right now."
        retryHref="/new-popular"
        data={data}
      />
    </main>
  );
}
