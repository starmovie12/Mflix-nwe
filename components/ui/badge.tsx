import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "brand" | "gold" | "outline" | "quality";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default:
    "border-white/15 bg-white/10 text-text-200",
  brand:
    "border-brand-500/30 bg-brand-500/15 text-brand-400",
  gold:
    "border-gold-500/30 bg-gold-500/15 text-gold-400",
  outline:
    "border-white/25 bg-transparent text-text-300",
  quality:
    "border-brand-500 bg-brand-500 text-white font-bold",
};

export const Badge = ({ className, variant = "default", ...props }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide leading-snug",
      VARIANT_CLASSES[variant],
      className,
    )}
    {...props}
  />
);
