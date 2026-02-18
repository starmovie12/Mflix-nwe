import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-xl bg-surface-800/80 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-shimmer",
      className,
    )}
    aria-hidden="true"
  />
);
