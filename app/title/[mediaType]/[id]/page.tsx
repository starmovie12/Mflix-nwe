import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { z } from "zod";
import { Play } from "lucide-react";

import { TitleRail } from "@/components/rails/TitleRail";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getTitleDetails } from "@/lib/tmdb/api";
import { withTitleImages } from "@/lib/tmdb/presentation";
import { tmdbImageUrl } from "@/lib/tmdb/image";
import { MediaTypeSchema } from "@/lib/tmdb/types";

function youtubeEmbedUrl(key: string) {
  const url = new URL("https://www.youtube-nocookie.com/embed/" + key);
  url.searchParams.set("autoplay", "0");
  url.searchParams.set("mute", "0");
  url.searchParams.set("controls", "1");
  url.searchParams.set("playsinline", "1");
  url.searchParams.set("rel", "0");
  url.searchParams.set("modestbranding", "1");
  return url.toString();
}

type PageParams = { mediaType: string; id: string };

function parseParams(params: PageParams) {
  const mediaType = MediaTypeSchema.safeParse(params.mediaType);
  const id = z.coerce.number().int().positive().safeParse(params.id);
  if (!mediaType.success || !id.success) return null;
  return { mediaType: mediaType.data, id: id.data };
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const parsed = parseParams(params);
  if (!parsed) return { title: "Title" };

  try {
    const details = await getTitleDetails(parsed.mediaType, parsed.id);
    const ogImage =
      tmdbImageUrl(details.backdropPath, "w1280") ??
      tmdbImageUrl(details.posterPath, "w780") ??
      undefined;

    return {
      title: details.name,
      description: details.overview?.slice(0, 180) ?? "Title details on MFLIX.",
      openGraph: ogImage
        ? {
            title: details.name,
            description: details.overview ?? "",
            images: [{ url: ogImage }]
          }
        : undefined,
      twitter: ogImage
        ? { card: "summary_large_image", title: details.name, images: [ogImage] }
        : undefined
    };
  } catch {
    return { title: "Title" };
  }
}

export default async function TitleDetailPage({ params }: { params: PageParams }) {
  const parsed = parseParams(params);
  if (!parsed) notFound();

  const details = await getTitleDetails(parsed.mediaType, parsed.id);

  const posterSrc = tmdbImageUrl(details.posterPath, "w500") ?? "/placeholders/poster.svg";
  const backdropSrc =
    tmdbImageUrl(details.backdropPath, "w1280") ?? "/placeholders/backdrop.svg";

  return (
    <div>
      <section className="relative border-b border-white/10">
        <div className="relative h-[70vh] min-h-[560px] max-h-[820px] overflow-hidden">
          <Image
            src={backdropSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/0" />
          <div className="absolute inset-0 bg-gradient-to-t from-mflix-bg via-mflix-bg/30 to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-end">
          <Container className="pb-10 sm:pb-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] md:items-end">
              <div className="hidden md:block">
                <div className="relative aspect-[2/3] overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-soft-lg">
                  <Image
                    src={posterSrc}
                    alt=""
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="max-w-[760px]">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="danger">{details.mediaType === "movie" ? "Movie" : "TV"}</Badge>
                  {details.year ? <Badge>{details.year}</Badge> : null}
                  <Badge tone="info">{Math.round(details.rating * 10)}% Match</Badge>
                  {details.runtimeMinutes ? <Badge>{details.runtimeMinutes}m</Badge> : null}
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                  {details.name}
                </h1>
                {details.tagline ? (
                  <p className="mt-2 text-sm italic text-white/60">{details.tagline}</p>
                ) : null}
                <p className="mt-4 max-w-prose text-sm text-white/75 sm:text-base">
                  {details.overview || "No overview available."}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {details.genres.slice(0, 6).map((g) => (
                    <Badge key={g.id}>{g.name}</Badge>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {details.trailer?.site.toLowerCase() === "youtube" ? (
                    <ButtonLink href="#trailer" variant="primary" size="lg">
                      <Play className="size-5" />
                      Play Trailer
                    </ButtonLink>
                  ) : (
                    <ButtonLink href="/" variant="secondary" size="lg">
                      Back to Home
                    </ButtonLink>
                  )}
                  <ButtonLink href="/" variant="ghost" size="lg">
                    Browse more
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </section>

      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-10">
            <section id="trailer" className="scroll-mt-24">
              <SectionHeader title="Trailer" subtitle="Official videos from TMDB" />
              <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black/30">
                {details.trailer?.site.toLowerCase() === "youtube" ? (
                  <div className="relative aspect-video">
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={youtubeEmbedUrl(details.trailer.key)}
                      title={details.trailer.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="p-6 text-sm text-white/65">
                    No playable trailer available for this title.
                  </div>
                )}
              </div>
            </section>

            <section aria-label="Cast">
              <SectionHeader title="Cast" subtitle="Top billed cast" />
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {details.cast.slice(0, 12).map((p) => {
                  const profile =
                    tmdbImageUrl(p.profilePath, "w342") ?? "/placeholders/poster.svg";
                  return (
                    <div
                      key={p.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-3"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden rounded-xl ring-1 ring-white/10">
                        <Image
                          src={profile}
                          alt=""
                          fill
                          sizes="(max-width: 1024px) 40vw, 220px"
                          className="object-cover"
                        />
                      </div>
                      <div className="mt-3 text-sm font-semibold text-white/90 line-clamp-1">
                        {p.name}
                      </div>
                      <div className="mt-0.5 text-xs text-white/55 line-clamp-1">
                        {p.role ?? "—"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-10">
            <section aria-label="Crew highlights">
              <SectionHeader title="Crew" subtitle="Key roles" />
              <div className="mt-4 space-y-2">
                {details.crew.slice(0, 8).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white/90 line-clamp-1">
                        {p.name}
                      </div>
                      <div className="text-xs text-white/55">{p.role ?? "—"}</div>
                    </div>
                  </div>
                ))}
                {!details.crew.length ? (
                  <div className="text-sm text-white/60">No crew data available.</div>
                ) : null}
              </div>
            </section>

            <section aria-label="Gallery">
              <SectionHeader title="Gallery" subtitle="Backdrops and posters" />
              <div className="mt-4 grid grid-cols-2 gap-3">
                {details.gallery.backdrops.slice(0, 4).map((path) => {
                  const src = tmdbImageUrl(path, "w780") ?? "/placeholders/backdrop.svg";
                  return (
                    <div
                      key={path}
                      className="relative aspect-video overflow-hidden rounded-2xl ring-1 ring-white/10"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 46vw, 360px"
                        className="object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </Container>

      {details.similar.length ? (
        <TitleRail title="More Like This" items={details.similar.map(withTitleImages)} />
      ) : null}
      {details.recommendations.length ? (
        <TitleRail
          title="Recommended"
          items={details.recommendations.map(withTitleImages)}
        />
      ) : null}
    </div>
  );
}

