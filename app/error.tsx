"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="app-shell pb-16 pt-28">
      <EmptyState
        title="Something went wrong"
        description="An unexpected issue occurred while loading this page."
        action={
          <Button type="button" onClick={() => reset()} variant="secondary">
            Try again
          </Button>
        }
      />
    </main>
  );
}
