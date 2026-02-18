import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded bg-mflix-gray-700",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-mflix-gray-600/40 to-transparent" />
    </div>
  );
}

export function CardSkeleton({ variant = "poster" }: { variant?: "poster" | "backdrop" }) {
  return (
    <div className="flex-shrink-0">
      <Skeleton
        className={
          variant === "poster"
            ? "aspect-poster w-[150px] sm:w-[180px] md:w-[200px] rounded-md"
            : "aspect-backdrop w-[280px] sm:w-[320px] md:w-[360px] rounded-md"
        }
      />
      <Skeleton className="mt-2 h-4 w-3/4 rounded" />
    </div>
  );
}

export function RowSkeleton({ variant = "poster", count = 7 }: { variant?: "poster" | "backdrop"; count?: number }) {
  return (
    <div className="space-y-4 px-4 md:px-12">
      <Skeleton className="h-6 w-48 rounded" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <CardSkeleton key={i} variant={variant} />
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full">
      <Skeleton className="h-full w-full rounded-none" />
      <div className="absolute bottom-20 left-4 md:left-12 space-y-4">
        <Skeleton className="h-12 w-64 rounded" />
        <Skeleton className="h-4 w-96 rounded" />
        <Skeleton className="h-4 w-72 rounded" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </div>
    </div>
  );
}
