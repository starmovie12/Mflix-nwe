import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-xl bg-surface-800/80",
      "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent before:animate-shimmer",
      className,
    )}
    aria-hidden="true"
  />
);

export const SkeletonText = ({ className }: SkeletonProps) => (
  <Skeleton className={cn("h-4 w-full rounded-md", className)} />
);

export const SkeletonCard = ({ className }: SkeletonProps) => (
  <div className={cn("space-y-2", className)}>
    <Skeleton className="aspect-poster w-full rounded-xl" />
    <SkeletonText className="w-3/4" />
    <SkeletonText className="w-1/2" />
  </div>
);
