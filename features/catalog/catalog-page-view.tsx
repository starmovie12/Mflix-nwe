import Link from "next/link";

import { Billboard } from "@/components/media/billboard";
import { MediaRow } from "@/components/media/media-row";
import { buttonClassName } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Tag } from "@/components/ui/tag";
import type { CatalogPageData } from "@/lib/tmdb/service";

interface CatalogPageViewProps {
  title: string;
  description: string;
  data: CatalogPageData;
}

export const CatalogPageView = ({ title, description, data }: CatalogPageViewProps) => {
  if (!data.hasData || !data.featured) {
    return (
      <main className="app-shell pb-16 pt-28">
        <EmptyState
          title={`${title} is currently unavailable`}
          description={data.errorMessage ?? "Please check your TMDB configuration and try again."}
          action={
            <Link href="/" className={buttonClassName({ variant: "secondary" })}>
              Back to Home
            </Link>
          }
        />
      </main>
    );
  }

  return (
    <main className="app-shell space-y-10 pb-16 pt-20 md:space-y-12 md:pt-24">
      <section className="space-y-3">
        <Tag>{title}</Tag>
        <h1 className="font-display text-3xl font-semibold text-text-50 md:text-5xl">{title}</h1>
        <p className="max-w-3xl text-sm text-text-200 md:text-base">{description}</p>
      </section>

      <Billboard item={data.featured} />

      {data.rails.map((rail, index) => (
        <MediaRow
          key={rail.id}
          title={rail.title}
          items={rail.items}
          variant={index === 0 ? "backdrop" : "poster"}
        />
      ))}
    </main>
  );
};
