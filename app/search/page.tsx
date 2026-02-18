import type { Metadata } from "next";

import { SearchPageView } from "@/features/search/search-page-view";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Search | ${APP_NAME}`,
  description: "Search for movies, TV shows, and more on MFLIX.",
};

export default function SearchPage() {
  return (
    <main className="app-shell">
      <SearchPageView />
    </main>
  );
}
