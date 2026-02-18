"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { useMflixStore } from "@/hooks/use-mflix-store";
import type { ProfileMaturity } from "@/types/user";

const AVATAR_OPTIONS = ["🎬", "🍿", "🧸", "🚀", "🦸", "🎧", "🐯", "🌙"] as const;

const createProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Profile name must have at least 2 characters.")
    .max(20, "Profile name must be at most 20 characters."),
  avatar: z.enum(AVATAR_OPTIONS),
  maturity: z.enum(["all", "kids"]),
});

type CreateProfileForm = z.infer<typeof createProfileSchema>;

export const ProfilesPageView = () => {
  const router = useRouter();
  const hydrated = useHydrated();
  const profiles = useMflixStore((state) => state.profiles);
  const selectedProfileId = useMflixStore((state) => state.selectedProfileId);
  const setSelectedProfile = useMflixStore((state) => state.setSelectedProfile);
  const createProfile = useMflixStore((state) => state.createProfile);
  const removeProfile = useMflixStore((state) => state.removeProfile);

  const form = useForm<CreateProfileForm>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      name: "",
      avatar: AVATAR_OPTIONS[0],
      maturity: "all",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    createProfile(values.name, values.avatar, values.maturity as ProfileMaturity);
    form.reset({
      name: "",
      avatar: values.avatar,
      maturity: values.maturity,
    });
  });

  if (!hydrated) {
    return (
      <div className="pb-16 pt-24">
        <div className="glass-surface rounded-2xl p-8 text-sm text-text-300">
          Loading profiles...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 pt-24">
      <section className="glass-surface rounded-2xl p-6 md:p-8">
        <h1 className="font-display text-3xl font-semibold text-text-50 md:text-4xl">Profiles</h1>
        <p className="mt-2 text-sm text-text-300">
          Pick who is watching and personalize maturity settings per profile.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {profiles.map((profile) => {
          const isSelected = profile.id === selectedProfileId;
          return (
            <article
              key={profile.id}
              className={`rounded-2xl border p-4 transition ${
                isSelected
                  ? "border-brand-400 bg-brand-500/10"
                  : "border-white/10 bg-surface-900 hover:border-white/20"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedProfile(profile.id);
                  router.push("/");
                }}
                className="w-full text-left"
              >
                <div className="mb-3 text-4xl">{profile.avatar}</div>
                <p className="text-base font-semibold text-text-50">{profile.name}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-text-400">
                  {profile.maturity === "kids" ? "Kids mode" : "All audiences"}
                </p>
              </button>
              {profiles.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeProfile(profile.id)}
                  className="mt-3 inline-flex items-center gap-1 text-xs text-text-300 transition hover:text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              ) : null}
            </article>
          );
        })}
      </section>

      <section className="glass-surface rounded-2xl p-6">
        <h2 className="section-title">Create Profile</h2>
        <form className="mt-4 space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm text-text-300">
            Name
            <input
              type="text"
              {...form.register("name")}
              className="mt-1 w-full rounded-xl border border-white/15 bg-surface-800 px-3 py-2 text-sm text-text-50 outline-none focus:border-brand-400"
              placeholder="Enter profile name"
            />
            {form.formState.errors.name ? (
              <span className="mt-1 block text-xs text-brand-400">
                {form.formState.errors.name.message}
              </span>
            ) : null}
          </label>

          <fieldset>
            <legend className="text-sm text-text-300">Avatar</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => form.setValue("avatar", emoji)}
                  className={`rounded-xl border px-3 py-2 text-2xl transition ${
                    form.watch("avatar") === emoji
                      ? "border-brand-400 bg-brand-500/10"
                      : "border-white/10 bg-surface-800"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm text-text-300">Maturity</legend>
            <div className="mt-2 flex gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-text-200">
                <input
                  type="radio"
                  value="all"
                  {...form.register("maturity")}
                  className="accent-brand-500"
                />
                All Audiences
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-text-200">
                <input
                  type="radio"
                  value="kids"
                  {...form.register("maturity")}
                  className="accent-brand-500"
                />
                Kids
              </label>
            </div>
          </fieldset>

          <Button type="submit" variant="secondary">
            <UserPlus className="h-4 w-4" />
            Add Profile
          </Button>
        </form>
      </section>
    </div>
  );
};
