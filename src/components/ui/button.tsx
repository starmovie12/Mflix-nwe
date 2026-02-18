"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-md transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:opacity-50 disabled:pointer-events-none",
          variant === "primary" &&
            "bg-white text-black hover:bg-white/80",
          variant === "secondary" &&
            "bg-mflix-gray-600/80 text-white hover:bg-mflix-gray-500/80",
          variant === "ghost" &&
            "bg-transparent text-white hover:bg-white/10",
          variant === "outline" &&
            "border border-mflix-gray-400 text-white hover:border-white hover:bg-white/5",
          variant === "danger" &&
            "bg-mflix-red text-white hover:bg-mflix-red-hover",
          size === "sm" && "px-3 py-1.5 text-sm gap-1.5",
          size === "md" && "px-5 py-2 text-base gap-2",
          size === "lg" && "px-8 py-3 text-lg gap-2.5",
          size === "icon" && "p-2",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
