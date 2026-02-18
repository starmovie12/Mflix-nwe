import type { Metadata } from "next";

import { BrowsePageView } from "@/features/browse/browse-page-view";
import { APP_NAME } from "@/lib/constants";
import { getTvPageData } from "@/lib/tmdb/service";

export const metadata: Metadata = {
  title: "TV Shows",
  description: `Discover trending and on-air TV shows on ${APP_NAME}.`,
};

export const dynamic = "force-dynamic";

export default async function TvPage() {
  const data = await getTvPageData();

  return (
    <main className="app-shell">
      <BrowsePageView
        title="TV Shows"
        description="Catch the hottest ongoing series, today's airings, and fan favorites."
        retryHref="/tv"
        data={data}
      />
    </main>
  );
}
