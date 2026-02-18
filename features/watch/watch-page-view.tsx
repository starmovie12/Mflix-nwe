import Link from "next/link";

import { MediaRow } from "@/components/media/media-row";
import { buttonClassName } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { WatchPlayer } from "@/features/watch/watch-player";
import type { MediaDetail } from "@/types/media";

interface WatchPageViewProps {
  detail: MediaDetail | null;
}

export const WatchPageView = ({ detail }: WatchPageViewProps) => {
  if (!detail) {
    return (
      <div className="pb-16 pt-28">
        <EmptyState
          title="Playback unavailable"
          description="We could not load this title for playback right now."
          action={
            <Link href="/" className={buttonClassName({ variant: "secondary" })}>
              Back to Home
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 pt-20 md:pt-24">
      <div className="flex items-center justify-between gap-4">
        <h1 className="line-clamp-1 font-display text-2xl font-semibold text-text-50 md:text-3xl">
          {detail.title}
        </h1>
        <Link href={`/title/${detail.mediaType}/${detail.id}`} className={buttonClassName({ variant: "ghost" })}>
          Details
        </Link>
      </div>

      <WatchPlayer detail={detail} />

      {detail.recommendations.length > 0 ? (
        <MediaRow title="Up Next" items={detail.recommendations} variant="poster" />
      ) : null}
    </div>
  );
};
