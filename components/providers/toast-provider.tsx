"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { Toast, type ToastMessage, type ToastVariant } from "@/components/ui/toast";

interface ToastContextValue {
  push: (input: Omit<ToastMessage, "id">) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION_MS = 3600;

const buildToastId = () => `toast-${crypto.randomUUID()}`;

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const scheduleDismiss = useCallback(
    (id: string) => {
      window.setTimeout(() => dismiss(id), DEFAULT_DURATION_MS);
    },
    [dismiss],
  );

  const pushWithVariant = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      const id = buildToastId();
      setToasts((current) => [{ id, title, description, variant }, ...current].slice(0, 5));
      scheduleDismiss(id);
      return id;
    },
    [scheduleDismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      push: ({ title, description, variant = "info" }) => pushWithVariant(variant, title, description),
      success: (title, description) => pushWithVariant("success", title, description),
      error: (title, description) => pushWithVariant("error", title, description),
      info: (title, description) => pushWithVariant("info", title, description),
      dismiss,
    }),
    [dismiss, pushWithVariant],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 top-20 z-[70] flex flex-col gap-2 md:inset-x-auto md:right-6 md:top-24"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              title={toast.title}
              description={toast.description}
              variant={toast.variant}
              onClose={() => dismiss(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
};
