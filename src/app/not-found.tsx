import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-8xl font-black text-mflix-red">404</h1>
        <h2 className="text-2xl font-bold text-white">Lost your way?</h2>
        <p className="text-mflix-gray-300">
          Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the
          home page.
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">
            MFLIX Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
