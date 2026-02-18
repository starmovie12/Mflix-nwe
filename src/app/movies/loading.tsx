import { RowSkeleton } from "@/components/ui/skeleton";

export default function MoviesLoading() {
  return (
    <div className="pt-20 md:pt-24 space-y-8">
      <RowSkeleton variant="backdrop" />
      <RowSkeleton variant="poster" />
      <RowSkeleton variant="backdrop" />
      <RowSkeleton variant="poster" />
    </div>
  );
}
