"use client";

import { Play } from "lucide-react";
import { useState } from "react";

import { buttonClassName } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface TrailerDialogProps {
  youtubeKey: string;
  title: string;
  variant?: "primary" | "secondary";
  buttonLabel?: string;
}

export const TrailerDialog = ({
  youtubeKey,
  title,
  variant = "primary",
  buttonLabel = "Play Trailer",
}: TrailerDialogProps) => {
  const [open, setOpen] = useState(false);

  const src = `https://www.youtube-nocookie.com/embed/${youtubeKey}?autoplay=1&mute=1&controls=1&playsinline=1&rel=0`;

  return (
    <>
      <button type="button" className={buttonClassName({ variant, size: "lg" })} onClick={() => setOpen(true)}>
        <Play className="h-5 w-5 fill-current" />
        {buttonLabel}
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={`${title} — Trailer`} className="max-w-5xl">
        <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
          {open ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={src}
              title={`${title} trailer`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : null}
        </div>
        <p className="mt-3 text-xs text-text-400">
          Trailer playback is provided via YouTube for discovery. Full playback streams are not hosted by TMDB.
        </p>
      </Modal>
    </>
  );
};
