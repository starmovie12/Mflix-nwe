"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { MediaCard } from "@/components/ui/media-card";
import { Button } from "@/components/ui/button";
import { useMyListStore } from "@/stores/my-list-store";

export function MyListClient() {
  const items = useMyListStore((s) => s.items);

  return (
    <div className="pt-20 md:pt-24 px-4 md:px-12 min-h-screen">
      <h1 className="text-fluid-2xl font-bold text-white mb-8">My List</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Bookmark size={48} className="mx-auto text-mflix-gray-600 mb-4" />
          <p className="text-xl text-mflix-gray-300 mb-2">
            Your list is empty
          </p>
          <p className="text-sm text-mflix-gray-500 mb-6">
            Add movies and TV shows to keep track of what you want to watch.
          </p>
          <Link href="/">
            <Button variant="primary">Browse Content</Button>
          </Link>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {items.map((item) => (
              <motion.div
                key={`${item.mediaType}-${item.id}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <MediaCard item={item} variant="poster" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
