import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function TvLoading() {
  return (
    <main className="app-shell space-y-8 pb-16 pt-24">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>
      {Array.from({ length: 3 }).map((_, ri) => (
        <div key={ri} className="space-y-4">
          <Skeleton className="h-7 w-52" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, ci) => (
              <div key={ci} className="w-44 shrink-0">
                <SkeletonCard />
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
