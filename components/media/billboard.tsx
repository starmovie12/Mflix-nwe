import Image from "next/image";
import Link from "next/link";
import { Info, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonClassName } from "@/components/ui/button";
import { getBackdropUrl } from "@/lib/tmdb/images";
import type { MediaItem } from "@/types/media";

interface BillboardProps {
  item: MediaItem;
}

export const Billboard = ({ item }: BillboardProps) => (
  <section className="relative isolate overflow-hidden rounded-2xl border border-white/10 shadow-card">
    <Image
      src={getBackdropUrl(item.backdropPath, "w1280")}
      alt={item.title}
      fill
      priority
      sizes="(max-width: 1200px) 100vw, 1400px"
      className="object-cover"
    />
    <div className="absolute inset-0 bg-hero-fade" />
    <div className="absolute inset-0 bg-gradient-to-r from-surface-950/80 via-surface-950/30 to-transparent" />

    <div className="relative z-10 flex min-h-[68vh] flex-col justify-end gap-5 p-6 md:min-h-[72vh] md:p-10">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-brand-500/20 text-white">{item.mediaType.toUpperCase()}</Badge>
        {item.voteAverage > 0 ? <Badge>{item.voteAverage.toFixed(1)} Rating</Badge> : null}
      </div>

      <h1 className="max-w-2xl font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">
        {item.title}
      </h1>

      <p className="max-w-xl text-sm text-text-200 md:text-base">
        {item.overview || "Discover your next favorite title on MFLIX."}
      </p>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/watch/${item.mediaType}/${item.id}`}
          className={buttonClassName({ variant: "primary", size: "lg" })}
        >
          <Play className="h-5 w-5 fill-current" />
          Play
        </Link>
        <Link
          href={`/title/${item.mediaType}/${item.id}`}
          className={buttonClassName({ variant: "secondary", size: "lg" })}
        >
          <Info className="h-5 w-5" />
          More Info
        </Link>
      </div>
    </div>
  </section>
);
