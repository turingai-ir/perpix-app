import {
  AlertCircle,
  AudioLines,
  Image as ImageIcon,
  Video,
  X,
} from "lucide-react";
import type { FC } from "react";

import { useAppTranslate } from "@/hooks";
import { cn } from "@/lib/utils";
import { APP_I18_KEYS } from "@/services/i18";

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
  label?: string;
  variant?: "default" | "strong";
}> = ({ onClick, label, variant = "default" }) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <button
      type="button"
      aria-label={label ?? t("features.mediaUploader.actions.remove")}
      className={cn(
        "absolute top-1 right-1 z-20 flex size-8 cursor-pointer items-center justify-center rounded-full outline-none after:absolute after:-inset-1.5 after:content-[''] focus-visible:ring-2 focus-visible:ring-white",
        variant === "strong" ? "bg-destructive" : "bg-destructive/80",
      )}
      onClick={onClick}
    >
      <X aria-hidden="true" className="text-background size-4" />
    </button>
  );
};
