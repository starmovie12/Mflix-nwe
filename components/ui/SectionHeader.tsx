import Link from "next/link";

import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  subtitle,
  action
}: {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-white/95 sm:text-lg">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-white/60">{subtitle}</p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className={cn(
            "text-sm font-medium text-white/70 hover:text-white",
            "focus-ring rounded-full px-2 py-1"
          )}
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

