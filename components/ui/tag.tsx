import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export const Tag = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border border-white/15 bg-surface-800/80 px-2.5 py-1 text-[11px] font-medium text-text-200",
      className,
    )}
    {...props}
  />
);
