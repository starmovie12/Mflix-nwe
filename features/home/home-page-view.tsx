"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { Billboard } from "@/components/media/billboard";
import { MediaRow } from "@/components/media/media-row";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonClassName } from "@/components/ui/button";
import type { HomePageData } from "@/lib/tmdb/service";

interface HomePageViewProps {
  data: HomePageData;
}

export const HomePageView = ({ data }: HomePageViewProps) => {
  const shouldReduceMotion = useReducedMotion();

  if (!data.hasData || !data.featured) {
    return (
      <div className="pb-16 pt-28">
        <EmptyState
          title="TMDB connection pending"
          description={
            data.errorMessage ??
            "Add TMDB credentials in local .env.local or your deployment environment variables to populate the cinematic homepage."
          }
          action={
            <Link href="/" className={buttonClassName({ variant: "secondary" })}>
              Retry
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 pt-0 md:space-y-12 md:pt-0">
      <Billboard item={data.featured} />

      {data.rails.map((rail, index) => (
        <motion.div
          key={rail.id}
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.5,
            delay: Math.min(index * 0.08, 0.3),
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <MediaRow
            title={rail.title}
            items={rail.items}
            variant={rail.variant === "top10" ? "top10" : rail.variant ?? "poster"}
          />
        </motion.div>
      ))}
    </div>
  );
};
