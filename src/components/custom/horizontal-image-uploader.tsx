import { type FC, type ChangeEventHandler } from "react";
import {
  X,
  Loader2,
  Plus,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppTranslate } from "@/hook";
import { APP_I18_KEYS } from "@/services/i18";

export type ImageItemStatus = "loading" | "success" | "error";

export interface ImageItem {
  id: string;
  url?: string;
  status: ImageItemStatus;
}

interface HorizontalImageUploaderProps {
  images: ImageItem[];
  label?: string;
  showPlaceholder?: boolean;
  accept?: string;
  disabled?: boolean;
  onFileSelect?: (file: File) => void;
  onDeleteClick?: (id: string) => void;
}

export const HorizontalImageUploader: FC<HorizontalImageUploaderProps> = ({
  images,
  label,
  showPlaceholder = true,
  accept = "image/jpeg, image/png",
  disabled = false,
  onFileSelect,
  onDeleteClick,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const handleFileChange: ChangeEventHandler<
    HTMLInputElement,
    HTMLInputElement
  > = (e) => {
    if (disabled) {
      e.target.value = "";
      return;
    }

    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (onFileSelect) {
        onFileSelect(selectedFile);
      }
      e.target.value = "";
    }
  };

  return (
    <div className="relative w-full min-w-0">
      <ScrollArea
        className="w-full min-w-0"
        viewportClassName="overflow-x-auto"
        orientation="horizontal"
      >
        <div className="flex w-max items-center gap-4">
          {showPlaceholder && (
            <label
              className={cn(
                "border-muted-foreground/30 bg-background group flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-all select-none",
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:border-primary/50",
              )}
            >
              <input
                type="file"
                className="hidden"
                accept={accept}
                multiple={false}
                disabled={disabled}
                onChange={handleFileChange}
              />

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
            </label>
          )}

          {images.map((img) => {
            const isLoading = img.status === "loading";
            const isError = img.status === "error";

            return (
              <div
                key={img.id}
                className={cn(
                  "group bg-background relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border",
                  isError && "border-destructive/50 bg-destructive/5",
                )}
              >
                {!isLoading && !isError && img.url ? (
                  <img
                    src={img.url}
                    alt="Uploaded item"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : null}

                {isError && (
                  <div className="text-destructive flex flex-col items-center justify-center gap-1 p-2 text-center">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-[10px] whitespace-normal">
                      {t("common.error")}
                    </span>
                  </div>
                )}

                {!isLoading && !isError && !img.url && (
                  <div className="text-muted-foreground flex flex-col items-center justify-center gap-1">
                    <ImageIcon className="h-6 w-6 opacity-40" />
                  </div>
                )}

                {isLoading && (
                  <div className="bg-background/70 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px]">
                    <Loader2 className="text-primary h-6 w-6 animate-spin" />
                  </div>
                )}

                {!isLoading && onDeleteClick && !disabled && (
                  <button
                    type="button"
                    className="bg-destructive/80 absolute top-1 right-1 z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full"
                    onClick={() => onDeleteClick(img.id)}
                  >
                    <X className="text-background h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 left-0 z-4 w-4 backdrop-blur-[2px]"
      />
    </div>
  );
};
