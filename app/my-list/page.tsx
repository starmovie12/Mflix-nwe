import type { Metadata } from "next";

import { MyListPageView } from "@/features/my-list/my-list-page-view";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `My List | ${APP_NAME}`,
  description: "Your saved titles and continue watching queue.",
};

export default function MyListPage() {
  return <MyListPageView />;
}
