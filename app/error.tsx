"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="app-shell flex min-h-[60vh] flex-col items-center justify-center gap-6 pb-16 pt-28 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 border border-brand-500/20">
        <AlertTriangle className="h-8 w-8 text-brand-400" />
      </div>
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-text-50">Something went wrong</h2>
        <p className="max-w-md text-sm text-text-400">
          An unexpected issue occurred while loading this page. Please try again.
        </p>
      </div>
      <Button type="button" onClick={() => reset()} variant="secondary">
        Try Again
      </Button>
    </main>
  );
}
