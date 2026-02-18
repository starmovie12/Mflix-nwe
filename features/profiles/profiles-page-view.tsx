"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { usePreferencesStore } from "@/lib/stores/preferences-store";

const AVATAR_OPTIONS = ["👤", "😎", "🦸", "🧑‍💻", "🎬", "🌟", "🎭", "🐱", "🦊", "🐼", "🎮", "🧒"];

export const ProfilesPageView = () => {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const {
    profiles,
    activeProfileId,
    setActiveProfile,
    addProfile,
    removeProfile,
    updateProfile,
  } = usePreferencesStore();

  const [isEditing, setIsEditing] = useState(false);
  const [showNewProfile, setShowNewProfile] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState("👤");
  const [newIsKids, setNewIsKids] = useState(false);

  const handleSelectProfile = (id: string) => {
    if (isEditing) return;
    setActiveProfile(id);
    router.push("/");
  };

  const handleAddProfile = () => {
    if (!newName.trim()) return;
    const id = `profile-${Date.now()}`;
    addProfile({
      id,
      name: newName.trim(),
      avatar: newAvatar,
      isKids: newIsKids,
      maturityRating: newIsKids ? "pg13" : "all",
    });
    setNewName("");
    setNewAvatar("👤");
    setNewIsKids(false);
    setShowNewProfile(false);
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 pb-16 pt-24">
      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
          Who&apos;s Watching?
        </h1>
        <p className="mt-2 text-sm text-text-400">Select your profile to continue</p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-6">
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
            className="group relative"
          >
            <button
              type="button"
              onClick={() => handleSelectProfile(profile.id)}
              className={cn(
                "flex w-28 flex-col items-center gap-3 rounded-xl p-3 transition-all md:w-32",
                activeProfileId === profile.id && !isEditing
                  ? "ring-2 ring-brand-500"
                  : "hover:bg-white/5",
              )}
            >
              <div
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-xl text-4xl transition-transform md:h-24 md:w-24",
                  profile.isKids
                    ? "bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-blue-500/20"
                    : "bg-gradient-to-br from-surface-700 to-surface-800 border border-white/10",
                  !isEditing && "group-hover:scale-105",
                )}
              >
                {profile.avatar}
              </div>
              <span className="text-sm font-medium text-text-200 group-hover:text-white transition">
                {profile.name}
              </span>
              {profile.isKids && (
                <span className="text-[10px] font-bold text-blue-400 uppercase">Kids</span>
              )}
            </button>

            {isEditing && profile.id !== "default" && (
              <button
                type="button"
                onClick={() => removeProfile(profile.id)}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-white shadow-glow-sm transition hover:bg-brand-400"
                aria-label={`Delete ${profile.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </motion.div>
        ))}

        {profiles.length < 5 && (
          <motion.button
            type="button"
            onClick={() => setShowNewProfile(true)}
            initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ delay: profiles.length * 0.08 }}
            className="flex w-28 flex-col items-center gap-3 rounded-xl p-3 transition hover:bg-white/5 md:w-32"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-white/20 text-text-400 transition hover:border-white/40 md:h-24 md:w-24">
              <Plus className="h-8 w-8" />
            </div>
            <span className="text-sm font-medium text-text-400">Add Profile</span>
          </motion.button>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          variant={isEditing ? "primary" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit3 className="h-4 w-4" />
          {isEditing ? "Done" : "Manage Profiles"}
        </Button>
      </div>

      {showNewProfile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-surface-strong w-full max-w-sm rounded-2xl p-6 space-y-4"
        >
          <h3 className="font-display text-lg font-semibold text-white">New Profile</h3>

          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Profile name"
            className="h-11 w-full rounded-xl border border-white/10 bg-surface-800 px-4 text-sm text-white placeholder:text-text-400 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            maxLength={20}
          />

          <div>
            <p className="mb-2 text-xs font-medium text-text-300">Choose Avatar</p>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setNewAvatar(av)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg text-xl transition",
                    newAvatar === av
                      ? "bg-brand-500/20 ring-2 ring-brand-500"
                      : "bg-white/5 hover:bg-white/10",
                  )}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-text-200 cursor-pointer">
            <input
              type="checkbox"
              checked={newIsKids}
              onChange={(e) => setNewIsKids(e.target.checked)}
              className="accent-brand-500"
            />
            Kids Profile
          </label>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleAddProfile} disabled={!newName.trim()}>
              Create
            </Button>
            <Button variant="ghost" onClick={() => setShowNewProfile(false)}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
