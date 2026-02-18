import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { buttonClassName } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="app-shell flex min-h-[60vh] flex-col items-center justify-center gap-6 pb-16 pt-28 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10">
        <FileQuestion className="h-8 w-8 text-text-400" />
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-5xl font-bold text-text-50">404</h1>
        <h2 className="font-display text-xl font-semibold text-text-200">Page Not Found</h2>
        <p className="max-w-md text-sm text-text-400">
          This title or page may have been moved, removed, or is not available yet.
        </p>
      </div>
      <Link href="/" className={buttonClassName({ variant: "secondary" })}>
        Back to Home
      </Link>
    </main>
  );
}
