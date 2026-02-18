"use client";

import { Trash2, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button, buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Tag } from "@/components/ui/tag";
import { useToast } from "@/components/providers/toast-provider";
import { useAnalytics } from "@/hooks/use-analytics";
import { useAppHydrated } from "@/hooks/use-app-hydrated";
import { type AppProfile, useAppStore } from "@/lib/store/app-store";

const AVATAR_OPTIONS = ["🎬", "🍿", "🎧", "📺", "🧠", "🌟", "🚀", "🎯"] as const;

export const ProfilesPageView = () => {
  const hydrated = useAppHydrated();
  const profiles = useAppStore((state) => state.profiles);
  const activeProfileId = useAppStore((state) => state.activeProfileId);
  const setActiveProfile = useAppStore((state) => state.setActiveProfile);
  const createProfile = useAppStore((state) => state.createProfile);
  const removeProfile = useAppStore((state) => state.removeProfile);
  const updateProfile = useAppStore((state) => state.updateProfile);

  const { success, info } = useToast();
  const { trackEvent } = useAnalytics();

  const [isModalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<(typeof AVATAR_OPTIONS)[number]>("🎬");
  const [isKids, setIsKids] = useState(false);
  const [maturity, setMaturity] = useState<AppProfile["maturity"]>("13+");

  const canCreateProfile = useMemo(() => name.trim().length >= 2, [name]);

  const createNewProfile = () => {
    if (!canCreateProfile) {
      return;
    }

    const profileId = createProfile({
      name: name.trim(),
      avatar,
      isKids,
      maturity: isKids ? "13+" : maturity,
    });

    setActiveProfile(profileId);
    setModalOpen(false);
    setName("");
    setAvatar("🎬");
    setIsKids(false);
    setMaturity("13+");
    success("Profile created", "You can switch profiles anytime.");
    trackEvent("profile_created", { profileId });
  };

  if (!hydrated) {
    return (
      <main className="app-shell pb-16 pt-24">
        <Card className="h-40 animate-pulse" />
      </main>
    );
  }

  return (
    <main className="app-shell space-y-8 pb-16 pt-20 md:pt-24">
      <section className="space-y-3">
        <Tag>Profiles</Tag>
        <h1 className="font-display text-3xl font-semibold text-text-50 md:text-5xl">Who&apos;s watching?</h1>
        <p className="max-w-2xl text-sm text-text-200 md:text-base">
          Create profiles for family members, set maturity preferences, and personalize avatars.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {profiles.map((profile) => {
          const isActive = profile.id === activeProfileId;
          return (
            <Card key={profile.id} className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setActiveProfile(profile.id);
                  success("Profile selected", profile.name);
                  trackEvent("profile_selected", { profileId: profile.id });
                }}
                className="w-full text-left"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-4xl">{profile.avatar}</span>
                  {isActive ? <Tag className="border-brand-500/50 bg-brand-500/20 text-white">Active</Tag> : null}
                </div>
                <h2 className="line-clamp-1 text-lg font-semibold text-text-50">{profile.name}</h2>
                <p className="mt-1 text-xs text-text-400">
                  {profile.isKids ? "Kids profile" : "Standard profile"} · Maturity {profile.maturity}
                </p>
              </button>

              <div className="flex items-center gap-2">
                <select
                  value={profile.maturity}
                  onChange={(event) =>
                    updateProfile(profile.id, { maturity: event.target.value as AppProfile["maturity"] })
                  }
                  className="w-full rounded-lg border border-white/15 bg-surface-900 px-2 py-1.5 text-xs text-text-50"
                >
                  <option value="all">All</option>
                  <option value="13+">13+</option>
                  <option value="18+">18+</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    removeProfile(profile.id);
                    info("Profile removed", profile.name);
                  }}
                  disabled={profiles.length <= 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-text-400 transition hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`Delete ${profile.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </section>

      <div>
        <button type="button" className={buttonClassName({ size: "lg" })} onClick={() => setModalOpen(true)}>
          <UserPlus className="h-5 w-5" />
          Add Profile
        </button>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Create profile"
        description="Add another profile for family members or friends."
      >
        <div className="space-y-4">
          <label className="block space-y-1">
            <span className="text-xs uppercase tracking-wide text-text-400">Profile name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-white/15 bg-surface-900 px-3 py-2 text-sm text-text-50"
              placeholder="Enter a name"
            />
          </label>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-text-400">Avatar</p>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAvatar(option)}
                  className={`rounded-lg border px-3 py-2 text-xl ${
                    avatar === option ? "border-brand-400 bg-brand-500/20" : "border-white/15 bg-surface-900"
                  }`}
                  aria-label={`Select avatar ${option}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-text-200">
            <input
              type="checkbox"
              checked={isKids}
              onChange={(event) => setIsKids(event.target.checked)}
              className="h-4 w-4 rounded border-white/30 bg-surface-900"
            />
            Kids mode
          </label>

          {!isKids ? (
            <label className="block space-y-1">
              <span className="text-xs uppercase tracking-wide text-text-400">Maturity level</span>
              <select
                value={maturity}
                onChange={(event) => setMaturity(event.target.value as AppProfile["maturity"])}
                className="w-full rounded-lg border border-white/15 bg-surface-900 px-3 py-2 text-sm text-text-50"
              >
                <option value="all">All</option>
                <option value="13+">13+</option>
                <option value="18+">18+</option>
              </select>
            </label>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createNewProfile} disabled={!canCreateProfile}>
              Create Profile
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
};
