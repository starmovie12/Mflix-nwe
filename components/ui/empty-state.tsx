import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <section className="glass-surface rounded-2xl p-8 text-center">
    <h2 className="font-display text-xl font-semibold text-text-50">{title}</h2>
    <p className="mt-3 text-sm text-text-200">{description}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </section>
);
