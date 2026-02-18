import { HomePageView } from "@/features/home/home-page-view";
import { getHomePageData } from "@/lib/tmdb/service";

export const revalidate = 60 * 15;

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <main className="app-shell">
      <HomePageView data={data} />
    </main>
  );
}
