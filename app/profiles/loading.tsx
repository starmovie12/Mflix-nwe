import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilesLoading() {
  return (
    <main className="app-shell space-y-6 pb-16 pt-24">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-44 rounded-xl" />
        ))}
      </div>
    </main>
  );
}
