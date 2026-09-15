import { Plus } from "lucide-react";
import type { FC } from "react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MediaUploadPlaceholderProps {
  disabled: boolean;
  label?: string;
  onClick: () => void;
  presentation?: "default" | "composer";
}

export const MediaUploadPlaceholder: FC<MediaUploadPlaceholderProps> = ({
  disabled,
  label,
  onClick,
  presentation = "default",
}) => {
  const button = (
    <button
      type="button"
      className={cn(
        "border-muted-foreground/30 bg-background group flex shrink-0 items-center justify-center gap-2 border border-dashed transition-colors select-none",
        presentation === "composer"
          ? "bg-primary/8 size-11 rounded-xl"
          : "h-24 w-24 flex-col rounded-lg",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:border-primary/50 cursor-pointer",
      )}
      disabled={disabled}
      onClick={onClick}
    >
      <div
        className={cn(
          "bg-muted rounded-full p-2 transition-colors",
          !disabled && "group-hover:bg-primary/10",
        )}
      >
        <Plus
          className={cn(
            "text-muted-foreground h-5 w-5",
            !disabled && "group-hover:text-primary",
          )}
        />
      </div>
      <span
        className={cn(
          "text-muted-foreground max-w-27.5 px-2 text-center text-xs font-medium whitespace-normal",
          presentation === "composer" && "sr-only",
          !disabled && "group-hover:text-primary",
        )}
      >
        {label}
      </span>
    </button>
  );

  if (presentation !== "composer") return button;
  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="top" sideOffset={8}>
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
