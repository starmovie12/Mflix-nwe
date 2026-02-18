import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

export function ErrorState({
  title,
  description,
  hint
}: {
  title: string;
  description?: string;
  hint?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft-lg",
        "backdrop-blur"
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="grid size-11 place-items-center rounded-2xl bg-mflix-red/15 ring-1 ring-mflix-red/30">
          <AlertTriangle className="size-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-base font-semibold text-white/95">{title}</div>
          {description ? <p className="mt-1 text-sm text-white/65">{description}</p> : null}
          {hint ? <div className="mt-3 text-sm text-white/70">{hint}</div> : null}
        </div>
      </div>
    </div>
  );
}

