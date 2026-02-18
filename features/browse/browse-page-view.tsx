import Link from "next/link";

import { MediaRow } from "@/components/media/media-row";
import { buttonClassName } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { BrowsePageData } from "@/lib/tmdb/service";

interface BrowsePageViewProps {
  title: string;
  description: string;
  retryHref: string;
  data: BrowsePageData;
}

export const BrowsePageView = ({
  title,
  description,
  retryHref,
  data,
}: BrowsePageViewProps) => {
  if (!data.hasData) {
    return (
      <div className="pb-16 pt-28">
        <EmptyState
          title={`${title} is loading`}
          description={
            data.errorMessage ??
            "Could not load this section right now. Please retry in a moment."
          }
          action={
            <Link href={retryHref} className={buttonClassName({ variant: "secondary" })}>
              Retry
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16 pt-24 md:space-y-12">
      <section className="glass-surface rounded-2xl p-6 md:p-8">
        <h1 className="font-display text-3xl font-semibold text-text-50 md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-text-200 md:text-base">{description}</p>
      </section>
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
