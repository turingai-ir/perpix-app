import { AudioLines, Image as ImageIcon, Plus, Video } from "lucide-react";
import type { FC } from "react";

import { cn } from "@/shared/lib/utils";
import type { MediaPreviewType, MediaUploadPresentation } from "../model/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

interface MediaUploadPlaceholderProps {
  disabled: boolean;
  label?: string;
  onClick: () => void;
  presentation?: MediaUploadPresentation;
  previewType?: MediaPreviewType;
}

export const MediaUploadPlaceholder: FC<MediaUploadPlaceholderProps> = ({
  disabled,
  label,
  onClick,
  presentation = "default",
  previewType = "image",
}) => {
  const MediaIcon =
    previewType === "video"
      ? Video
      : previewType === "audio"
        ? AudioLines
        : ImageIcon;
  const button = (
    <button
      type="button"
      className={cn(
        "group flex shrink-0 items-center justify-center gap-2 border border-dashed border-muted-foreground/30 bg-background transition-colors select-none",
        presentation === "composer"
          ? "size-11 rounded-xl bg-primary/8"
          : presentation === "video-dock"
            ? "h-24 w-full justify-start rounded-2xl px-4 text-start"
            : "h-24 w-24 flex-col rounded-lg",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:border-primary/50",
      )}
      disabled={disabled}
      onClick={onClick}
      data-media-upload-trigger
      data-media-type={previewType}
    >
      <div
        className={cn(
          "rounded-full bg-muted p-2 transition-colors",
          !disabled && "group-hover:bg-primary/10",
        )}
      >
        {presentation === "video-dock" ? (
          <MediaIcon className="h-5 w-5 text-primary" aria-hidden="true" />
        ) : (
          <Plus
            className={cn(
              "h-5 w-5 text-muted-foreground",
              !disabled && "group-hover:text-primary",
            )}
          />
        )}
      </div>
      <span
        className={cn(
          "max-w-27.5 px-2 text-center text-xs font-medium whitespace-normal text-muted-foreground",
          presentation === "composer" && "sr-only",
          presentation === "video-dock" && "max-w-none px-0 text-start text-sm",
          !disabled && "group-hover:text-primary",
        )}
      >
        {label}
      </span>
    </button>
  );

  if (presentation !== "composer") return button;
  return (
    <TooltipProvider delay={250}>
      <Tooltip>
        <TooltipTrigger render={button} />
        <TooltipContent side="top" sideOffset={8}>
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
