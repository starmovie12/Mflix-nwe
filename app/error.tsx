"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-14">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-soft-lg">
        <h1 className="text-xl font-semibold text-white/95">Something went wrong</h1>
        <p className="mt-2 text-sm text-white/65">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button onClick={() => reset()} variant="primary">
            <RefreshCw className="size-4" />
            Retry
          </Button>
          <Link
            href="/"
            className="focus-ring rounded-full px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/8"
          >
            Go Home
          </Link>
        </div>
      </div>
    </Container>
  );
}

