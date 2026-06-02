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
  onFileSelect?: (file: File) => void;
  onDeleteClick?: (id: string) => void;
}

export const HorizontalImageUploader: FC<HorizontalImageUploaderProps> = ({
  images,
  label,
  showPlaceholder = true,
  accept = "image/jpeg, image/png",
  onFileSelect,
  onDeleteClick,
}) => {
  const handleFileChange: ChangeEventHandler<
    HTMLInputElement,
    HTMLInputElement
  > = (e) => {
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
    <ScrollArea
      className="w-full min-w-0 pb-4"
      viewportClassName="overflow-x-auto"
      orientation="horizontal"
    >
      <div className="flex w-max items-center gap-4">
        {showPlaceholder && (
          <label className="flex flex-col items-center justify-center w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 bg-background cursor-pointer transition-all gap-2 group shrink-0 select-none">
            <input
              type="file"
              className="hidden"
              accept={accept}
              multiple={false}
              onChange={handleFileChange}
            />

            <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
              <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-primary font-medium px-2 text-center whitespace-normal max-w-27.5">
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
                "relative group w-24 h-24 rounded-lg border bg-background overflow-hidden flex items-center justify-center shrink-0",
                isError && "border-destructive/50 bg-destructive/5",
              )}
            >
              {!isLoading && !isError && img.url ? (
                <img
                  src={img.url}
                  alt="Uploaded item"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : null}

              {isError && (
                <div className="flex flex-col items-center justify-center gap-1 text-destructive p-2 text-center">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-[10px] whitespace-normal">
                    خطا در بارگذاری
                  </span>
                </div>
              )}

              {!isLoading && !isError && !img.url && (
                <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
                  <ImageIcon className="h-6 w-6 opacity-40" />
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-0 bg-background/70 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {!isLoading && onDeleteClick && (
                <button
                  type="button"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full z-20 bg-destructive/80 flex justify-center items-center"
                  onClick={() => onDeleteClick(img.id)}
                >
                  <X className="h-4 w-4 text-background" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
