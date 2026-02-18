"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { create } from "zustand";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export function toast(message: string, type: Toast["type"] = "info", duration = 3000) {
  useToastStore.getState().addToast({ message, type, duration });
}

function ToastItem({ toast: t, onRemove }: { toast: Toast; onRemove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onRemove, t.duration ?? 3000);
    return () => clearTimeout(timer);
  }, [t.duration, onRemove]);

  const Icon = t.type === "success" ? CheckCircle : t.type === "error" ? AlertCircle : Info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl backdrop-blur-sm min-w-[300px] max-w-[420px]",
        t.type === "success" && "bg-green-900/90 border border-green-700/50",
        t.type === "error" && "bg-red-900/90 border border-red-700/50",
        t.type === "info" && "bg-mflix-gray-700/90 border border-mflix-gray-600/50"
      )}
    >
      <Icon size={18} className="flex-shrink-0" />
      <p className="text-sm text-white flex-1">{t.message}</p>
      <button
        onClick={onRemove}
        className="flex-shrink-0 text-mflix-gray-300 hover:text-white transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2"
      aria-live="polite"
      role="status"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            onRemove={() => removeToast(t.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
