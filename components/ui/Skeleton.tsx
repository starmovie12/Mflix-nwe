interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer rounded ${className}`}
      aria-hidden
    />
  );
}

export function SkeletonPoster() {
  return <Skeleton className="aspect-poster w-full" />;
}

export function SkeletonBackdrop() {
  return <Skeleton className="aspect-backdrop w-full" />;
}

export function SkeletonText({ lines = 1 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}
