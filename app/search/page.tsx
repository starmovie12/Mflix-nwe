import type { Metadata } from "next";

import { SearchPageView } from "@/features/search/search-page-view";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Search",
  description: `Search movies, TV shows, and people on ${APP_NAME}.`,
};

export default function SearchPage() {
  return (
    <main className="app-shell">
      <SearchPageView />
    </main>
  );
}
