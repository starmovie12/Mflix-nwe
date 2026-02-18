"use client";

import { Globe, MonitorPlay, Subtitles, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/ui/section-shell";
import { cn } from "@/lib/cn";
import { usePlaybackStore } from "@/lib/stores/playback-store";
import { usePreferencesStore } from "@/lib/stores/preferences-store";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
];

const SUBTITLE_OPTIONS = [
  { code: "off", label: "Off" },
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
];

export const AccountPageView = () => {
  const {
    getActiveProfile,
    language,
    autoplay,
    subtitleLanguage,
    setLanguage,
    setAutoplay,
    setSubtitleLanguage,
  } = usePreferencesStore();

  const { autoplayNext, setAutoplayNext } = usePlaybackStore();
  const profile = getActiveProfile();

  return (
    <div className="space-y-8 pb-16 pt-24 max-w-3xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold text-white md:text-4xl">Account & Settings</h1>
        <p className="mt-2 text-sm text-text-400">Manage your preferences and profile settings</p>
      </div>

      <section className="glass-surface rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-surface-700 to-surface-800 border border-white/10 text-3xl">
            {profile.avatar}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{profile.name}</h2>
            <div className="flex gap-2 mt-1">
              <Badge variant="brand">{profile.isKids ? "Kids" : "Standard"}</Badge>
              <Badge variant="outline">{profile.maturityRating.toUpperCase()}</Badge>
            </div>
          </div>
        </div>
      </section>

      <SectionShell title="Playback Settings">
        <div className="glass-surface rounded-2xl divide-y divide-white/[0.06]">
          <SettingRow
            icon={<MonitorPlay className="h-5 w-5" />}
            label="Autoplay Previews"
            description="Automatically play previews while browsing"
          >
            <Toggle checked={autoplay} onChange={setAutoplay} />
          </SettingRow>

          <SettingRow
            icon={<MonitorPlay className="h-5 w-5" />}
            label="Autoplay Next Episode"
            description="Automatically play the next episode in a series"
          >
            <Toggle checked={autoplayNext} onChange={setAutoplayNext} />
          </SettingRow>
        </div>
      </SectionShell>

      <SectionShell title="Language & Region">
        <div className="glass-surface rounded-2xl divide-y divide-white/[0.06]">
          <SettingRow
            icon={<Globe className="h-5 w-5" />}
            label="Display Language"
            description="Content browsing language"
          >
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-white/10 bg-surface-800 px-3 py-1.5 text-sm text-white"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </SettingRow>

          <SettingRow
            icon={<Subtitles className="h-5 w-5" />}
            label="Subtitle Language"
            description="Default subtitle preference"
          >
            <select
              value={subtitleLanguage}
              onChange={(e) => setSubtitleLanguage(e.target.value)}
              className="rounded-lg border border-white/10 bg-surface-800 px-3 py-1.5 text-sm text-white"
            >
              {SUBTITLE_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SettingRow>
        </div>
      </SectionShell>

      <SectionShell title="About">
        <div className="glass-surface rounded-2xl p-6">
          <p className="text-sm text-text-400">
            MFLIX is a movie and TV show discovery platform powered by TMDB API.
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <p className="mt-3 text-xs text-text-500">Version 0.1.0</p>
        </div>
      </SectionShell>
    </div>
  );
};

function SettingRow({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-text-400 shrink-0">{icon}</div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-50">{label}</p>
          <p className="text-xs text-text-400 truncate">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-brand-500" : "bg-surface-600",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}
