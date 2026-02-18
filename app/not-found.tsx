import Link from 'next/link';
import { Home } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-mflix-black px-4">
      <h1 className="text-fluid-5xl font-bold text-white">404</h1>
      <p className="mt-4 text-fluid-lg text-mflix-gray-300">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="mt-8">
        <Button variant="primary" size="lg" leftIcon={<Home className="h-5 w-5" />}>
          Back to Home
        </Button>
      </Link>
    </main>
  );
}
