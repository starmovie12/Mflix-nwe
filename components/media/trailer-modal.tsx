"use client";

import { Modal } from "@/components/ui/modal";
import type { MediaVideo } from "@/types/media";

interface TrailerModalProps {
  video: MediaVideo | null;
  open: boolean;
  onClose: () => void;
}

export const TrailerModal = ({ video, open, onClose }: TrailerModalProps) => {
  if (!video) return null;

  return (
    <Modal open={open} onClose={onClose} title={video.name} className="max-w-4xl">
      <div className="aspect-video w-full">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0`}
          className="h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title={video.name}
        />
      </div>
    </Modal>
  );
};
