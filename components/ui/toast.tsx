import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

import { cn } from "@/lib/cn";

export type ToastVariant = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastProps extends Omit<ToastMessage, "id"> {
  onClose: () => void;
}

const VARIANT_ICON: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const VARIANT_CLASS: Record<ToastVariant, string> = {
  success: "border-emerald-400/50 bg-emerald-500/15",
  error: "border-red-400/55 bg-red-500/15",
  info: "border-sky-400/50 bg-sky-500/15",
};

export const Toast = ({ title, description, variant = "info", onClose }: ToastProps) => {
  const Icon = VARIANT_ICON[variant];

  return (
    <div
      role="status"
      className={cn(
        "w-full rounded-xl border px-4 py-3 shadow-card backdrop-blur md:max-w-sm",
        VARIANT_CLASS[variant],
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-white" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text-50">{title}</p>
          {description ? <p className="mt-1 text-xs text-text-200">{description}</p> : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-text-200 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
