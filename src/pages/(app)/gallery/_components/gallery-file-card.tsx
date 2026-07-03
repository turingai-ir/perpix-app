import { useState, type FC, type MouseEvent } from "react";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type FilePreviewUrls,
  useDeleteUserFile,
} from "@/feature/file-manager";
import { formatFileSize } from "@/feature/media-uploader/utils";
import { useAppTranslate } from "@/hook";
import { cn } from "@/lib/utils";
import { APP_I18_KEYS } from "@/services/i18";
import { downloadFile } from "@/utils";

import { GalleryFallback } from "./gallery-fallback";
import { GalleryPreview } from "./gallery-preview";

import { getGalleryMediaType } from "../_utils/gallery";
import type { GalleryFile } from "../_utils/types";

interface GalleryFileCardProps {
  file: GalleryFile;
  index: number;
  isPreviewError: boolean;
  isPreviewLoading: boolean;
  previewUrls: FilePreviewUrls | undefined;
}

export const GalleryFileCard: FC<GalleryFileCardProps> = ({
  file,
  index,
  isPreviewError,
  isPreviewLoading,
  previewUrls,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { deleteFileState } = useDeleteUserFile();
  const previewUrl = previewUrls?.preview_url;
  const downloadUrl = previewUrls?.download_url;
  const fileName = file.file_name || t("common.emptyTitle");
  const mediaType = getGalleryMediaType(file.content_type);
  const mediaLabel = t(`pages.gallery.mediaTypes.${mediaType}`);
  const fileSize = formatFileSize(file.file_size);

  const handleDownload = async (event: MouseEvent<HTMLAnchorElement>) => {
    if (!downloadUrl || isDownloading) return;
    event.preventDefault();

    try {
      setIsDownloading(true);
      downloadFile(downloadUrl);
    } catch {
      toast.error(t("common.error"));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFileState.mutateAsync(file.uuid);
      setIsDeleteDialogOpen(false);
      toast.success(t("pages.gallery.delete.success"));
    } catch {
      toast.error(t("pages.gallery.delete.error"));
    }
  };

  return (
    <>
      <Dialog>
        <div className="bg-background group flex min-w-0 flex-col overflow-hidden rounded-lg border">
          <div className="bg-muted relative aspect-square w-full overflow-hidden">
            {!isPreviewError && previewUrl ? (
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="focus-visible:ring-ring/50 h-full w-full cursor-zoom-in overflow-hidden outline-none focus-visible:ring-3"
                  aria-label={fileName}
                >
                  <GalleryPreview
                    mediaType={mediaType}
                    previewUrl={previewUrl}
                    fileName={fileName}
                  />
                </button>
              </DialogTrigger>
            ) : null}

            {isPreviewLoading && !previewUrl ? (
              <Skeleton className="h-full w-full rounded-none" />
            ) : null}

            {isPreviewError || (!isPreviewLoading && !previewUrl) ? (
              <GalleryFallback mediaType={mediaType} />
            ) : null}
          </div>

          <div className="flex min-w-0 items-start gap-1 p-2">
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium">{fileName}</div>
              <div className="text-muted-foreground truncate text-[10px]">
                {mediaLabel}
                {fileSize ? ` · ${fileSize}` : ""}
              </div>
            </div>
            <Button
              asChild
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
            >
              <a
                href={downloadUrl ?? "#"}
                download
                aria-disabled={!downloadUrl || isDownloading}
                className={cn(
                  (!downloadUrl || isDownloading) &&
                    "pointer-events-none opacity-50",
                )}
                onClick={handleDownload}
              >
                <Download />
                <span className="sr-only">{t("common.download")}</span>
              </a>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:text-destructive shrink-0"
              disabled={deleteFileState.isPending}
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 />
              <span className="sr-only">
                {t("pages.gallery.actions.delete")}
              </span>
            </Button>
          </div>
        </div>

        <DialogContent
          className="bg-background/95 inset-s-0 top-0 flex h-dvh max-h-dvh max-w-none translate-x-0 translate-y-0 flex-col gap-3 rounded-none border-0 p-3 ring-0 sm:max-w-none rtl:translate-x-0"
          showCloseButton
        >
          <DialogTitle className="sr-only">{fileName}</DialogTitle>
          <DialogDescription className="sr-only">
            {mediaLabel}
          </DialogDescription>

          <div className="flex min-h-0 w-full flex-1 items-center justify-center">
            {mediaType === "image" && previewUrl ? (
              <img
                className="max-h-full max-w-full rounded-lg object-contain"
                src={previewUrl}
                alt={`gallery-${index}`}
              />
            ) : null}
            {mediaType === "video" && previewUrl ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                className="max-h-full max-w-full rounded-lg"
                src={previewUrl}
                controls
                autoPlay
              />
            ) : null}
            {mediaType === "audio" && previewUrl ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <audio
                className="w-full max-w-xl"
                src={previewUrl}
                controls
                autoPlay
              />
            ) : null}
          </div>

          <div className="flex w-full shrink-0 items-center justify-center pb-2">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="h-11 px-5 text-base"
            >
              <a
                href={downloadUrl ?? "#"}
                download
                aria-disabled={!downloadUrl || isDownloading}
                className={cn(
                  (!downloadUrl || isDownloading) &&
                    "pointer-events-none opacity-50",
                )}
                onClick={handleDownload}
              >
                <Download />
                {t("common.download")}
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!deleteFileState.isPending) setIsDeleteDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogTitle>{t("pages.gallery.delete.title")}</DialogTitle>
          <DialogDescription>
            {t("pages.gallery.delete.description", { fileName })}
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={deleteFileState.isPending}
              >
                {t("common.cancel")}
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteFileState.isPending}
              onClick={handleDelete}
            >
              <Trash2 />
              {deleteFileState.isPending
                ? t("pages.gallery.delete.deleting")
                : t("pages.gallery.actions.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
