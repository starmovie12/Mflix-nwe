import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingTitle() {
  return (
    <div>
      <div className="border-b border-white/10">
        <Skeleton className="h-[70vh] min-h-[560px] max-h-[820px] w-full rounded-none" />
      </div>
      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] w-full rounded-2xl" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-2xl" />
            ))}
            <Skeleton className="h-6 w-44" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

