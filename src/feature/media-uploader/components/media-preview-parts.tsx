import {
  AlertCircle,
  AudioLines,
  Image as ImageIcon,
  Video,
  X,
} from "lucide-react";
import type { FC } from "react";

import { cn } from "@/lib/utils";

import type { MediaPreviewType } from "../types";

export const EmptyMediaPreview: FC<{ previewType?: MediaPreviewType }> = ({
  previewType = "image",
}) => (
  <div className="text-muted-foreground flex flex-col items-center justify-center gap-1">
    {previewType === "video" ? (
      <Video className="h-6 w-6 opacity-40" />
    ) : previewType === "audio" ? (
      <AudioLines className="h-6 w-6 opacity-40" />
    ) : (
      <ImageIcon className="h-6 w-6 opacity-40" />
    )}
  </div>
);

export const ErrorPreview: FC<{ label: string; className?: string }> = ({
  label,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-1 p-2 text-center",
      className,
    )}
  >
    <AlertCircle className="h-5 w-5" />
    <span className="text-[10px] whitespace-normal">{label}</span>
  </div>
);

export const DeleteButton: FC<{
  onClick: () => void;
  variant?: "default" | "strong";
}> = ({ onClick, variant = "default" }) => (
  <button
    type="button"
    className={cn(
      "absolute top-1 right-1 z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full",
      variant === "strong" ? "bg-destructive" : "bg-destructive/80",
    )}
    onClick={onClick}
  >
    <X className="text-background h-4 w-4" />
  </button>
);
