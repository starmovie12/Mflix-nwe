"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWatchProgressStore } from "@/stores/watch-progress-store";
import type { MediaDetails } from "@/types/app";

interface WatchPageClientProps {
  details: MediaDetails;
  trailerKey?: string | null;
}

const SAMPLE_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export function WatchPageClient({ details }: WatchPageClientProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  const { updateProgress } = useWatchProgressStore();

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const handleVolumeChange = useCallback((value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = value;
    setVolume(value);
    if (value === 0) {
      video.muted = true;
      setMuted(true);
    } else if (video.muted) {
      video.muted = false;
      setMuted(false);
    }
  }, []);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(time, video.duration || 0));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  const setSpeed = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  }, []);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          seek(currentTime - 10);
          break;
        case "ArrowRight":
          seek(currentTime + 10);
          break;
        case "ArrowUp":
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.1));
          break;
        case "f":
          toggleFullscreen();
          break;
        case "m":
          toggleMute();
          break;
      }
      showControlsTemporarily();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTime, volume, togglePlay, seek, handleVolumeChange, toggleFullscreen, toggleMute, showControlsTemporarily]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && playing) {
        updateProgress({
          mediaId: details.id,
          mediaType: details.mediaType,
          progress: videoRef.current.currentTime,
          duration: videoRef.current.duration || 0,
          timestamp: Date.now(),
          title: details.title,
          posterPath: details.posterPath,
          backdropPath: details.backdropPath,
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [playing, details, updateProgress]);

  const formatTime = (time: number): string => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black cursor-none"
      onMouseMove={showControlsTemporarily}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button, input")) return;
        togglePlay();
      }}
      style={{ cursor: showControls ? "default" : "none" }}
    >
      <video
        ref={videoRef}
        src={SAMPLE_VIDEO}
        className="w-full h-full object-contain"
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
        onEnded={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        playsInline
      />

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col justify-between"
          >
            <div className="bg-gradient-to-b from-black/70 to-transparent p-4 md:p-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.back();
                  }}
                  className="text-white hover:text-mflix-gray-200 transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft size={28} />
                </button>
                <div>
                  <h1 className="text-lg md:text-xl font-semibold text-white">
                    {details.title}
                  </h1>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-t from-black/70 to-transparent p-4 md:p-6 space-y-3">
              <div
                className="group/progress relative h-1 hover:h-2 bg-mflix-gray-600 rounded-full cursor-pointer transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  seek(pct * duration);
                }}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-mflix-red rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-mflix-red rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
                  style={{ left: `calc(${progressPercent}% - 8px)` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="text-white hover:text-mflix-gray-200 transition-colors"
                    aria-label={playing ? "Pause" : "Play"}
                  >
                    {playing ? <Pause size={28} /> : <Play size={28} fill="white" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      seek(currentTime - 10);
                    }}
                    className="text-white hover:text-mflix-gray-200 transition-colors"
                    aria-label="Rewind 10 seconds"
                  >
                    <SkipBack size={22} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      seek(currentTime + 10);
                    }}
                    className="text-white hover:text-mflix-gray-200 transition-colors"
                    aria-label="Forward 10 seconds"
                  >
                    <SkipForward size={22} />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      className="text-white hover:text-mflix-gray-200 transition-colors"
                      aria-label={muted ? "Unmute" : "Mute"}
                    >
                      {muted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={muted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      onClick={(e) => e.stopPropagation()}
                      className="w-20 h-1 appearance-none bg-mflix-gray-500 rounded-full accent-white cursor-pointer"
                      aria-label="Volume"
                    />
                  </div>

                  <span className="text-sm text-mflix-gray-200 ml-2">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSettings(!showSettings);
                      }}
                      className="text-white hover:text-mflix-gray-200 transition-colors"
                      aria-label="Playback settings"
                    >
                      <Settings size={22} />
                    </button>

                    {showSettings && (
                      <div className="absolute bottom-full right-0 mb-2 bg-mflix-gray-800/95 backdrop-blur-sm border border-mflix-gray-600 rounded-lg p-2 min-w-[140px]">
                        <p className="text-xs text-mflix-gray-400 px-2 py-1">Speed</p>
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                          <button
                            key={rate}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSpeed(rate);
                            }}
                            className={cn(
                              "block w-full text-left px-2 py-1.5 text-sm rounded hover:bg-mflix-gray-700 transition-colors",
                              playbackRate === rate ? "text-white" : "text-mflix-gray-300"
                            )}
                          >
                            {rate}x{playbackRate === rate ? " ✓" : ""}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFullscreen();
                    }}
                    className="text-white hover:text-mflix-gray-200 transition-colors"
                    aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                  >
                    {fullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
