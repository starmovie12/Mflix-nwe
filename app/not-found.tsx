import Link from "next/link";

import { buttonClassName } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <main className="app-shell pb-16 pt-28">
      <EmptyState
        title="404 - Page not found"
        description="This title or page may have been moved, removed, or is not available yet."
        action={
          <Link href="/" className={buttonClassName({ variant: "secondary" })}>
            Back to Home
          </Link>
        }
      />
    </main>
  );
}
