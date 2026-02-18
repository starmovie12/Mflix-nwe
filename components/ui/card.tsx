import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("glass-surface rounded-2xl border border-white/10 p-4 shadow-card md:p-5", className)}
    {...props}
  />
);
