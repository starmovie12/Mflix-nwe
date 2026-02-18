"use client";

import { useMemo } from "react";

import { useHydrated } from "@/hooks/use-hydrated";
import { useMflixStore } from "@/hooks/use-mflix-store";

const PreferenceToggle = ({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) => (
  <label className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-surface-900 p-4">
    <div>
      <p className="text-sm font-semibold text-text-50">{title}</p>
      <p className="mt-1 text-xs text-text-400">{description}</p>
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="mt-1 h-4 w-4 accent-brand-500"
      aria-label={title}
    />
  </label>
);

export const AccountPageView = () => {
  const hydrated = useHydrated();
  const profiles = useMflixStore((state) => state.profiles);
  const selectedProfileId = useMflixStore((state) => state.selectedProfileId);
  const setSelectedProfile = useMflixStore((state) => state.setSelectedProfile);
  const preferences = useMflixStore((state) => state.preferences);
  const updatePreferences = useMflixStore((state) => state.updatePreferences);

  const activeProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedProfileId) ?? null,
    [profiles, selectedProfileId],
  );

  if (!hydrated) {
    return (
      <div className="pb-16 pt-24">
        <div className="glass-surface rounded-2xl p-8 text-sm text-text-300">
          Loading account preferences...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 pt-24">
      <section className="glass-surface rounded-2xl p-6 md:p-8">
        <h1 className="font-display text-3xl font-semibold text-text-50 md:text-4xl">Account</h1>
        <p className="mt-2 text-sm text-text-300">
          Manage playback, language, subtitle, and profile preferences.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="glass-surface rounded-2xl p-6">
          <h2 className="section-title">Profile Selection</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-sm text-text-300">
              Active profile
              <select
                value={selectedProfileId}
                onChange={(event) => setSelectedProfile(event.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-surface-800 px-3 py-2 text-sm text-text-50 outline-none focus:border-brand-400"
              >
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.avatar} {profile.name}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-xs text-text-400">
              Current maturity: {activeProfile?.maturity === "kids" ? "Kids Mode" : "All Audiences"}
            </p>
          </div>
        </article>

        <article className="glass-surface rounded-2xl p-6">
          <h2 className="section-title">Playback</h2>
          <div className="mt-4 space-y-3">
            <PreferenceToggle
              title="Autoplay trailers"
              description="Play hero trailers automatically while browsing."
              checked={preferences.autoplayTrailers}
              onChange={(next) => updatePreferences({ autoplayTrailers: next })}
            />
            <PreferenceToggle
              title="Autoplay next episode"
              description="Automatically continue to the next episode in watch mode."
              checked={preferences.autoplayNextEpisode}
              onChange={(next) => updatePreferences({ autoplayNextEpisode: next })}
            />
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="glass-surface rounded-2xl p-6">
          <h2 className="section-title">Language & Subtitles</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-sm text-text-300">
              Interface language
              <select
                value={preferences.language}
                onChange={(event) => updatePreferences({ language: event.target.value })}
                className="mt-1 w-full rounded-xl border border-white/15 bg-surface-800 px-3 py-2 text-sm text-text-50 outline-none focus:border-brand-400"
              >
                <option value="en-US">English</option>
                <option value="hi-IN">Hindi</option>
                <option value="es-ES">Spanish</option>
              </select>
            </label>

            <label className="block text-sm text-text-300">
              Subtitle language
              <select
                value={preferences.subtitleLanguage}
                onChange={(event) => updatePreferences({ subtitleLanguage: event.target.value })}
                className="mt-1 w-full rounded-xl border border-white/15 bg-surface-800 px-3 py-2 text-sm text-text-50 outline-none focus:border-brand-400"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
              </select>
            </label>

            <PreferenceToggle
              title="Subtitles enabled"
              description="Enable subtitles by default in watch mode."
              checked={preferences.subtitlesEnabled}
              onChange={(next) => updatePreferences({ subtitlesEnabled: next })}
            />
          </div>
        </article>

        <article className="glass-surface rounded-2xl p-6">
          <h2 className="section-title">Theme & Safety</h2>
          <div className="mt-4 space-y-3">
            <label className="block text-sm text-text-300">
              Theme intensity
              <select
                value={preferences.themeIntensity}
                onChange={(event) =>
                  updatePreferences({ themeIntensity: event.target.value as "cinema" | "soft" })
                }
                className="mt-1 w-full rounded-xl border border-white/15 bg-surface-800 px-3 py-2 text-sm text-text-50 outline-none focus:border-brand-400"
              >
                <option value="cinema">Cinema (High contrast)</option>
                <option value="soft">Soft (Reduced intensity)</option>
              </select>
            </label>

            <label className="block text-sm text-text-300">
              Maturity filter
              <select
                value={preferences.maturityFilter}
                onChange={(event) =>
                  updatePreferences({ maturityFilter: event.target.value as "all" | "kids" })
                }
                className="mt-1 w-full rounded-xl border border-white/15 bg-surface-800 px-3 py-2 text-sm text-text-50 outline-none focus:border-brand-400"
              >
                <option value="all">All Audiences</option>
                <option value="kids">Kids-safe</option>
              </select>
            </label>
          </div>
        </article>
      </section>
    </div>
  );
};
