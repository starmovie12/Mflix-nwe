"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-mflix-red/20 flex items-center justify-center">
            <AlertCircle size={32} className="text-mflix-red" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
        <p className="text-mflix-gray-300">
          We encountered an unexpected error. Please try again or return to the
          homepage.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={reset} variant="primary">
            <RefreshCw size={16} />
            Try Again
          </Button>
          <a href="/">
            <Button variant="secondary">Go Home</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
