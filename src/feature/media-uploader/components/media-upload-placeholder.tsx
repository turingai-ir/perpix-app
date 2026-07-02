import { Plus } from "lucide-react";
import type { FC } from "react";

import { cn } from "@/lib/utils";

interface MediaUploadPlaceholderProps {
  disabled: boolean;
  label?: string;
  onClick: () => void;
}

export const MediaUploadPlaceholder: FC<MediaUploadPlaceholderProps> = ({
  disabled,
  label,
  onClick,
}) => (
  <button
    type="button"
    className={cn(
      "border-muted-foreground/30 bg-background group flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-all select-none",
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
        !disabled && "group-hover:text-primary",
      )}
    >
      {label}
    </span>
  </button>
);
