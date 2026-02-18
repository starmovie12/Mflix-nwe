"use client";

import { Bell, Globe2, MonitorCog, Shield, SlidersHorizontal } from "lucide-react";

import { Accordion } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { useToast } from "@/components/providers/toast-provider";
import { useAnalytics } from "@/hooks/use-analytics";
import { useAppHydrated } from "@/hooks/use-app-hydrated";
import { type AppPreferences, useAppStore } from "@/lib/store/app-store";

const LANGUAGE_OPTIONS = [
  { value: "en-US", label: "English (US)" },
  { value: "hi-IN", label: "Hindi" },
  { value: "es-ES", label: "Spanish" },
  { value: "fr-FR", label: "French" },
];

const updateBoolPreference =
  (
    updatePreferences: (updates: Partial<AppPreferences>) => void,
    key: keyof Pick<AppPreferences, "autoplay" | "autoplayNext" | "subtitlesEnabled" | "reducedMotion" | "muted">,
  ) =>
  (checked: boolean) => {
    updatePreferences({ [key]: checked });
  };

export const AccountPageView = () => {
  const hydrated = useAppHydrated();
  const preferences = useAppStore((state) => state.preferences);
  const updatePreferences = useAppStore((state) => state.updatePreferences);
  const activeProfile = useAppStore((state) =>
    state.profiles.find((profile) => profile.id === state.activeProfileId) ?? null,
  );
  const { success } = useToast();
  const { trackEvent } = useAnalytics();

  const saveAndTrack = (updates: Partial<AppPreferences>) => {
    updatePreferences(updates);
    success("Preferences saved", "Your settings were updated.");
    trackEvent("preferences_updated", updates);
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
        <Tag>Account & Settings</Tag>
        <h1 className="font-display text-3xl font-semibold text-text-50 md:text-5xl">Manage your experience</h1>
        <p className="max-w-3xl text-sm text-text-200 md:text-base">
          Configure language, accessibility, autoplay, subtitles, and playback controls for{" "}
          <span className="font-semibold text-text-50">{activeProfile?.name ?? "current profile"}</span>.
        </p>
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        <Card className="space-y-2">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-brand-400" />
            <h2 className="font-medium text-text-50">Language</h2>
          </div>
          <select
            value={preferences.language}
            onChange={(event) => saveAndTrack({ language: event.target.value })}
            className="w-full rounded-lg border border-white/15 bg-surface-900 px-3 py-2 text-sm text-text-50"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand-400" />
            <h2 className="font-medium text-text-50">Maturity Filter</h2>
          </div>
          <select
            value={preferences.maturityFilter}
            onChange={(event) => saveAndTrack({ maturityFilter: event.target.value as AppPreferences["maturityFilter"] })}
            className="w-full rounded-lg border border-white/15 bg-surface-900 px-3 py-2 text-sm text-text-50"
          >
            <option value="all">All</option>
            <option value="13+">13+</option>
            <option value="18+">18+</option>
          </select>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center gap-2">
            <MonitorCog className="h-4 w-4 text-brand-400" />
            <h2 className="font-medium text-text-50">Theme Intensity</h2>
          </div>
          <select
            value={preferences.themeIntensity}
            onChange={(event) => saveAndTrack({ themeIntensity: event.target.value as AppPreferences["themeIntensity"] })}
            className="w-full rounded-lg border border-white/15 bg-surface-900 px-3 py-2 text-sm text-text-50"
          >
            <option value="soft">Soft</option>
            <option value="cinema">Cinema</option>
            <option value="vivid">Vivid</option>
          </select>
        </Card>
      </section>

      <Accordion
        defaultOpenId="playback"
        items={[
          {
            id: "playback",
            title: "Playback preferences",
            content: (
              <div className="grid gap-3 md:grid-cols-2">
                <ToggleRow
                  label="Autoplay trailers"
                  checked={preferences.autoplay}
                  onChange={updateBoolPreference(updatePreferences, "autoplay")}
                />
                <ToggleRow
                  label="Autoplay next episode"
                  checked={preferences.autoplayNext}
                  onChange={updateBoolPreference(updatePreferences, "autoplayNext")}
                />
                <ToggleRow
                  label="Muted by default"
                  checked={preferences.muted}
                  onChange={updateBoolPreference(updatePreferences, "muted")}
                />
                <label className="space-y-1">
                  <span className="text-xs uppercase tracking-wide text-text-400">Default volume</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={preferences.volume}
                    onChange={(event) => updatePreferences({ volume: Number(event.target.value) })}
                    className="w-full accent-brand-500"
                  />
                </label>
              </div>
            ),
          },
          {
            id: "subtitles",
            title: "Subtitle and accessibility options",
            content: (
              <div className="grid gap-3 md:grid-cols-2">
                <ToggleRow
                  label="Subtitles enabled"
                  checked={preferences.subtitlesEnabled}
                  onChange={updateBoolPreference(updatePreferences, "subtitlesEnabled")}
                />
                <ToggleRow
                  label="Reduce motion"
                  checked={preferences.reducedMotion}
                  onChange={updateBoolPreference(updatePreferences, "reducedMotion")}
                />
                <label className="space-y-1">
                  <span className="text-xs uppercase tracking-wide text-text-400">Subtitle language</span>
                  <select
                    value={preferences.subtitleLanguage}
                    onChange={(event) => updatePreferences({ subtitleLanguage: event.target.value })}
                    className="w-full rounded-lg border border-white/15 bg-surface-900 px-3 py-2 text-sm text-text-50"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                  </select>
                </label>
              </div>
            ),
          },
          {
            id: "notifications",
            title: "Notification preferences",
            content: (
              <div className="grid gap-3 md:grid-cols-2">
                <Card className="border border-white/10 p-3">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-brand-400" />
                    <p className="text-sm text-text-200">Upcoming reminder architecture ready</p>
                  </div>
                </Card>
                <Card className="border border-white/10 p-3">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-brand-400" />
                    <p className="text-sm text-text-200">
                      Event hooks available for analytics and push integrations.
                    </p>
                  </div>
                </Card>
              </div>
            ),
          },
        ]}
      />
    </main>
  );
};

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleRow = ({ label, checked, onChange }: ToggleRowProps) => (
  <label className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
    <span className="text-sm text-text-200">{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="h-4 w-4 rounded border-white/30 bg-surface-900"
    />
  </label>
);
