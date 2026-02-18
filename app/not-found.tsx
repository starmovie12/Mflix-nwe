import Link from "next/link";

import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-16">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 shadow-soft-lg">
        <p className="text-sm font-semibold text-white/60">404</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          This page doesn’t exist
        </h1>
        <p className="mt-3 text-sm text-white/65">
          Try going back home, or open a title from the homepage rails.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="focus-ring inline-flex rounded-full bg-mflix-red px-5 py-3 text-sm font-semibold text-white shadow-glow hover:bg-mflix-red2"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </Container>
  );
}

