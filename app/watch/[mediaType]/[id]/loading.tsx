import { Skeleton } from "@/components/ui/skeleton";

export default function WatchLoadingPage() {
  return (
    <main className="app-shell space-y-6 pb-16 pt-24">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="aspect-video w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
    </main>
  );
}
