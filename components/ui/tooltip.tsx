"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/cn";

interface TooltipProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export const Tooltip = ({ label, children, className }: TooltipProps) => {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={open ? tooltipId : undefined}>{children}</span>
      {open ? (
        <span
          id={tooltipId}
          role="tooltip"
          className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/15 bg-surface-900 px-2 py-1 text-[11px] text-text-200 shadow-card"
        >
          {label}
        </span>
      ) : null}
    </span>
  );
};
