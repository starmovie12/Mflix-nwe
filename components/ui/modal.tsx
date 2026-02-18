"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ open, title, description, onClose, children, className }: ModalProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Modal"}
      onClick={onClose}
    >
      <div
        className={cn(
          "glass-surface relative w-full max-w-lg rounded-2xl border border-white/15 p-4 shadow-card md:p-6",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-text-200 transition hover:bg-white/10 hover:text-white"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>
        {title ? <h2 className="pr-8 font-display text-xl font-semibold text-text-50">{title}</h2> : null}
        {description ? <p className="mt-2 text-sm text-text-200">{description}</p> : null}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};
