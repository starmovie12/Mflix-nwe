import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="app-shell space-y-10 pb-16 pt-20">
      <Skeleton className="h-[70vh] w-full rounded-2xl" />

      <div className="space-y-4">
        <Skeleton className="h-7 w-48" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-44 shrink-0">
              <SkeletonCard />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-7 w-56" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video w-80 shrink-0 rounded-xl" />
          ))}
        </div>
      </div>
    </main>
  );
}
