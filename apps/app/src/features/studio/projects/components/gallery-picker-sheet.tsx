import { useMemo, useRef, type ChangeEvent, type FC } from "react";
import { Check, Film, Loader2, Upload } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import ErrorSection from "@/shared/components/error-section";
import { cn } from "@/shared/lib/utils";
import { useAppTranslate, useInfiniteScroll } from "@/shared/hooks";
import {
  FileManagerUploadStatus,
  useFilesPreviews,
  useInfiniteUserFiles,
  type PendingFile,
} from "@/features/file-manager";
import { BottomSheet } from "../../ui/bottom-sheet";
import type { GalleryVideo } from "../hooks/use-add-clip";
import { formatDuration, VIDEO_TYPES } from "../model/clips";

interface GalleryPickerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Gallery videos the project already uses; they cannot be picked twice. */
  usedFileUuids: ReadonlySet<string>;
  busy: boolean;
  uploads: ReadonlyMap<string, PendingFile>;
  onPick: (video: GalleryVideo) => void;
  onUpload: (file: File) => void;
}

const megabytes = (bytes: number) =>
  `${(bytes / 1_048_576).toLocaleString("fa-IR", { maximumFractionDigits: 1 })} مگابایت`;

/**
 * Where a video comes from: the user's PerPix gallery. A video on the device
 * is uploaded to the gallery from here and then used like any other.
 */
export const GalleryPickerSheet: FC<GalleryPickerSheetProps> = ({
  open,
  onOpenChange,
  usedFileUuids,
  busy,
  uploads,
  onPick,
  onUpload,
}) => {
  const { t } = useAppTranslate();
  const input = useRef<HTMLInputElement>(null);

  const { getUserFilesState: files } = useInfiniteUserFiles({
    contentTypes: VIDEO_TYPES,
    enabled: open,
  });
  const videos = useMemo(
    () =>
      (files.data?.pages ?? [])
        .flatMap((page) => page.files)
        .flatMap((file) => (file.uuid ? [{ ...file, uuid: file.uuid }] : [])),
    [files.data],
  );
  const { getFilesPreviewsState } = useFilesPreviews(
    videos.map((video) => video.uuid),
    open,
  );
  const previews = getFilesPreviewsState.data;

  const sentinel = useInfiniteScroll<HTMLDivElement>({
    offset: 200,
    disabled: !open || !files.hasNextPage,
    loading: files.isFetchingNextPage,
    onTrigger: () => void files.fetchNextPage(),
  });

  const uploading = [...uploads.values()].filter(
    (item) => item.status === FileManagerUploadStatus.UPLOADING,
  );

  const onChoose = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    onOpenChange(false);
    onUpload(file);
  };

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={t("features.studio.gallery.title")}
      description={t("features.studio.gallery.description")}
    >
      <div className="flex min-h-[50dvh] flex-col gap-3">
        <Button
          variant="outline"
          size="lg"
          className="min-h-12 gap-2 border-dashed"
          disabled={busy || uploading.length > 0}
          onClick={() => input.current?.click()}
        >
          {uploading.length > 0 ? (
            <Loader2 className="size-5 animate-spin" aria-hidden />
          ) : (
            <Upload className="size-5" aria-hidden />
          )}
          {t("features.studio.gallery.upload")}
        </Button>
        <input
          ref={input}
          type="file"
          accept={VIDEO_TYPES.join(",")}
          className="hidden"
          data-testid="gallery-upload-input"
          onChange={onChoose}
        />
        <p className="text-muted-foreground text-center text-xs">
          {t("features.studio.clips.limits")}
        </p>

        {files.isPending ? (
          <div className="grid grid-cols-2 gap-2" aria-hidden>
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="aspect-[9/12] rounded-xl" />
            ))}
          </div>
        ) : files.isError ? (
          <ErrorSection onRetry={() => void files.refetch()} />
        ) : videos.length === 0 ? (
          <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center text-sm">
            <Film className="size-10" aria-hidden />
            {t("features.studio.gallery.empty")}
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-2">
            {videos.map((video) => {
              const used = usedFileUuids.has(video.uuid);
              const previewUrl = previews[video.uuid]?.preview_url;
              const seconds = video.media_metadata?.duration_seconds;
              return (
                <li key={video.uuid}>
                  <button
                    type="button"
                    disabled={used || busy}
                    onClick={() =>
                      onPick({
                        uuid: video.uuid,
                        name: video.file_name.replace(/\.[^.]+$/, ""),
                        durationMs: seconds
                          ? Math.round(seconds * 1000)
                          : undefined,
                        previewUrl,
                      })
                    }
                    className={cn(
                      "bg-card focus-visible:ring-ring relative flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border text-start transition-transform focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98] disabled:cursor-default disabled:opacity-60 disabled:active:scale-100",
                    )}
                  >
                    <span className="bg-muted relative block aspect-[9/12] w-full">
                      {previewUrl ? (
                        // A still of the video: only its metadata and first frame are fetched.
                        <video
                          src={`${previewUrl}#t=0.1`}
                          preload="metadata"
                          muted
                          playsInline
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center">
                          <Film
                            className="text-muted-foreground size-8"
                            aria-hidden
                          />
                        </span>
                      )}
                      {used && (
                        <span className="bg-night/60 absolute inset-0 flex items-center justify-center">
                          <span className="bg-primary text-primary-foreground flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                            <Check className="size-3.5" aria-hidden />
                            {t("features.studio.gallery.inProject")}
                          </span>
                        </span>
                      )}
                    </span>
                    <span className="flex flex-col gap-0.5 p-2">
                      <span className="truncate text-xs font-semibold">
                        {video.file_name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {seconds ? `${formatDuration(seconds * 1000)} · ` : ""}
                        {megabytes(video.file_size)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <div ref={sentinel} className="flex h-8 items-center justify-center">
          {files.isFetchingNextPage && (
            <Loader2 className="text-muted-foreground size-5 animate-spin" />
          )}
        </div>
      </div>
    </BottomSheet>
  );
};
