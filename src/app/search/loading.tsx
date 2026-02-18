import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="pt-20 md:pt-24 px-4 md:px-12 min-h-screen">
      <div className="max-w-2xl mx-auto mb-8">
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-poster rounded-md" />
        ))}
      </div>
    </div>
  );
}
