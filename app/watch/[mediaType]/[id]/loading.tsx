import { Skeleton } from "@/components/ui/skeleton";

export default function WatchLoading() {
  return (
    <main className="app-shell space-y-6 pb-16 pt-24">
      <Skeleton className="h-8 w-52" />
      <Skeleton className="aspect-video w-full rounded-2xl" />
      <div className="grid gap-3 lg:grid-cols-3">
        <Skeleton className="h-60 rounded-xl lg:col-span-2" />
        <Skeleton className="h-60 rounded-xl" />
      </div>
    </main>
  );
}
