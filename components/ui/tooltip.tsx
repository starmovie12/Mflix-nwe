"use client";

import { type ReactNode, useState } from "react";

import { cn } from "@/lib/cn";

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

export const Tooltip = ({ content, children, className }: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className="absolute -top-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-surface-800 px-3 py-1.5 text-xs font-medium text-text-50 shadow-glass border border-white/10 animate-scale-in"
        >
          {content}
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-surface-800 border-b border-r border-white/10" />
        </div>
      )}
    </div>
  );
};
