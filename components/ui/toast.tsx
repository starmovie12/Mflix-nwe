"use client";

import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, X, XCircle, Info } from "lucide-react";

import { cn } from "@/lib/cn";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => undefined,
});

export const useToast = () => useContext(ToastContext);

const ICONS: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />,
  error: <XCircle className="h-5 w-5 text-brand-400 shrink-0" />,
  info: <Info className="h-5 w-5 text-blue-400 shrink-0" />,
};

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: "border-emerald-500/20",
  error: "border-brand-500/20",
  info: "border-blue-500/20",
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className={cn(
                "pointer-events-auto flex items-center gap-3 rounded-xl border bg-surface-900/95 backdrop-blur-xl px-4 py-3 shadow-glass min-w-[280px] max-w-[420px]",
                VARIANT_STYLES[t.variant],
              )}
            >
              {ICONS[t.variant]}
              <p className="flex-1 text-sm font-medium text-text-50">{t.message}</p>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-text-400 hover:text-white transition shrink-0"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
