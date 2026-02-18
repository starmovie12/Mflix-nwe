import * as React from "react";

import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "danger" | "info";
};

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "bg-white/10 text-white/85 ring-1 ring-white/10",
  danger: "bg-mflix-red/20 text-white ring-1 ring-mflix-red/30",
  info: "bg-white/8 text-white/80 ring-1 ring-white/10"
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

