import Link from "next/link";

import { Billboard } from "@/components/media/billboard";
import { MediaRow } from "@/components/media/media-row";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonClassName } from "@/components/ui/button";
import type { HomePageData } from "@/lib/tmdb/service";

interface HomePageViewProps {
  data: HomePageData;
}

export const HomePageView = ({ data }: HomePageViewProps) => {
  if (!data.hasData || !data.featured) {
    return (
      <div className="pb-16 pt-28">
        <EmptyState
          title="TMDB connection pending"
          description={
            data.errorMessage ??
            "Add TMDB credentials to .env.local to populate the cinematic homepage."
          }
          action={
            <Link href="/" className={buttonClassName({ variant: "secondary" })}>
              Retry
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16 pt-20 md:space-y-12 md:pt-24">
      <Billboard item={data.featured} />
      {data.rails.map((rail, index) => (
        <MediaRow
          key={rail.id}
          title={rail.title}
          items={rail.items}
          variant={index <= 1 ? "backdrop" : "poster"}
        />
      ))}
    </div>
  );
};
