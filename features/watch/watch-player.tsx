"use client";

import {
  FastForward,
  Fullscreen,
  Minimize,
  Pause,
  Play,
  Rewind,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useMflixStore } from "@/hooks/use-mflix-store";
import type { MediaDetail } from "@/types/media";

interface WatchPlayerProps {
  detail: MediaDetail;
}

interface DemoSource {
  id: string;
  label: string;
  url: string;
}

const DEMO_SOURCES: DemoSource[] = [
  {
    id: "1080p",
    label: "1080p",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "720p",
    label: "720p",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
];

const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const secs = whole % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export const WatchPlayer = ({ detail }: WatchPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastProgressPersistRef = useRef<number>(0);
  const [currentSourceId, setCurrentSourceId] = useState(DEMO_SOURCES[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [autoplayNext, setAutoplayNext] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const continueWatching = useMflixStore((state) => state.continueWatching);
  const upsertProgress = useMflixStore((state) => state.upsertProgress);
  const preferences = useMflixStore((state) => state.preferences);
  const updatePreferences = useMflixStore((state) => state.updatePreferences);

  const resumeEntry = useMemo(
    () =>
      continueWatching.find(
        (item) => item.id === detail.id && item.mediaType === detail.mediaType,
      ),
    [continueWatching, detail.id, detail.mediaType],
  );

  useEffect(() => {
    setVolume(preferences.volume);
    setShowSubtitles(preferences.subtitlesEnabled);
    setAutoplayNext(preferences.autoplayNextEpisode);
  }, [preferences.autoplayNextEpisode, preferences.subtitlesEnabled, preferences.volume]);

  useEffect(() => {
    const onFullscreenChange = () => {
      const element = document.fullscreenElement;
      setIsFullscreen(Boolean(element));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) {
        return;
      }

      if (["INPUT", "TEXTAREA", "SELECT"].includes((event.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case " ":
          event.preventDefault();
          if (video.paused) {
            void video.play();
          } else {
            video.pause();
          }
          break;
        case "arrowleft":
          event.preventDefault();
          video.currentTime = clamp(video.currentTime - 10, 0, video.duration || 0);
          break;
        case "arrowright":
          event.preventDefault();
          video.currentTime = clamp(video.currentTime + 10, 0, video.duration || 0);
          break;
        case "arrowup":
          event.preventDefault();
          video.volume = clamp(video.volume + 0.1, 0, 1);
          setVolume(video.volume);
          updatePreferences({ volume: video.volume });
          break;
        case "arrowdown":
          event.preventDefault();
          video.volume = clamp(video.volume - 0.1, 0, 1);
          setVolume(video.volume);
          updatePreferences({ volume: video.volume });
          break;
        case "m":
          event.preventDefault();
          video.muted = !video.muted;
          setIsMuted(video.muted);
          break;
        case "f":
          event.preventDefault();
          if (!document.fullscreenElement) {
            void containerRef.current?.requestFullscreen();
          } else {
            void document.exitFullscreen();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [updatePreferences]);

  const persistProgress = (nextCurrentTime: number, nextDuration: number) => {
    if (!Number.isFinite(nextCurrentTime) || !Number.isFinite(nextDuration) || nextDuration <= 0) {
      return;
    }

    const now = Date.now();
    if (now - lastProgressPersistRef.current < 3500) {
      return;
    }

    lastProgressPersistRef.current = now;
    upsertProgress({
      id: detail.id,
      mediaType: detail.mediaType,
      title: detail.title,
      posterPath: detail.posterPath,
      backdropPath: detail.backdropPath,
      progress: nextCurrentTime,
      duration: nextDuration,
      lastPlayedAt: now,
    });
  };

  const seekBy = (seconds: number) => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.currentTime = clamp(video.currentTime + seconds, 0, video.duration || 0);
  };

  const activeSource = DEMO_SOURCES.find((source) => source.id === currentSourceId) ?? DEMO_SOURCES[0];
  const showSkipIntro = currentTime <= 90;
  const showNextEpisodeCta = detail.mediaType === "tv" && duration > 0 && duration - currentTime <= 35;

  return (
    <div className="space-y-6">
      <div ref={containerRef} className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-card">
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={activeSource.url}
            className="h-full w-full"
            preload="metadata"
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onRateChange={(event) => setPlaybackRate(event.currentTarget.playbackRate)}
            onDurationChange={(event) => {
              const nextDuration = event.currentTarget.duration;
              setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
            }}
            onLoadedMetadata={(event) => {
              const video = event.currentTarget;
              const shouldResume =
                resumeEntry &&
                resumeEntry.progress > 10 &&
                resumeEntry.progress < video.duration - 10;
              if (shouldResume) {
                video.currentTime = resumeEntry.progress;
              }
              video.volume = volume;
              video.muted = isMuted;
              video.playbackRate = playbackRate;
            }}
            onTimeUpdate={(event) => {
              const nextCurrentTime = event.currentTarget.currentTime;
              const nextDuration = event.currentTarget.duration;
              setCurrentTime(nextCurrentTime);
              persistProgress(nextCurrentTime, nextDuration);
            }}
          />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-3">
            <p className="line-clamp-1 text-sm font-semibold text-white">{detail.title}</p>
            <p className="rounded-full border border-white/20 bg-black/50 px-2 py-1 text-xs text-white">
              DEMO STREAM
            </p>
          </div>

          {showSkipIntro ? (
            <button
              type="button"
              className="absolute bottom-20 right-3 rounded-lg bg-black/70 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black/90"
              onClick={() => {
                const video = videoRef.current;
                if (!video) {
                  return;
                }
                video.currentTime = clamp(video.currentTime + 85, 0, video.duration || 0);
              }}
            >
              Skip Intro
            </button>
          ) : null}

          {showNextEpisodeCta ? (
            <button
              type="button"
              className="absolute bottom-8 right-3 rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-400"
            >
              Next Episode
            </button>
          ) : null}
        </div>

        <div className="space-y-3 border-t border-white/10 bg-surface-950 p-4">
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={(event) => {
                const next = Number(event.target.value);
                const video = videoRef.current;
                if (!video || Number.isNaN(next)) {
                  return;
                }
                video.currentTime = next;
                setCurrentTime(next);
              }}
              className="w-full accent-brand-500"
              aria-label="Video timeline"
            />
            <div className="flex items-center justify-between text-xs text-text-300">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
              onClick={() => seekBy(-10)}
              aria-label="Seek backward 10 seconds"
            >
              <Rewind className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
              onClick={() => {
                const video = videoRef.current;
                if (!video) {
                  return;
                }
                if (video.paused) {
                  void video.play();
                } else {
                  video.pause();
                }
              }}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
              onClick={() => seekBy(10)}
              aria-label="Seek forward 10 seconds"
            >
              <FastForward className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
              onClick={() => {
                const video = videoRef.current;
                if (!video) {
                  return;
                }
                video.muted = !video.muted;
                setIsMuted(video.muted);
              }}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(event) => {
                const nextVolume = Number(event.target.value);
                const video = videoRef.current;
                if (!video || Number.isNaN(nextVolume)) {
                  return;
                }

                video.volume = nextVolume;
                video.muted = nextVolume === 0;
                setVolume(nextVolume);
                setIsMuted(nextVolume === 0);
                updatePreferences({ volume: nextVolume });
              }}
              className="w-24 accent-brand-500"
              aria-label="Volume"
            />
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
              onClick={() => {
                if (!document.fullscreenElement) {
                  void containerRef.current?.requestFullscreen();
                } else {
                  void document.exitFullscreen();
                }
              }}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Fullscreen className="h-4 w-4" />}
            </button>
          </div>

          <div className="grid gap-3 rounded-xl border border-white/10 bg-surface-900 p-3 md:grid-cols-3">
            <label className="text-xs text-text-300">
              Quality
              <select
                value={currentSourceId}
                onChange={(event) => {
                  const nextSourceId = event.target.value;
                  const currentPosition = videoRef.current?.currentTime ?? 0;
                  setCurrentSourceId(nextSourceId);
                  requestAnimationFrame(() => {
                    const video = videoRef.current;
                    if (!video) {
                      return;
                    }
                    video.currentTime = currentPosition;
                    if (isPlaying) {
                      void video.play();
                    }
                  });
                }}
                className="mt-1 w-full rounded-lg border border-white/15 bg-surface-800 px-2 py-1 text-xs text-text-50 outline-none focus:border-brand-400"
              >
                {DEMO_SOURCES.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs text-text-300">
              Playback speed
              <select
                value={String(playbackRate)}
                onChange={(event) => {
                  const nextRate = Number(event.target.value);
                  const video = videoRef.current;
                  if (!video || Number.isNaN(nextRate)) {
                    return;
                  }

                  video.playbackRate = nextRate;
                  setPlaybackRate(nextRate);
                }}
                className="mt-1 w-full rounded-lg border border-white/15 bg-surface-800 px-2 py-1 text-xs text-text-50 outline-none focus:border-brand-400"
              >
                {PLAYBACK_SPEEDS.map((speed) => (
                  <option key={speed} value={speed}>
                    {speed}x
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs text-text-300">
              Subtitles
              <select
                value={showSubtitles ? "on" : "off"}
                onChange={(event) => {
                  const enabled = event.target.value === "on";
                  setShowSubtitles(enabled);
                  updatePreferences({ subtitlesEnabled: enabled });
                }}
                className="mt-1 w-full rounded-lg border border-white/15 bg-surface-800 px-2 py-1 text-xs text-text-50 outline-none focus:border-brand-400"
              >
                <option value="off">Off</option>
                <option value="on">On</option>
              </select>
            </label>
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-text-300">
            <input
              type="checkbox"
              checked={autoplayNext}
              onChange={(event) => {
                const enabled = event.target.checked;
                setAutoplayNext(enabled);
                updatePreferences({ autoplayNextEpisode: enabled });
              }}
              className="accent-brand-500"
            />
            Autoplay next episode
          </label>
        </div>
      </div>

      <section className="glass-surface rounded-2xl p-6">
        <h2 className="section-title">Now Watching</h2>
        <p className="mt-2 text-sm text-text-200">{detail.overview}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="button" variant="secondary">
            <SkipForward className="h-4 w-4" />
            Next Episode CTA
          </Button>
          <Button type="button" variant="secondary">
            Audio Track Selector
          </Button>
          <Button type="button" variant="secondary">
            Subtitle Toggle
          </Button>
        </div>
      </section>
    </div>
  );
};
