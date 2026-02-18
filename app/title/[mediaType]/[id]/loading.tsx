import { Skeleton } from "@/components/ui/skeleton";

export default function TitleDetailLoading() {
  return (
    <main className="app-shell space-y-8 pb-16 pt-24">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-[70vh] w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[3/4] w-full rounded-xl" />
        ))}
      </div>
    </main>
  );
}
