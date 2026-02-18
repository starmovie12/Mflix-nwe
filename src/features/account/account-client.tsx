"use client";

import { Settings, Globe, Play, Eye, Monitor, Bell } from "lucide-react";
import { usePreferencesStore } from "@/stores/preferences-store";
import { cn } from "@/lib/utils";

export function AccountClient() {
  const { autoplay, reducedMotion, language, setAutoplay, setReducedMotion, setLanguage } =
    usePreferencesStore();

  return (
    <div className="pt-20 md:pt-24 px-4 md:px-12 min-h-screen max-w-3xl mx-auto">
      <h1 className="text-fluid-2xl font-bold text-white mb-8 flex items-center gap-3">
        <Settings size={28} />
        Account Settings
      </h1>

      <div className="space-y-6">
        <SettingsSection title="Playback" icon={<Play size={20} />}>
          <ToggleSetting
            label="Autoplay next episode"
            description="Automatically play the next episode in a series."
            value={autoplay}
            onChange={setAutoplay}
          />
        </SettingsSection>

        <SettingsSection title="Accessibility" icon={<Eye size={20} />}>
          <ToggleSetting
            label="Reduce motion"
            description="Minimize animations and transitions throughout the app."
            value={reducedMotion}
            onChange={setReducedMotion}
          />
        </SettingsSection>

        <SettingsSection title="Language" icon={<Globe size={20} />}>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-white">Display language</p>
              <p className="text-xs text-mflix-gray-400">
                Change the language used in the interface.
              </p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-mflix-gray-700 border border-mflix-gray-600 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
            </select>
          </div>
        </SettingsSection>

        <SettingsSection title="Display" icon={<Monitor size={20} />}>
          <div className="py-3">
            <p className="text-sm text-mflix-gray-400">
              Theme and display customization options will be available in a future update.
            </p>
          </div>
        </SettingsSection>

        <SettingsSection title="Notifications" icon={<Bell size={20} />}>
          <div className="py-3">
            <p className="text-sm text-mflix-gray-400">
              Notification preferences will be available in a future update.
            </p>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}

function SettingsSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-mflix-gray-800/50 border border-mflix-gray-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-mflix-gray-400">{icon}</span>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="divide-y divide-mflix-gray-700">{children}</div>
    </div>
  );
}

function ToggleSetting({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-mflix-gray-400">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          value ? "bg-mflix-red" : "bg-mflix-gray-600"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            value ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}
