import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  File,
  Download,
  Trash2,
  Edit,
  ExternalLink,
  User,
  Calendar,
  Globe,
  Lock,
  Clock,
  HardDrive,
  FileCode,
} from "lucide-react";
import { useFileDetail } from "../hooks/use-file-detail";
import { useFileActions } from "../hooks/use-file-actions";
import { FileEditDialog } from "./file-edit-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DetailPageLayout } from "@/components/custom/detail-page-layout";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppTranslate } from "@/hooks";
import { cn } from "@/lib/utils";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 بایت";
  const k = 1024;
  const sizes = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

export function FileDetailPage() {
  const { t } = useAppTranslate();
  const navigate = useNavigate();
  const { fileUuid = "" } = useParams<{ fileUuid: string }>();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { file, presignedUrls, isLoading, error, refetch } =
    useFileDetail(fileUuid);
  const { deleteFile, isDeleting } = useFileActions();

  const handleDelete = async () => {
    try {
      await deleteFile(fileUuid);
      setIsDeleteOpen(false);
      navigate("/files");
    } catch {
      // toast handled in hook
    }
  };

  const contentType = file?.content_type || presignedUrls?.content_type || "";
  const isImage = contentType.startsWith("image/");
  const isVideo = contentType.startsWith("video/");
  const isAudio = contentType.startsWith("audio/");
  const isPdf = contentType === "application/pdf";

  const renderFileIcon = () => {
    if (isImage) return <ImageIcon className="size-5 text-purple-500" />;
    if (isVideo) return <Video className="size-5 text-rose-500" />;
    if (isAudio) return <Music className="size-5 text-emerald-500" />;
    if (isPdf) return <FileText className="size-5 text-blue-500" />;
    return <File className="text-muted-foreground size-5" />;
  };

  return (
    <>
      <DetailPageLayout
        breadcrumbs={[
          {
            label: t("features.files.menuTitle", { defaultValue: "فایل‌ها" }),
            href: "/files",
          },
          {
            label: file?.file_name || fileUuid.slice(0, 8),
          },
        ]}
        title={
          file?.file_name ||
          t("features.files.detailTitle", { defaultValue: "جزئیات فایل" })
        }
        subtitle={file?.uuid}
        isLoading={isLoading}
        isError={Boolean(error)}
        errorMessage={error instanceof Error ? error.message : undefined}
        onRetry={refetch}
        actions={
          <div className="flex items-center gap-2">
            {presignedUrls?.download_url && (
              <a
                href={presignedUrls.download_url}
                download={file?.file_name}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "gap-1.5",
                )}
              >
                <Download className="size-4" />
                {t("features.files.download", {
                  defaultValue: "دانلود فایل",
                })}
              </a>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setIsEditOpen(true)}
            >
              <Edit className="size-4" />
              {t("common.edit", { defaultValue: "ویرایش" })}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="size-4" />
              {t("common.delete", { defaultValue: "حذف" })}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Main Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                {renderFileIcon()}
                {t("features.files.overview", {
                  defaultValue: "مشخصات فنی فایل",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <HardDrive className="size-3.5" />
                    حجم فایل
                  </span>
                  <div className="font-mono text-xs font-bold">
                    {file?.file_size !== undefined
                      ? formatBytes(file.file_size)
                      : "-"}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <File className="size-3.5" />
                    نوع محتوا (MIME)
                  </span>
                  <div className="font-mono text-xs">
                    {file?.content_type || "-"}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    {file?.is_public ? (
                      <Globe className="size-3.5 text-blue-500" />
                    ) : (
                      <Lock className="text-muted-foreground size-3.5" />
                    )}
                    سطح دسترسی
                  </span>
                  <div>
                    {file?.is_public ? (
                      <Badge
                        variant="outline"
                        className="text-xs text-blue-600"
                      >
                        عمومی (Public)
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        خصوصی (Private)
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Clock className="size-3.5" />
                    زمان انقضا
                  </span>
                  <div className="text-xs">
                    {file?.expire_at
                      ? new Date(file.expire_at).toLocaleString("fa-IR")
                      : "دائمی (بدون انقضا)"}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <User className="size-3.5" />
                    شناسه کاربر
                  </span>
                  <div className="font-mono text-xs">
                    {file?.user_id ?? "-"}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Calendar className="size-3.5" />
                    تاریخ ثبت
                  </span>
                  <div className="text-xs" dir="ltr">
                    {file?.created_at
                      ? new Date(file.created_at).toLocaleString("fa-IR")
                      : "-"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Embedded Preview Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">
                  {t("features.files.preview", {
                    defaultValue: "پیش‌نمایش محتوا",
                  })}
                </CardTitle>
                {presignedUrls?.preview_url && (
                  <a
                    href={presignedUrls.preview_url}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "h-7 gap-1 text-xs",
                    )}
                  >
                    <ExternalLink className="size-3.5" />
                    باز کردن لینک مستقیم
                  </a>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/20 flex min-h-[300px] items-center justify-center rounded-xl border p-4">
                {presignedUrls?.preview_url ? (
                  isImage ? (
                    <img
                      src={presignedUrls.preview_url}
                      alt={file?.file_name || "Preview"}
                      className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-sm"
                    />
                  ) : isVideo ? (
                    <video
                      src={presignedUrls.preview_url}
                      controls
                      className="max-h-[70vh] max-w-full rounded-lg"
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
                      className="h-[65vh] w-full rounded-lg border"
                    />
                  ) : (
                    <div className="space-y-3 py-10 text-center">
                      <File className="text-muted-foreground mx-auto size-16" />
                      <p className="text-muted-foreground text-sm">
                        پیش‌نمایش درون‌برنامه‌ای برای این فرمت پشتیبانی نمی‌شود.
                      </p>
                    </div>
                  )
                ) : (
                  <p className="text-muted-foreground text-sm">
                    لینک پیش‌نمایش در دسترس نیست.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Meta JSON Card */}
          {file?.meta && Object.keys(file.meta).length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-bold">
                  <FileCode className="size-4" />
                  متادیتای ذخیره‌شده (Metadata)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre
                  className="max-h-64 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-100 dark:bg-zinc-900"
                  dir="ltr"
                >
                  {JSON.stringify(file.meta, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </DetailPageLayout>

      {/* Edit Dialog */}
      <FileEditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        file={
          file
            ? {
                uuid: file.uuid,
                file_name: file.file_name,
                meta: file.meta as Record<string, unknown> | undefined,
              }
            : null
        }
        onSuccess={refetch}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title={t("features.files.deleteConfirmTitle", {
          defaultValue: "تأیید حذف فایل",
        })}
        description={`آیا از حذف دائم فایل "${file?.file_name}" اطمینان دارید؟`}
        confirmText={t("common.delete", { defaultValue: "حذف فایل" })}
        cancelText={t("common.cancel", { defaultValue: "انصراف" })}
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={() => void handleDelete()}
      />
    </>
  );
}
