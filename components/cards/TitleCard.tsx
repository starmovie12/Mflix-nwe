"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import type { TitleSummaryWithImages } from "@/lib/tmdb/presentation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export function TitleCard({
  item,
  variant = "poster",
  priority = false
}: {
  item: TitleSummaryWithImages;
  variant?: "poster" | "backdrop";
  priority?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const href = `/title/${item.mediaType}/${item.id}`;
  const ratio = variant === "poster" ? "aspect-[2/3]" : "aspect-[16/9]";
  const src = variant === "poster" ? item.posterSrc : item.backdropSrc;

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -6, scale: 1.02 }}
      whileFocus={reduceMotion ? undefined : { y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 420, damping: 28, mass: 0.7 }}
      className="group"
    >
      <Link
        href={href}
        className={cn(
          "block rounded-2xl ring-1 ring-white/10 bg-mflix-surface shadow-soft-lg",
          "overflow-hidden focus-ring"
        )}
        aria-label={`${item.name} details`}
      >
        <div className={cn("relative", ratio)}>
          <Image
            src={src}
            alt=""
            fill
            priority={priority}
            sizes={variant === "poster" ? "(max-width: 768px) 45vw, 220px" : "(max-width: 768px) 80vw, 420px"}
            className="object-cover transition duration-300 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/0 opacity-90" />

          <div className="absolute inset-x-0 bottom-0 p-3">
            <div className="flex flex-wrap items-center gap-2">
              {item.year ? <Badge>{item.year}</Badge> : null}
              <Badge tone="info">{Math.round(item.rating * 10)}% Match</Badge>
            </div>
            <div className="mt-2 line-clamp-2 text-sm font-semibold text-white/95">
              {item.name}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

