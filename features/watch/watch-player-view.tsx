"use client";

import Link from "next/link";
import {
  FastForward,
  Maximize,
  Minimize,
  Pause,
  Play,
  Rewind,
  Settings2,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button, buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionShell } from "@/components/ui/section-shell";
import { Sheet } from "@/components/ui/sheet";
import { Tabs } from "@/components/ui/tabs";
import { Tag } from "@/components/ui/tag";
import { Tooltip } from "@/components/ui/tooltip";
import { useToast } from "@/components/providers/toast-provider";
import { useAnalytics } from "@/hooks/use-analytics";
import { useAppHydrated } from "@/hooks/use-app-hydrated";
import { useAppStore } from "@/lib/store/app-store";
import { getBackdropUrl } from "@/lib/tmdb/images";
import type { MediaDetail } from "@/types/media";

interface WatchPlayerViewProps {
  detail: MediaDetail;
}

const DEMO_SOURCES = [
  {
    label: "1080p",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    label: "720p",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
];

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor((seconds % 3600) / 60);
  const ss = Math.floor(seconds % 60);

  if (hh > 0) {
    return `${hh}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  }

  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
};

const buildEpisodeList = (episodeCount: number, seasonNumber: number) =>
  Array.from({ length: Math.min(episodeCount || 10, 20) }, (_, index) => ({
    id: `${seasonNumber}-${index + 1}`,
    title: `Episode ${index + 1}`,
    episodeNumber: index + 1,
    durationMinutes: 40 + (index % 3) * 5,
  }));

export const WatchPlayerView = ({ detail }: WatchPlayerViewProps) => {
  const hydrated = useAppHydrated();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  const preferences = useAppStore((state) => state.preferences);
  const updatePreferences = useAppStore((state) => state.updatePreferences);
  const savePlayback = useAppStore((state) => state.savePlayback);
  const playback = useAppStore((state) => state.getPlaybackForTitle(detail.mediaType, detail.id));

  const { success, info } = useToast();
  const { trackEvent } = useAnalytics();

  const [selectedSourceIndex, setSelectedSourceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(preferences.muted);
  const [volume, setVolume] = useState(preferences.volume);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");
  const [isFullscreen, setFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(preferences.subtitlesEnabled);
  const [audioTrack, setAudioTrack] = useState("English");
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  const availableSeasons = detail.mediaType === "tv" ? detail.seasons : [];
  const activeSeason = availableSeasons[seasonIndex] ?? null;
  const episodes = useMemo(
    () => (activeSeason ? buildEpisodeList(activeSeason.episodeCount, activeSeason.seasonNumber) : []),
    [activeSeason],
  );

  const progressPercent = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;
  const source = DEMO_SOURCES[selectedSourceIndex];
  const nextEpisodeTarget =
    detail.mediaType === "tv"
      ? detail.similar.find((item) => item.mediaType === "tv") ??
        detail.recommendations.find((item) => item.mediaType === "tv")
      : null;

  const persistPlayback = useCallback(() => {
    const progress = duration > 0 ? currentTime / duration : 0;
    savePlayback({
      mediaId: detail.id,
      mediaType: detail.mediaType,
      title: detail.title,
      posterPath: detail.posterPath,
      backdropPath: detail.backdropPath,
      progress,
      duration,
    });
    trackEvent("playback_saved", {
      mediaType: detail.mediaType,
      mediaId: detail.id,
      progress: Number(progress.toFixed(3)),
    });
  }, [currentTime, detail, duration, savePlayback, trackEvent]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.volume = volume;
    video.muted = isMuted;
    video.playbackRate = playbackRate;
  }, [isMuted, playbackRate, volume]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const video = videoRef.current;
    if (!video || !playback || playback.progress <= 0.02 || playback.progress >= 0.98) {
      return;
    }

    const seekToResumePoint = () => {
      if (!video.duration || Number.isNaN(video.duration)) {
        return;
      }

      video.currentTime = video.duration * playback.progress;
      setCurrentTime(video.currentTime);
    };

    video.addEventListener("loadedmetadata", seekToResumePoint, { once: true });
    return () => video.removeEventListener("loadedmetadata", seekToResumePoint);
  }, [hydrated, playback]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => setDuration(video.duration || 0);
    const onPlay = () => {
      setIsPlaying(true);
      trackEvent("player_played", { mediaId: detail.id, mediaType: detail.mediaType });
    };
    const onPause = () => {
      setIsPlaying(false);
      trackEvent("player_paused", { mediaId: detail.id, mediaType: detail.mediaType });
      persistPlayback();
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [detail.id, detail.mediaType, persistPlayback, trackEvent]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (isPlaying) {
        persistPlayback();
      }
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isPlaying, persistPlayback]);

  useEffect(() => {
    return () => {
      persistPlayback();
    };
  }, [persistPlayback]);

  useEffect(() => {
    const onFullScreenChange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullScreenChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) {
        return;
      }

      if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        if (video.paused) {
          void video.play();
        } else {
          video.pause();
        }
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
        trackEvent("player_seeked", { direction: "forward", amount: 10 });
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 10);
        trackEvent("player_seeked", { direction: "backward", amount: 10 });
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        const nextVolume = Math.min(1, Number((video.volume + 0.05).toFixed(2)));
        video.volume = nextVolume;
        setVolume(nextVolume);
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextVolume = Math.max(0, Number((video.volume - 0.05).toFixed(2)));
        video.volume = nextVolume;
        setVolume(nextVolume);
      }
      if (event.key.toLowerCase() === "m") {
        event.preventDefault();
        setIsMuted((current) => !current);
      }
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        if (!document.fullscreenElement) {
          void playerContainerRef.current?.requestFullscreen();
        } else {
          void document.exitFullscreen();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [trackEvent]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  const seekBy = (delta: number) => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.currentTime = Math.max(0, Math.min((video.duration || 0) + 1, video.currentTime + delta));
    setCurrentTime(video.currentTime);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await playerContainerRef.current?.requestFullscreen();
      return;
    }
    await document.exitFullscreen();
  };

  const handleProgressChange = (nextValue: number) => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.currentTime = nextValue;
    setCurrentTime(nextValue);
  };

  const currentPreviewLabel = `${formatTime(currentTime)} / ${formatTime(duration)}`;

  return (
    <main className="app-shell space-y-8 pb-16 pt-20 md:pt-24">
      <section className="space-y-3">
        <Tag>{detail.mediaType === "tv" ? "Series Player" : "Movie Player"}</Tag>
        <h1 className="font-display text-2xl font-semibold text-text-50 md:text-4xl">{detail.title}</h1>
        <p className="max-w-4xl text-sm text-text-200">{detail.overview}</p>
      </section>

      <section ref={playerContainerRef} className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-card">
        <div className="relative aspect-video">
          {source?.url ? (
            <video
              ref={videoRef}
              src={source.url}
              poster={getBackdropUrl(detail.backdropPath, "w1280")}
              className={`h-full w-full bg-black ${fitMode === "cover" ? "object-cover" : "object-contain"}`}
              autoPlay
              muted={isMuted}
              controls={false}
              playsInline
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-900 text-sm text-text-200">
              Playable stream unavailable for this title.
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-3 md:p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-text-200">
              <span>{currentPreviewLabel}</span>
              <span>{source.label}</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={Math.min(currentTime, duration || currentTime)}
              onChange={(event) => handleProgressChange(Number(event.target.value))}
              className="w-full accent-brand-500"
              aria-label="Playback scrubber"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <Tooltip label="Rewind 10s (Left Arrow)">
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white"
                    onClick={() => seekBy(-10)}
                    aria-label="Seek backward"
                  >
                    <Rewind className="h-4 w-4" />
                  </button>
                </Tooltip>
                <Tooltip label="Play / Pause (Space)">
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white"
                    onClick={togglePlayPause}
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                  </button>
                </Tooltip>
                <Tooltip label="Forward 10s (Right Arrow)">
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white"
                    onClick={() => seekBy(10)}
                    aria-label="Seek forward"
                  >
                    <FastForward className="h-4 w-4" />
                  </button>
                </Tooltip>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white"
                  onClick={() => {
                    const nextMuted = !isMuted;
                    setIsMuted(nextMuted);
                    updatePreferences({ muted: nextMuted });
                  }}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(event) => {
                    const nextVolume = Number(event.target.value);
                    setVolume(nextVolume);
                    updatePreferences({ volume: nextVolume, muted: nextVolume === 0 });
                    if (nextVolume > 0) {
                      setIsMuted(false);
                    }
                  }}
                  className="w-24 accent-brand-500"
                  aria-label="Volume slider"
                />

                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white"
                  onClick={() => setShowSettings((open) => !open)}
                  aria-label="Player settings"
                >
                  <Settings2 className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white"
                  onClick={() => setFitMode((mode) => (mode === "contain" ? "cover" : "contain"))}
                  aria-label="Toggle fit mode"
                >
                  {fitMode === "contain" ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
                </button>

                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white"
                  onClick={() => void toggleFullscreen()}
                  aria-label="Toggle fullscreen"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {currentTime < 90 ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    seekBy(85);
                    info("Skipped intro");
                  }}
                >
                  Skip Intro
                </Button>
              ) : null}
              {detail.mediaType === "tv" ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    seekBy(30);
                    info("Skipped recap");
                  }}
                >
                  Skip Recap
                </Button>
              ) : null}
              {progressPercent > 85 && nextEpisodeTarget ? (
                <Link
                  href={`/watch/${nextEpisodeTarget.mediaType}/${nextEpisodeTarget.id}`}
                  className={buttonClassName({ variant: "primary" })}
                >
                  <SkipForward className="h-4 w-4" />
                  Next Episode
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-3 lg:col-span-2">
          <h2 className="font-display text-xl font-semibold text-text-50">Playback Options</h2>
          <Tabs
            options={DEMO_SOURCES.map((item, index) => ({ value: String(index), label: item.label }))}
            value={String(selectedSourceIndex)}
            onChange={(value) => setSelectedSourceIndex(Number(value))}
          />

          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs uppercase tracking-wide text-text-400">Playback speed</span>
              <select
                value={String(playbackRate)}
                onChange={(event) => setPlaybackRate(Number(event.target.value))}
                className="w-full rounded-lg border border-white/15 bg-surface-900 px-3 py-2 text-sm text-text-50"
              >
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-xs uppercase tracking-wide text-text-400">Audio track (architecture)</span>
              <select
                value={audioTrack}
                onChange={(event) => setAudioTrack(event.target.value)}
                className="w-full rounded-lg border border-white/15 bg-surface-900 px-3 py-2 text-sm text-text-50"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
              </select>
            </label>
          </div>

          <label className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
            <span className="text-sm text-text-200">Subtitles enabled (architecture)</span>
            <input
              type="checkbox"
              checked={subtitlesEnabled}
              onChange={(event) => {
                const checked = event.target.checked;
                setSubtitlesEnabled(checked);
                updatePreferences({ subtitlesEnabled: checked });
              }}
              className="h-4 w-4 rounded border-white/20 bg-surface-900"
            />
          </label>

          <label className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
            <span className="text-sm text-text-200">Autoplay next episode</span>
            <input
              type="checkbox"
              checked={preferences.autoplayNext}
              onChange={(event) => updatePreferences({ autoplayNext: event.target.checked })}
              className="h-4 w-4 rounded border-white/20 bg-surface-900"
            />
          </label>
        </Card>

        {detail.mediaType === "tv" ? (
          <Card className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-text-50">Episodes</h2>
            {availableSeasons.length > 0 ? (
              <>
                <label className="space-y-1">
                  <span className="text-xs uppercase tracking-wide text-text-400">Season</span>
                  <select
                    value={String(seasonIndex)}
                    onChange={(event) => setSeasonIndex(Number(event.target.value))}
                    className="w-full rounded-lg border border-white/15 bg-surface-900 px-3 py-2 text-sm text-text-50"
                  >
                    {availableSeasons.map((season, index) => (
                      <option key={season.id} value={index}>
                        {season.name}
                      </option>
                    ))}
                  </select>
                </label>
                <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
                  {episodes.map((episode) => (
                    <li key={episode.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEpisode(episode.episodeNumber);
                          success(`Playing ${episode.title}`, `Season ${activeSeason?.seasonNumber ?? 1}`);
                          if (videoRef.current) {
                            videoRef.current.currentTime = 0;
                            void videoRef.current.play();
                          }
                        }}
                        className={`w-full rounded-lg border px-3 py-2 text-left ${
                          selectedEpisode === episode.episodeNumber
                            ? "border-brand-400 bg-brand-500/20"
                            : "border-white/10 bg-surface-900/60"
                        }`}
                      >
                        <p className="text-sm font-medium text-text-50">
                          E{episode.episodeNumber}. {episode.title}
                        </p>
                        <p className="text-xs text-text-400">{episode.durationMinutes} min</p>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-text-200">Episode metadata unavailable for this title.</p>
            )}
          </Card>
        ) : null}
      </section>

      {detail.similar.length > 0 ? (
        <SectionShell title="More Like This">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {detail.similar.slice(0, 10).map((item) => (
              <Link
                key={`${item.mediaType}-${item.id}`}
                href={`/watch/${item.mediaType}/${item.id}`}
                className="rounded-lg border border-white/10 bg-surface-900/70 px-3 py-2 text-sm text-text-200 transition hover:border-brand-400/60 hover:text-white"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </SectionShell>
      ) : null}

      <Sheet open={showSettings} onClose={() => setShowSettings(false)} title="Quick settings">
        <div className="space-y-4">
          <Card className="space-y-2">
            <h3 className="text-sm font-semibold text-text-50">Keyboard shortcuts</h3>
            <ul className="space-y-1 text-xs text-text-200">
              <li>Space: Play/Pause</li>
              <li>Left/Right: Seek -/+10 seconds</li>
              <li>Up/Down: Volume control</li>
              <li>M: Mute</li>
              <li>F: Fullscreen</li>
            </ul>
          </Card>
          <Card className="space-y-2">
            <h3 className="text-sm font-semibold text-text-50">Current session</h3>
            <p className="text-xs text-text-200">Progress: {Math.round(progressPercent)}%</p>
            <p className="text-xs text-text-200">Playback speed: {playbackRate}x</p>
            <p className="text-xs text-text-200">Volume: {Math.round(volume * 100)}%</p>
          </Card>
        </div>
      </Sheet>
    </main>
  );
};
