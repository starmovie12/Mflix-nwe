import type { ReactNode } from "react";

interface SectionShellProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export const SectionShell = ({
  title,
  description,
  action,
  children,
}: SectionShellProps) => (
  <section className="space-y-4">
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {description ? <p className="mt-1 text-sm text-text-400">{description}</p> : null}
      </div>
      {action}
    </div>
    {children}
  </section>
);
