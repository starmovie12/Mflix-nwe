import { Skeleton } from "@/components/ui/skeleton";

export default function MyListLoading() {
  return (
    <main className="app-shell space-y-6 pb-16 pt-24">
      <Skeleton className="h-8 w-40" />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
    </main>
  );
}
