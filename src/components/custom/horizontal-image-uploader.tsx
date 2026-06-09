import { useCallback, useRef, type FC, type ChangeEventHandler } from "react";
import {
  AlertCircle,
  Image as ImageIcon,
  LoaderCircle,
  Plus,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslate } from "@/hook";
import { APP_I18_KEYS } from "@/services/i18";
import {
  FileManagerUploadStatus,
  useFilePreview,
} from "@/feature/file-manager";

export interface UploadedImageItem {
  id: string;
}

export interface LocalImageItem {
  file: File;
  status: FileManagerUploadStatus;
}

interface HorizontalImagePreviewItemProps {
  image: UploadedImageItem;
  disabled: boolean;
  onDeleteClick?: (id: string) => void;
}

interface LocalHorizontalImagePreviewItemProps {
  image: LocalImageItem;
  disabled: boolean;
  onDeleteClick?: (fileName: string) => void;
}

interface DeleteButtonProps {
  onClick: () => void;
  variant?: "default" | "strong";
}

interface HorizontalImageUploaderProps {
  uploadedImages: UploadedImageItem[];
  localImages: LocalImageItem[];
  label?: string;
  showPlaceholder?: boolean;
  accept?: string;
  disabled?: boolean;
  onFileSelect?: (file: File) => void;
  onDeleteClick?: (id: string) => void;
  onLocalDeleteClick?: (fileName: string) => void;
}

export const HorizontalImageUploader: FC<HorizontalImageUploaderProps> = ({
  uploadedImages,
  localImages,
  label,
  showPlaceholder = true,
  accept = "image/jpeg, image/png",
  disabled = false,
  onFileSelect,
  onDeleteClick,
  onLocalDeleteClick,
}) => {
  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const input = event.currentTarget;

    if (disabled) {
      input.value = "";
      return;
    }

    const selectedFile = input.files?.[0];
    if (selectedFile) {
      onFileSelect?.(selectedFile);
    }

    input.value = "";
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
            <ImageUploadPlaceholder
              accept={accept}
              disabled={disabled}
              label={label}
              onFileChange={handleFileChange}
            />
          )}

          {localImages.map((image) => (
            <LocalHorizontalImagePreviewItem
              key={image.file.name}
              image={image}
              disabled={disabled}
              onDeleteClick={onLocalDeleteClick}
            />
          ))}

          {uploadedImages.map((image) => (
            <HorizontalImagePreviewItem
              key={image.id}
              image={image}
              disabled={disabled}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </div>
      </ScrollArea>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 left-0 z-4 w-4 backdrop-blur-[2px]"
      />
    </div>
  );
};

const ImageUploadPlaceholder: FC<{
  accept: string;
  disabled: boolean;
  label?: string;
  onFileChange: ChangeEventHandler<HTMLInputElement>;
}> = ({ accept, disabled, label, onFileChange }) => (
  <label
    className={cn(
      "border-muted-foreground/30 bg-background group flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-all select-none",
      disabled
        ? "cursor-not-allowed opacity-50"
        : "hover:border-primary/50 cursor-pointer",
    )}
  >
    <input
      type="file"
      className="hidden"
      accept={accept}
      multiple={false}
      disabled={disabled}
      onChange={onFileChange}
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
);

const HorizontalImagePreviewItem: FC<HorizontalImagePreviewItemProps> = ({
  image,
  disabled,
  onDeleteClick,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { getFilePreviewState } = useFilePreview(image.id);

  const isPreviewLoading = getFilePreviewState.isPending;
  const isError = getFilePreviewState.isError;
  const imageUrl = getFilePreviewState.data?.presigned_url;
  const canDelete = !!onDeleteClick && !disabled;

  const handleDeleteClick = () => {
    if (!onDeleteClick) return;

    onDeleteClick(image.id);
  };

  return (
    <div
      className={cn(
        "group bg-background relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border",
        isError && "border-destructive/50 bg-destructive/5",
      )}
    >
      {!isError && imageUrl ? (
        <img
          src={imageUrl}
          alt="Uploaded item"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      ) : null}

      {isError && (
        <ErrorPreview label={t("common.error")} className="text-destructive" />
      )}

      {!isPreviewLoading && !isError && !imageUrl && <EmptyImagePreview />}

      {isPreviewLoading && !imageUrl && (
        <Skeleton className="h-full w-full animate-pulse overflow-hidden rounded-lg" />
      )}

      {canDelete && <DeleteButton onClick={handleDeleteClick} />}
    </div>
  );
};

const LocalHorizontalImagePreviewItem: FC<
  LocalHorizontalImagePreviewItemProps
> = ({ image, disabled, onDeleteClick }) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const imageUrlRef = useRef<string | null>(null);
  const isUploading = image.status === FileManagerUploadStatus.UPLOADING;
  const isError = image.status === FileManagerUploadStatus.FAILED;
  const canDelete = isError && !!onDeleteClick && !disabled;

  const handleDeleteClick = () => {
    if (!onDeleteClick) return;

    onDeleteClick(image.file.name);
  };

  const revokeImageUrl = useCallback(() => {
    if (!imageUrlRef.current) return;

    URL.revokeObjectURL(imageUrlRef.current);
    imageUrlRef.current = null;
  }, []);

  const setImageElement = useCallback(
    (element: HTMLImageElement | null) => {
      revokeImageUrl();

      if (!element) return;

      const objectUrl = URL.createObjectURL(image.file);

      imageUrlRef.current = objectUrl;
      element.src = objectUrl;
    },
    [image.file, revokeImageUrl],
  );

  return (
    <div
      className={cn(
        "group bg-background relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border",
        isError && "border-destructive/50 bg-destructive/5",
      )}
    >
      <img
        ref={setImageElement}
        alt={image.file.name}
        className="h-full w-full object-cover transition-transform group-hover:scale-105"
      />

      {isUploading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-black/45 text-white backdrop-blur-[1px]">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          <span className="text-[10px] font-medium whitespace-nowrap">
            {t("common.uploading")}
          </span>
        </div>
      )}

      {isError && (
        <div className="bg-background/85 absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 p-2 text-center backdrop-blur-[1px]">
          <AlertCircle className="text-destructive h-5 w-5" />
          <span className="text-destructive text-[10px] whitespace-normal">
            {t("common.error")}
          </span>
        </div>
      )}

      {canDelete && (
        <DeleteButton onClick={handleDeleteClick} variant="strong" />
      )}
    </div>
  );
};

const EmptyImagePreview = () => (
  <div className="text-muted-foreground flex flex-col items-center justify-center gap-1">
    <ImageIcon className="h-6 w-6 opacity-40" />
  </div>
);

const ErrorPreview: FC<{ label: string; className?: string }> = ({
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

const DeleteButton: FC<DeleteButtonProps> = ({
  onClick,
  variant = "default",
}) => (
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
