"use client";

import { motion, useReducedMotion } from "framer-motion";

import { MediaRow } from "@/components/media/media-row";
import type { MediaRail } from "@/types/media";

interface BrowsePageViewProps {
  title: string;
  description: string;
  rails: MediaRail[];
}

export const BrowsePageView = ({ title, description, rails }: BrowsePageViewProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-8 pb-16 pt-24 md:space-y-12">
      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-3xl font-bold text-white md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-text-400 md:text-base">{description}</p>
      </motion.div>

      {rails.map((rail, index) => (
        <motion.div
          key={rail.id}
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.3) }}
        >
          <MediaRow title={rail.title} items={rail.items} variant={rail.variant ?? "poster"} />
        </motion.div>
      ))}
    </div>
  );
};
