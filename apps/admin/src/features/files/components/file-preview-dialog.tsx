import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { useFileDetail } from "../hooks/use-file-detail";
import { useAppTranslate } from "@/hooks";
import { cn } from "@/lib/utils";
import { Download, ExternalLink, Eye, Clock, File } from "lucide-react";

interface FilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileUuid: string;
  fileName?: string;
  contentType?: string;
}

export function FilePreviewDialog({
  open,
  onOpenChange,
  fileUuid,
  fileName,
  contentType = "",
}: FilePreviewDialogProps) {
  const { t } = useAppTranslate();
  const { presignedUrls, isLoading, error } = useFileDetail(
    open ? fileUuid : "",
  );

  const activeContentType = presignedUrls?.content_type || contentType || "";
  const isImage = activeContentType.startsWith("image/");
  const isVideo = activeContentType.startsWith("video/");
  const isAudio = activeContentType.startsWith("audio/");
  const isPdf = activeContentType === "application/pdf";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="text-primary size-5" />
            {t("features.files.previewTitle", {
              defaultValue: "پیش‌نمایش فایل",
            })}
          </DialogTitle>
          <DialogDescription className="truncate font-mono text-xs">
            {fileName || fileUuid}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-8">
            <div className="bg-muted h-64 w-full animate-pulse rounded-lg" />
            <div className="bg-muted h-8 w-1/3 animate-pulse rounded-lg" />
          </div>
        ) : error ? (
          <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border p-4 text-sm">
            {error instanceof Error
              ? error.message
              : "خطا در دریافت لینک پیش‌نمایش فایل"}
          </div>
        ) : !presignedUrls ? (
          <div className="text-muted-foreground py-8 text-center text-sm">
            لینکی برای پیش‌نمایش فایل دریافت نشد.
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* Media Content */}
            <div className="bg-muted/30 flex min-h-[250px] items-center justify-center rounded-xl border p-4">
              {isImage ? (
                <img
                  src={presignedUrls.preview_url}
                  alt={fileName || "Preview"}
                  className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-sm"
                />
              ) : isVideo ? (
                <video
                  src={presignedUrls.preview_url}
                  controls
                  className="max-h-[60vh] max-w-full rounded-lg"
                >
                  <track kind="captions" />
                </video>
              ) : isAudio ? (
                <audio
                  src={presignedUrls.preview_url}
                  controls
                  className="w-full max-w-md"
                >
                  <track kind="captions" />
                </audio>
              ) : isPdf ? (
                <iframe
                  src={presignedUrls.preview_url}
                  title="PDF Preview"
                  className="h-[55vh] w-full rounded-lg border"
                />
              ) : (
                <div className="space-y-3 py-6 text-center">
                  <File className="text-muted-foreground mx-auto size-14" />
                  <p className="text-muted-foreground text-sm">
                    پیش‌نمایش مستقیم برای فرمت ({activeContentType || "عمومی"})
                    در مرورگر امکان‌پذیر نیست.
                  </p>
                </div>
              )}
            </div>

            {/* Actions & Expiry Info */}
            <div className="bg-card flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Clock className="size-3.5" />
                <span>
                  اعتبار لینک تا:{" "}
                  <strong className="text-foreground font-mono" dir="ltr">
                    {new Date(presignedUrls.expire_at).toLocaleTimeString(
                      "fa-IR",
                    )}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={presignedUrls.preview_url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "gap-1.5 text-xs",
                  )}
                >
                  <ExternalLink className="size-3.5" />
                  باز کردن در تب جدید
                </a>

                <a
                  href={presignedUrls.download_url}
                  download={fileName}
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "gap-1.5 text-xs",
                  )}
                >
                  <Download className="size-3.5" />
                  دانلود فایل
                </a>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
