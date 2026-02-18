import Navbar from '@/components/layout/Navbar';
import Skeleton from '@/components/ui/Skeleton';

export default function TitleLoading() {
  return (
    <main className="min-h-screen bg-mflix-black">
      <Navbar />
      <div className="min-h-[50vh]">
        <Skeleton className="h-[50vh] w-full" />
      </div>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full max-w-2xl" />
        <div>
          <Skeleton className="mb-4 h-6 w-24" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-32 shrink-0 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
