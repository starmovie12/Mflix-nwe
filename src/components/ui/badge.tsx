import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  variant?: "default" | "red" | "green" | "yellow" | "outline";
  size?: "sm" | "md";
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  size = "sm",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded",
        variant === "default" && "bg-mflix-gray-600 text-mflix-gray-100",
        variant === "red" && "bg-mflix-red/90 text-white",
        variant === "green" && "bg-green-600/90 text-white",
        variant === "yellow" && "bg-yellow-600/90 text-white",
        variant === "outline" && "border border-mflix-gray-400 text-mflix-gray-200",
        size === "sm" && "px-1.5 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-sm",
        className
      )}
    >
      {children}
    </span>
  );
}

export function MatchBadge({ score }: { score: number }) {
  const pct = Math.round(score * 10);
  return (
    <span
      className={cn(
        "font-bold text-sm",
        pct >= 70 ? "text-green-400" : pct >= 50 ? "text-yellow-400" : "text-mflix-gray-300"
      )}
    >
      {pct}% Match
    </span>
  );
}

export function QualityBadge({ quality = "HD" }: { quality?: string }) {
  return (
    <Badge variant="outline" size="sm" className="text-[10px] leading-none px-1 py-0.5 border-mflix-gray-400">
      {quality}
    </Badge>
  );
}
