"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/cn";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}

export const Accordion = ({ items, defaultOpenId, className }: AccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => {
        const isOpen = item.id === openId;
        return (
          <section key={item.id} className="glass-surface overflow-hidden rounded-xl border border-white/10">
            <h3>
              <button
                type="button"
                onClick={() => setOpenId((current) => (current === item.id ? null : item.id))}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-text-50"
                aria-expanded={isOpen}
              >
                {item.title}
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-180" : "rotate-0")}
                />
              </button>
            </h3>
            {isOpen ? <div className="border-t border-white/10 px-4 py-3 text-sm text-text-200">{item.content}</div> : null}
          </section>
        );
      })}
    </div>
  );
};
