'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-mflix-black px-4">
      <AlertCircle className="h-16 w-16 text-mflix-red" aria-hidden />
      <h1 className="mt-4 text-fluid-2xl font-bold text-white">
        Something went wrong
      </h1>
      <p className="mt-2 text-mflix-gray-300">
        We couldn&apos;t load this page. Please try again.
      </p>
      <Button
        variant="primary"
        size="lg"
        className="mt-8"
        onClick={reset}
      >
        Try again
      </Button>
    </main>
  );
}
