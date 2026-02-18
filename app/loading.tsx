import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <div className="border-b border-white/10">
        <Skeleton className="h-[70vh] min-h-[520px] max-h-[760px] w-full rounded-none" />
      </div>
      <Container className="py-10">
        <Skeleton className="h-6 w-48" />
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] w-full rounded-2xl" />
          ))}
        </div>
      </Container>
    </div>
  );
}

