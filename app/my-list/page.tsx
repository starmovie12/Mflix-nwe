import type { Metadata } from "next";

import { MyListPageView } from "@/features/list/my-list-page-view";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "My List",
  description: `Your saved movies and TV picks on ${APP_NAME}.`,
};

export default function MyListPage() {
  return (
    <main className="app-shell">
      <MyListPageView />
    </main>
  );
}
