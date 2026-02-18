"use client";

import { useMemo } from "react";

import { cn } from "@/lib/cn";

export interface TabOption {
  value: string;
  label: string;
}

interface TabsProps {
  options: TabOption[];
  value: string;
  onChange: (nextValue: string) => void;
  className?: string;
}

export const Tabs = ({ options, value, onChange, className }: TabsProps) => {
  const activeIndex = useMemo(
    () => options.findIndex((option) => option.value === value),
    [options, value],
  );

  const moveFocus = (direction: "next" | "prev") => {
    if (options.length === 0) {
      return;
    }

    const current = activeIndex === -1 ? 0 : activeIndex;
    const delta = direction === "next" ? 1 : -1;
    const nextIndex = (current + delta + options.length) % options.length;
    onChange(options[nextIndex].value);
  };

  return (
    <div className={cn("inline-flex rounded-xl border border-white/15 bg-surface-900/70 p-1", className)} role="tablist">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                moveFocus("next");
              }
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                moveFocus("prev");
              }
            }}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none",
              isActive ? "bg-brand-500 text-white shadow-glow" : "text-text-400 hover:text-text-50",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
