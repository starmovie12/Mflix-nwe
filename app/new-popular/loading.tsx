import { Skeleton } from "@/components/ui/skeleton";

export default function NewPopularLoading() {
  return (
    <main className="app-shell space-y-6 pb-16 pt-24">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-[62vh] w-full rounded-2xl" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[2/3] w-40 shrink-0 rounded-xl" />
        ))}
      </div>
    </main>
  );
}
