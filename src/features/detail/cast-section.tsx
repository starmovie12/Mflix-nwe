"use client";

import Image from "next/image";
import { useState } from "react";
import { getProfileUrl } from "@/lib/tmdb/image";
import type { CastMember } from "@/types/app";

interface CastSectionProps {
  cast: CastMember[];
}

export function CastSection({ cast }: CastSectionProps) {
  if (!cast.length) return null;

  return (
    <section className="px-4 md:px-12 py-8">
      <h2 className="text-xl font-bold text-white mb-4">Cast</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4">
        {cast.map((member) => (
          <CastCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}

function CastCard({ member }: { member: CastMember }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex-shrink-0 w-[130px] group">
      <div className="relative w-[130px] h-[130px] rounded-lg overflow-hidden bg-mflix-gray-800">
        <Image
          src={imgError ? "/images/profile-placeholder.svg" : getProfileUrl(member.profilePath, "w185")}
          alt={member.name}
          fill
          className="object-cover object-top"
          sizes="130px"
          onError={() => setImgError(true)}
        />
      </div>
      <div className="mt-2">
        <p className="text-sm font-medium text-white truncate">{member.name}</p>
        <p className="text-xs text-mflix-gray-400 truncate">{member.character}</p>
      </div>
    </div>
  );
}
