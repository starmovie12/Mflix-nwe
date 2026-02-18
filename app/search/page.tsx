import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { buttonClassName } from "@/components/ui/button";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = {
  title: "Search",
  description: "Search for movies, TV shows, and more on MFLIX.",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  return (
    <main className="app-shell pb-16 pt-28">
      <EmptyState
        title={q ? `Search for "${q}"` : "Search"}
        description="Search with instant suggestions, filters, and more will be available in the next phase. Use the search bar above to explore."
        action={
          <Link href="/" className={buttonClassName({ variant: "secondary" })}>
            Back to Home
          </Link>
        }
      />
    </main>
  );
}
