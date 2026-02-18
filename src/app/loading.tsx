import { HeroSkeleton, RowSkeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div>
      <HeroSkeleton />
      <div className="space-y-8 mt-8">
        <RowSkeleton variant="poster" />
        <RowSkeleton variant="backdrop" />
        <RowSkeleton variant="poster" />
        <RowSkeleton variant="backdrop" />
      </div>
    </div>
  );
}
