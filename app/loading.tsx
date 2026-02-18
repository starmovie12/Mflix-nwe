import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="app-shell space-y-8 pb-16 pt-24">
      <Skeleton className="h-[68vh] w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[2/3] w-40 shrink-0 rounded-xl" />
          ))}
        </div>
      </div>
    </main>
  );
}
