"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

import { cn } from "@/lib/cn";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: "left" | "right";
  children: React.ReactNode;
  className?: string;
}

export const Sheet = ({
  open,
  onClose,
  title,
  side = "right",
  children,
  className,
}: SheetProps) => {
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
    <div className="fixed inset-0 z-[85] bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Drawer"}
        className={cn(
          "glass-surface absolute inset-y-0 w-[88vw] max-w-sm border-white/10 p-4 shadow-card md:p-5",
          side === "right" ? "right-0 border-l" : "left-0 border-r",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-text-50">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-200 transition hover:bg-white/10 hover:text-white"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="h-[calc(100%-3rem)] overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
};
