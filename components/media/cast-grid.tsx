import Image from "next/image";

import { SectionShell } from "@/components/ui/section-shell";
import { FALLBACK_IMAGES } from "@/lib/constants";
import { getTmdbImageUrl } from "@/lib/tmdb/images";
import type { CastMember } from "@/types/media";

interface CastGridProps {
  cast: CastMember[];
}

export const CastGrid = ({ cast }: CastGridProps) => {
  if (cast.length === 0) {
    return null;
  }

  return (
    <SectionShell title="Cast">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cast.slice(0, 10).map((member) => (
          <li key={member.id} className="glass-surface rounded-xl p-3">
            <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-lg">
              <Image
                src={getTmdbImageUrl(member.profilePath, "w342", FALLBACK_IMAGES.poster)}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 45vw, (max-width: 1200px) 24vw, 14vw"
                className="object-cover"
              />
            </div>
            <p className="line-clamp-1 text-sm font-semibold text-text-50">{member.name}</p>
            {member.character ? (
              <p className="line-clamp-1 text-xs text-text-400">{member.character}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
};
