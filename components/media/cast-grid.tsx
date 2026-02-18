import Image from "next/image";

import { SectionShell } from "@/components/ui/section-shell";
import { FALLBACK_IMAGES } from "@/lib/constants";
import { getTmdbImageUrl } from "@/lib/tmdb/images";
import type { CastMember } from "@/types/media";

interface CastGridProps {
  cast: CastMember[];
  maxItems?: number;
}

export const CastGrid = ({ cast, maxItems = 12 }: CastGridProps) => {
  if (cast.length === 0) return null;

  const sortedCast = [...cast]
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .slice(0, maxItems);

  return (
    <SectionShell title="Cast">
      <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-6">
        {sortedCast.map((member) => (
          <div
            key={member.id}
            className="group w-28 shrink-0 md:w-auto"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/[0.08] bg-surface-800 transition-all duration-300 group-hover:border-white/15 group-hover:shadow-card">
              <Image
                src={getTmdbImageUrl(member.profilePath, "w342", FALLBACK_IMAGES.poster)}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 28vw, (max-width: 1200px) 16vw, 140px"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2.5 pt-8">
                <p className="line-clamp-1 text-xs font-semibold text-white">{member.name}</p>
                {member.character && (
                  <p className="line-clamp-1 text-[10px] text-text-400 mt-0.5">{member.character}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
};
