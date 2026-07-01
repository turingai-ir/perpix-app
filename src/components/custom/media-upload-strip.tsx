import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEventHandler,
  type FC,
} from "react";
import {
  AlertCircle,
  AudioLines,
  Image as ImageIcon,
  LoaderCircle,
  Pause,
  Play,
  Plus,
  Video,
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

export type MediaPreviewType = "audio" | "image" | "video";

export interface UploadedMediaItem {
  id: string;
}

export interface LocalMediaItem {
  file: File;
  status: FileManagerUploadStatus;
}

interface MediaPreviewItemProps {
  disabled: boolean;
  item: UploadedMediaItem;
  onDeleteClick?: (id: string) => void;
  previewType: MediaPreviewType;
}

interface LocalMediaPreviewItemProps {
  disabled: boolean;
  item: LocalMediaItem;
  onDeleteClick?: (fileName: string) => void;
  previewType: MediaPreviewType;
}

interface DeleteButtonProps {
  onClick: () => void;
  variant?: "default" | "strong";
}

interface MediaUploadStripProps {
  uploadedItems: UploadedMediaItem[];
  localItems: LocalMediaItem[];
  label?: string;
  showPlaceholder?: boolean;
  accept?: string;
  disabled?: boolean;
  previewType?: MediaPreviewType;
  onFileSelect?: (file: File) => void;
  onDeleteClick?: (id: string) => void;
  onLocalDeleteClick?: (fileName: string) => void;
}

export const MediaUploadStrip: FC<MediaUploadStripProps> = ({
  uploadedItems,
  localItems,
  label,
  showPlaceholder = true,
  accept = "image/jpeg, image/png",
  disabled = false,
  previewType = "image",
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
            <MediaUploadPlaceholder
              accept={accept}
              disabled={disabled}
              label={label}
              onFileChange={handleFileChange}
            />
          )}

          {localItems.map((item) => (
            <LocalMediaPreviewItem
              key={item.file.name}
              item={item}
              disabled={disabled}
              previewType={previewType}
              onDeleteClick={onLocalDeleteClick}
            />
          ))}

          {uploadedItems.map((item) => (
            <MediaPreviewItem
              key={item.id}
              item={item}
              disabled={disabled}
              previewType={previewType}
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

const MediaUploadPlaceholder: FC<{
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

const MediaPreviewItem: FC<MediaPreviewItemProps> = ({
  disabled,
  item,
  previewType,
  onDeleteClick,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { getFilePreviewState } = useFilePreview(item.id);

  const isPreviewLoading = getFilePreviewState.isPending;
  const isError = getFilePreviewState.isError;
  const previewUrl = getFilePreviewState.data?.preview_url;
  const canDelete = !!onDeleteClick && !disabled;

  const handleDeleteClick = () => {
    if (!onDeleteClick) return;

    onDeleteClick(item.id);
  };

  return (
    <div
      className={cn(
        "group bg-background relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border",
        isError && "border-destructive/50 bg-destructive/5",
      )}
    >
      {!isError && previewUrl && previewType === "image" ? (
        <img
          src={previewUrl}
          alt="Uploaded item"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      ) : null}

      {!isError && previewUrl && previewType === "video" ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          src={previewUrl}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          controls
        />
      ) : null}

      {!isError && previewUrl && previewType === "audio" ? (
        <AudioPreviewButton src={previewUrl} />
      ) : null}

      {isError && (
        <ErrorPreview label={t("common.error")} className="text-destructive" />
      )}

      {!isPreviewLoading && !isError && !previewUrl && (
        <EmptyMediaPreview previewType={previewType} />
      )}

      {isPreviewLoading && !previewUrl && (
        <Skeleton className="h-full w-full animate-pulse overflow-hidden rounded-lg" />
      )}

      {canDelete && <DeleteButton onClick={handleDeleteClick} />}
    </div>
  );
};

const LocalMediaPreviewItem: FC<LocalMediaPreviewItemProps> = ({
  disabled,
  item,
  previewType,
  onDeleteClick,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const imageUrlRef = useRef<string | null>(null);
  const isUploading = item.status === FileManagerUploadStatus.UPLOADING;
  const isError = item.status === FileManagerUploadStatus.FAILED;
  const canDelete = isError && !!onDeleteClick && !disabled;

  const handleDeleteClick = () => {
    if (!onDeleteClick) return;

    onDeleteClick(item.file.name);
  };

  const revokeImageUrl = useCallback(() => {
    if (!imageUrlRef.current) return;

    URL.revokeObjectURL(imageUrlRef.current);
    imageUrlRef.current = null;
  }, []);

  const setImageElement = useCallback(
    (
      element: HTMLAudioElement | HTMLImageElement | HTMLVideoElement | null,
    ) => {
      revokeImageUrl();

      if (!element) return;

      const objectUrl = URL.createObjectURL(item.file);

      imageUrlRef.current = objectUrl;
      element.src = objectUrl;
    },
    [item.file, revokeImageUrl],
  );

  return (
    <div
      className={cn(
        "group bg-background relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border",
        isError && "border-destructive/50 bg-destructive/5",
      )}
    >
      {previewType === "image" ? (
        <img
          ref={setImageElement}
          alt={item.file.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      ) : null}

      {previewType === "video" ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          ref={setImageElement}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          controls
        />
      ) : null}

      {previewType === "audio" ? <AudioPreviewButton file={item.file} /> : null}

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

const AudioPreviewButton: FC<{ file?: File; src?: string }> = ({
  file,
  src,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const objectUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : undefined),
    [file],
  );
  const audioSrc = src ?? objectUrl;
  const Icon = isPlaying ? Pause : Play;

  useEffect(() => {
    if (!objectUrl) return;

    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement) return;

    audioElement.pause();
    audioElement.load();
    setIsPlaying(false);
  }, [audioSrc]);

  const handleTogglePlayback = async () => {
    const audioElement = audioRef.current;

    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      return;
    }

    await audioElement.play();
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      <button
        type="button"
        className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring/50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50"
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
        disabled={!audioSrc}
        onClick={handleTogglePlayback}
      >
        <Icon className="h-5 w-5" />
      </button>
    </div>
  );
};

const EmptyMediaPreview: FC<{ previewType?: MediaPreviewType }> = ({
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
