"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Info, Play } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { TitleSummaryWithImages } from "@/lib/tmdb/presentation";
import type { TitleVideo } from "@/lib/tmdb/types";
import { cn } from "@/lib/utils";

function youtubeEmbedUrl(key: string) {
  const url = new URL("https://www.youtube-nocookie.com/embed/" + key);
  url.searchParams.set("autoplay", "1");
  url.searchParams.set("mute", "1");
  url.searchParams.set("controls", "0");
  url.searchParams.set("playsinline", "1");
  url.searchParams.set("loop", "1");
  url.searchParams.set("playlist", key);
  url.searchParams.set("rel", "0");
  url.searchParams.set("modestbranding", "1");
  url.searchParams.set("iv_load_policy", "3");
  return url.toString();
}

export function Billboard({
  hero,
  trailer
}: {
  hero: TitleSummaryWithImages;
  trailer: TitleVideo | null;
}) {
  const reduceMotion = useReducedMotion();
  const showTrailer = Boolean(trailer?.key && trailer?.site?.toLowerCase() === "youtube") && !reduceMotion;

  return (
    <section className="relative">
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="relative h-[70vh] min-h-[520px] max-h-[760px]">
          {showTrailer ? (
            <iframe
              key={trailer?.key}
              className="absolute inset-0 h-full w-full scale-[1.12] opacity-80"
              src={youtubeEmbedUrl(trailer!.key)}
              title={trailer?.name ?? "Trailer"}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen={false}
            />
          ) : (
            <Image
              src={hero.backdropSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/40 to-black/0" />
          <div className="absolute inset-0 bg-gradient-to-t from-mflix-bg via-mflix-bg/30 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_25%_15%,rgba(229,9,20,0.20),transparent_62%)]" />
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1280px] px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="max-w-[680px]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="danger">Featured</Badge>
                {hero.year ? <Badge>{hero.year}</Badge> : null}
                <Badge tone="info">{Math.round(hero.rating * 10)}% Match</Badge>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                {hero.name}
              </h1>
              <p className={cn("mt-3 line-clamp-3 text-sm text-white/75 sm:text-base")}>
                {hero.overview || "A premium streaming experience powered by TMDB."}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <ButtonLink
                  href={`/title/${hero.mediaType}/${hero.id}#trailer`}
                  variant="primary"
                  size="lg"
                  aria-label="Play trailer"
                >
                  <Play className="size-5" />
                  Play Trailer
                </ButtonLink>
                <ButtonLink
                  href={`/title/${hero.mediaType}/${hero.id}`}
                  variant="secondary"
                  size="lg"
                  aria-label="More info"
                >
                  <Info className="size-5" />
                  More Info
                </ButtonLink>
              </div>

              <p className="mt-5 text-xs text-white/45">
                Tip: Use keyboard Tab to explore cards, Enter to open details.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

