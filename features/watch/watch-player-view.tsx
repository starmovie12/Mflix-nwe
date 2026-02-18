"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Expand,
  FastForward,
  Maximize,
  Minimize,
  Pause,
  Play,
  Rewind,
  Settings,
  SkipForward,
  Subtitles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { usePlaybackStore } from "@/lib/stores/playback-store";
import type { MediaDetail, MediaVideo } from "@/types/media";

interface WatchPlayerViewProps {
  detail: MediaDetail | null;
}

const DEMO_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const WatchPlayerView = ({ detail }: WatchPlayerViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const {
    volume,
    isMuted,
    playbackSpeed,
    setVolume,
    setMuted,
    setPlaybackSpeed,
    saveProgress,
    getProgress,
  } = usePlaybackStore();

  const trailer = detail?.videos.find(
    (v) => v.type.toLowerCase() === "trailer" && v.site.toLowerCase() === "youtube",
  );

  const videoUrl = DEMO_VIDEO_URL;

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  }, []);

  const seek = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      /* fullscreen not supported */
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(!isMuted);
  }, [isMuted, setMuted]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const bar = progressRef.current;
    if (!video || !bar) return;
    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = percent * video.duration;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;
    video.muted = isMuted;
    video.playbackRate = playbackSpeed;

    if (detail) {
      const saved = getProgress(detail.id, detail.mediaType);
      if (saved && saved.currentTime > 0) {
        video.currentTime = saved.currentTime;
      }
    }

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDuration = () => setDuration(video.duration);
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onDuration);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onDuration);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume;
      video.muted = isMuted;
      video.playbackRate = playbackSpeed;
    }
  }, [volume, isMuted, playbackSpeed]);

  useEffect(() => {
    if (!detail || duration === 0) return;
    const interval = setInterval(() => {
      saveProgress({
        id: detail.id,
        mediaType: detail.mediaType,
        title: detail.title,
        posterPath: detail.posterPath,
        backdropPath: detail.backdropPath,
        currentTime,
        duration,
        lastWatched: Date.now(),
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [detail, currentTime, duration, saveProgress]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          seek(10);
          break;
        case "ArrowLeft":
          seek(-10);
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case "f":
        case "F":
          void toggleFullscreen();
          break;
        case "m":
        case "M":
          toggleMute();
          break;
      }
      resetHideTimer();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, seek, toggleFullscreen, toggleMute, setVolume, volume, resetHideTimer]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!detail) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <p className="text-text-400">Content not available</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen flex-col bg-black"
      onMouseMove={resetHideTimer}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button, a, .speed-menu")) return;
        togglePlay();
      }}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="h-full w-full object-contain"
        playsInline
        autoPlay
        poster={detail.backdropPath ? `https://image.tmdb.org/t/p/w1280${detail.backdropPath}` : undefined}
      />

      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-between transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div className="bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center gap-4">
          <Link
            href={`/title/${detail.mediaType}/${detail.id}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Back to title"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-white truncate md:text-base">{detail.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="brand" className="text-[9px] py-0">{detail.mediaType === "tv" ? "TV" : "MOVIE"}</Badge>
              <Badge variant="outline" className="text-[9px] py-0">HD</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); seek(-10); }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Rewind 10 seconds"
          >
            <Rewind className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 fill-current ml-1" />}
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); seek(10); }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Forward 10 seconds"
          >
            <FastForward className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-gradient-to-t from-black/90 to-transparent p-4 space-y-3">
          <div
            ref={progressRef}
            className="group relative h-1.5 cursor-pointer rounded-full bg-white/20"
            onClick={(e) => { e.stopPropagation(); handleProgressClick(e); }}
          >
            <div
              className="h-full rounded-full bg-brand-500 transition-all group-hover:h-2"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-brand-500 shadow-glow opacity-0 group-hover:opacity-100 transition"
              style={{ left: `${progress}%`, marginLeft: "-8px" }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-200 tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                className="text-white/80 transition hover:text-white"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  e.stopPropagation();
                  setVolume(Number(e.target.value));
                  if (isMuted) setMuted(false);
                }}
                onClick={(e) => e.stopPropagation()}
                className="hidden w-20 accent-brand-500 sm:block"
                aria-label="Volume"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); }}
                className="text-white/60 transition hover:text-white"
                aria-label="Subtitles"
              >
                <Subtitles className="h-5 w-5" />
              </button>

              <div className="relative speed-menu">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); }}
                  className="text-xs font-bold text-white/60 transition hover:text-white px-2 py-1 rounded"
                  aria-label="Playback speed"
                >
                  {playbackSpeed}x
                </button>
                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-2 rounded-xl border border-white/10 bg-surface-900/95 backdrop-blur-xl p-1.5 shadow-glass">
                    {PLAYBACK_SPEEDS.map((speed) => (
                      <button
                        key={speed}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlaybackSpeed(speed);
                          setShowSpeedMenu(false);
                        }}
                        className={cn(
                          "block w-full rounded-lg px-4 py-1.5 text-left text-xs transition",
                          playbackSpeed === speed
                            ? "bg-brand-500/20 text-white font-bold"
                            : "text-text-300 hover:bg-white/10 hover:text-white",
                        )}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); void toggleFullscreen(); }}
                className="text-white/60 transition hover:text-white"
                aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
