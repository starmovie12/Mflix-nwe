import { Billboard } from "@/components/hero/Billboard";
import { TitleRail } from "@/components/rails/TitleRail";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/empty/ErrorState";
import { getHomePageData, getTitleTrailer } from "@/lib/tmdb/api";
import { withTitleImages } from "@/lib/tmdb/presentation";
import type { TitleVideo } from "@/lib/tmdb/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  try {
    const { hero, rails } = await getHomePageData();

    const heroWithImages = hero ? withTitleImages(hero) : null;
    const trailer: TitleVideo | null =
      hero ? await getTitleTrailer(hero.mediaType, hero.id) : null;

    return (
      <div>
        {heroWithImages ? <Billboard hero={heroWithImages} trailer={trailer} /> : null}

        <div className="relative -mt-10 pb-6 sm:-mt-14 sm:pb-10">
          {rails.map((rail) => (
            <TitleRail
              key={rail.id}
              title={rail.title}
              items={rail.items.map(withTitleImages)}
            />
          ))}
        </div>

        <Container className="pb-12">
          <div className="rounded-2xl border border-white/10 bg-white/4 p-6 text-sm text-white/65">
            <p className="font-medium text-white/80">About this demo</p>
            <p className="mt-2">
              MFLIX is a premium OTT UI/UX build. Data is fetched server-side from TMDB with
              runtime validation, retries, and revalidation caching.
            </p>
          </div>
        </Container>
      </div>
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error.";
    return (
      <Container className="py-12">
        <ErrorState
          title="MFLIX couldn’t load TMDB data."
          description={message}
          hint={
            <div className="space-y-2">
              <p>
                Create a <code className="rounded bg-white/10 px-1.5 py-0.5">.env.local</code>{" "}
                file with:
              </p>
              <pre className="overflow-x-auto rounded-xl bg-black/40 p-4 text-xs text-white/80 ring-1 ring-white/10">
{`TMDB_API_KEY=YOUR_KEY
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
NEXT_PUBLIC_APP_NAME=MFLIX`}
              </pre>
              <p>Then restart the dev server.</p>
            </div>
          }
        />
      </Container>
    );
  }
}

