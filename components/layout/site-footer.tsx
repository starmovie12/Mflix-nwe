import Link from "next/link";

import { APP_NAME, NAV_ITEMS } from "@/lib/constants";

export const SiteFooter = () => (
  <footer className="border-t border-white/[0.06] bg-surface-950/80 backdrop-blur-sm">
    <div className="app-shell py-10">
      <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
        <div>
          <Link href="/" className="font-display text-lg font-extrabold uppercase tracking-[0.18em]">
            <span className="text-white">M</span>
            <span className="text-brand-500">FLIX</span>
          </Link>
          <p className="mt-3 text-sm text-text-400 max-w-xs">
            Your premium streaming discovery experience. Explore trending movies, TV shows, and more.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-200">Navigate</h4>
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-text-400 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-200">Legal</h4>
          <div className="flex flex-col gap-2 text-sm text-text-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Preferences</span>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-200">Info</h4>
          <p className="text-sm text-text-400">
            {APP_NAME} is a movie discovery platform powered by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>

      <div className="mt-10 border-t border-white/[0.06] pt-6 text-center text-xs text-text-500">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </div>
  </footer>
);
