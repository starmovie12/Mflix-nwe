"use client";

import { DetailHero } from "./detail-hero";
import { CastSection } from "./cast-section";
import { SeasonSection } from "./season-section";
import { TrailerSection } from "./trailer-section";
import { DetailInfo } from "./detail-info";
import { ContentRow } from "@/components/ui/content-row";
import type { MediaDetails } from "@/types/app";

interface DetailPageClientProps {
  details: MediaDetails;
}

export function DetailPageClient({ details }: DetailPageClientProps) {
  return (
    <div>
      <DetailHero details={details} />

      <div className="-mt-8 relative z-10">
        <DetailInfo details={details} />

        <CastSection cast={details.cast} />

        {details.mediaType === "tv" && details.seasons && (
          <SeasonSection
            seasons={details.seasons}
            showTitle={details.title}
          />
        )}

        <TrailerSection videos={details.videos} title={details.title} />

        {details.similar.length > 0 && (
          <ContentRow
            title="More Like This"
            items={details.similar}
            variant="poster"
          />
        )}

        {details.recommendations.length > 0 && (
          <ContentRow
            title="Recommendations"
            items={details.recommendations}
            variant="backdrop"
          />
        )}
      </div>
    </div>
  );
}
