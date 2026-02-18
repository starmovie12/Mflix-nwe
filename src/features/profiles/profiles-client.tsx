"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/stores/preferences-store";

const DEFAULT_PROFILES = [
  { id: "default", name: "Main", avatar: "M", color: "bg-mflix-red", isKids: false },
  { id: "kids", name: "Kids", avatar: "K", color: "bg-blue-600", isKids: true },
  { id: "profile2", name: "Guest", avatar: "G", color: "bg-green-600", isKids: false },
];

export function ProfilesClient() {
  const router = useRouter();
  const setActiveProfile = usePreferencesStore((s) => s.setActiveProfile);
  const [editing, setEditing] = useState(false);

  const handleSelect = (profileId: string) => {
    if (editing) return;
    setActiveProfile(profileId);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl md:text-5xl font-medium text-white mb-8">
        Who&apos;s watching?
      </h1>

      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
        {DEFAULT_PROFILES.map((profile, i) => (
          <motion.button
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleSelect(profile.id)}
            className="group flex flex-col items-center gap-3"
          >
            <div
              className={cn(
                "relative w-24 h-24 md:w-32 md:h-32 rounded-md flex items-center justify-center text-3xl md:text-4xl font-bold text-white transition-all",
                profile.color,
                !editing && "group-hover:ring-4 group-hover:ring-white",
                editing && "opacity-70"
              )}
            >
              {profile.avatar}
              {editing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md">
                  <Pencil size={24} className="text-white" />
                </div>
              )}
            </div>
            <span
              className={cn(
                "text-sm text-mflix-gray-400 group-hover:text-white transition-colors",
                profile.isKids && "text-blue-400"
              )}
            >
              {profile.name}
            </span>
          </motion.button>
        ))}

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: DEFAULT_PROFILES.length * 0.1 }}
          className="group flex flex-col items-center gap-3"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-md border-2 border-mflix-gray-600 flex items-center justify-center group-hover:border-white transition-colors">
            <Plus size={40} className="text-mflix-gray-500 group-hover:text-white transition-colors" />
          </div>
          <span className="text-sm text-mflix-gray-400 group-hover:text-white transition-colors">
            Add Profile
          </span>
        </motion.button>
      </div>

      <button
        onClick={() => setEditing(!editing)}
        className={cn(
          "px-6 py-2 border text-sm tracking-wider transition-colors",
          editing
            ? "border-white text-white bg-white/10"
            : "border-mflix-gray-400 text-mflix-gray-400 hover:border-white hover:text-white"
        )}
      >
        {editing ? "DONE" : "MANAGE PROFILES"}
      </button>
    </div>
  );
}
