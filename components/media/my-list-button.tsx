"use client";

import { Check, Plus } from "lucide-react";
import { useCallback } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import { useMyListStore } from "@/lib/stores/my-list-store";
import type { MediaItem } from "@/types/media";

interface MyListButtonProps extends Omit<ButtonProps, "onClick"> {
  item: MediaItem;
  iconOnly?: boolean;
}

export const MyListButton = ({ item, iconOnly = false, className, ...props }: MyListButtonProps) => {
  const { isInList, toggleItem } = useMyListStore();
  const { toast } = useToast();
  const inList = isInList(item.id, item.mediaType);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleItem(item);
      toast(
        inList
          ? `Removed "${item.title}" from My List`
          : `Added "${item.title}" to My List`,
        inList ? "info" : "success",
      );
    },
    [item, inList, toggleItem, toast],
  );

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border transition",
          inList
            ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
            : "border-white/30 bg-black/50 text-white hover:border-white hover:bg-black/70",
          className,
        )}
        aria-label={inList ? `Remove ${item.title} from My List` : `Add ${item.title} to My List`}
      >
        {inList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <Button
      variant={inList ? "secondary" : "secondary"}
      onClick={handleClick}
      className={cn(inList && "border-emerald-500/30 text-emerald-400", className)}
      {...props}
    >
      {inList ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
      {inList ? "In My List" : "My List"}
    </Button>
  );
};
