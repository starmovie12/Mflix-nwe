"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useId } from "react";

import { cn } from "@/lib/cn";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  const shouldReduceMotion = useReducedMotion();
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={shouldReduceMotion ? undefined : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className={cn(
              "relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-surface-950 shadow-card",
              className,
            )}
            initial={shouldReduceMotion ? undefined : { y: 14, scale: 0.98, opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { y: 0, scale: 1, opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { y: 10, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 24, mass: 0.9 }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
              <h2 id={titleId} className="font-display text-base font-semibold text-text-50 md:text-lg">
                {title}
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-text-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 md:p-6">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
