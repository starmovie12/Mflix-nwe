import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function TitleDetailLoading() {
  return (
    <main className="app-shell space-y-8 pb-16 pt-24">
      <Skeleton className="h-4 w-48" />
      <div className="grid gap-6 md:grid-cols-[220px,1fr]">
        <Skeleton className="mx-auto aspect-[2/3] w-44 rounded-xl md:mx-0 md:w-full" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-12 w-36 rounded-xl" />
            <Skeleton className="h-12 w-32 rounded-xl" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-7 w-24" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-7 w-16" />
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
