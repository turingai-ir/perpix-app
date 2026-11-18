import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  File,
  Trash2,
  Edit,
  Eye,
  RotateCcw,
  BarChart3,
  ListFilter,
  Clock,
  Globe,
  Lock,
} from "lucide-react";
import { useFilesList, type FilesRowItem } from "../hooks/use-files-list";
import { useFileActions } from "../hooks/use-file-actions";
import { useFileReports } from "../hooks/use-file-reports";
import { FilePreviewDialog } from "./file-preview-dialog";
import { FileEditDialog } from "./file-edit-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useTableQuery } from "@/hooks/use-table-query";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/custom/data-table";
import { SearchInput } from "@/components/custom/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppTranslate } from "@/hooks";
import type { AdminSort } from "../model/types";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 بایت";
  const k = 1024;
  const sizes = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

export function FilesListPage() {
  const { t } = useAppTranslate();
  const [activeTab, setActiveTab] = useState<"list" | "reports">("list");

  // Selection state for bulk operations
  const [selectedFileUuids, setSelectedFileUuids] = useState<string[]>([]);

  // Dialog states
  const [previewFile, setPreviewFile] = useState<FilesRowItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<FilesRowItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingFile, setDeletingFile] = useState<FilesRowItem | null>(null);
  const [isSingleDeleteOpen, setIsSingleDeleteOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const {
    page,
    limit,
    sort,
    search,
    filters,
    setPage,
    setLimit,
    setSort,
    setSearch,
    setFilter,
    resetFilters,
  } = useTableQuery({
    defaultLimit: 10,
    defaultSort: "-created_at",
  });

  const parsedIsPublic =
    filters.is_public === true || filters.is_public === "true"
      ? true
      : filters.is_public === false || filters.is_public === "false"
        ? false
        : undefined;

  const { files, totalCount, isLoading, error, refetch } = useFilesList({
    page,
    limit,
    sort: (sort as AdminSort) || "-created_at",
    search,
    userUuid: (filters.user_uuid as string) || undefined,
    isPublic: parsedIsPublic,
  });

  const { deleteFile, deleteBulkFiles, isDeleting, isBulkDeleting } =
    useFileActions();

  const {
    contentTypesReport,
    dailyReport,
    isLoading: isReportsLoading,
  } = useFileReports({
    userUuid: (filters.user_uuid as string) || undefined,
  });

  const handlePreviewClick = useCallback((file: FilesRowItem) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  }, []);

  const handleEditClick = useCallback((file: FilesRowItem) => {
    setEditingFile(file);
    setIsEditOpen(true);
  }, []);

  const handleDeleteClick = useCallback((file: FilesRowItem) => {
    setDeletingFile(file);
    setIsSingleDeleteOpen(true);
  }, []);

  const handleConfirmSingleDelete = async () => {
    if (!deletingFile) return;
    try {
      await deleteFile(deletingFile.uuid);
      setIsSingleDeleteOpen(false);
      setDeletingFile(null);
      void refetch();
    } catch {
      // toast handled in hook
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedFileUuids.length === 0) return;
    try {
      await deleteBulkFiles(selectedFileUuids);
      setSelectedFileUuids([]);
      setIsBulkDeleteOpen(false);
      void refetch();
    } catch {
      // toast handled in hook
    }
  };

  const isAllCurrentPageSelected = useMemo(() => {
    if (!files || files.length === 0) return false;
    return files.every((f) => selectedFileUuids.includes(f.uuid));
  }, [files, selectedFileUuids]);

  const toggleSelectAll = useCallback(() => {
    if (!files || files.length === 0) return;
    const currentPageUuids = files.map((f: FilesRowItem) => f.uuid);
    setSelectedFileUuids((prev) => {
      const isAllSelected = currentPageUuids.every((id) => prev.includes(id));
      if (isAllSelected) {
        return prev.filter((id) => !currentPageUuids.includes(id));
      }
      return Array.from(new Set([...prev, ...currentPageUuids]));
    });
  }, [files]);

  const toggleSelectOne = useCallback((uuid: string) => {
    setSelectedFileUuids((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid],
    );
  }, []);

  const renderFileIcon = (contentType: string) => {
    if (contentType?.startsWith("image/")) {
      return <ImageIcon className="size-4 text-purple-500" />;
    }
    if (contentType?.startsWith("video/")) {
      return <Video className="size-4 text-rose-500" />;
    }
    if (contentType?.startsWith("audio/")) {
      return <Music className="size-4 text-emerald-500" />;
    }
    if (contentType?.includes("pdf") || contentType?.startsWith("text/")) {
      return <FileText className="size-4 text-blue-500" />;
    }
    return <File className="text-muted-foreground size-4" />;
  };

  const columns: DataTableColumn<FilesRowItem>[] = useMemo(
    () => [
      {
        id: "select",
        header: (
          <input
            type="checkbox"
            checked={isAllCurrentPageSelected}
            onChange={toggleSelectAll}
            className="text-primary focus:ring-primary size-4 rounded border-gray-300"
            aria-label="انتخاب همه فایل‌های این صفحه"
          />
        ),
        cell: (item) => (
          <input
            type="checkbox"
            checked={selectedFileUuids.includes(item.uuid)}
            onChange={() => toggleSelectOne(item.uuid)}
            className="text-primary focus:ring-primary size-4 rounded border-gray-300"
            aria-label={`انتخاب فایل ${item.file_name}`}
          />
        ),
      },
      {
        id: "file_name",
        header: t("features.files.columns.name", {
          defaultValue: "نام و فرمت فایل",
        }),
        cell: (item) => (
          <div className="flex items-center gap-2">
            {renderFileIcon(item.content_type)}
            <div className="max-w-xs space-y-0.5 truncate">
              <Link
                to={`/files/${item.uuid}`}
                className="text-foreground hover:text-primary block truncate text-xs font-semibold"
                title={item.file_name}
              >
                {item.file_name}
              </Link>
              <code className="text-muted-foreground block font-mono text-[11px]">
                {item.content_type}
              </code>
            </div>
          </div>
        ),
      },
      {
        id: "file_size",
        header: t("features.files.columns.size", {
          defaultValue: "حجم فایل",
        }),
        cell: (item) => (
          <span className="font-mono text-xs">
            {formatBytes(item.file_size)}
          </span>
        ),
      },
      {
        id: "is_public",
        header: t("features.files.columns.access", {
          defaultValue: "دسترسی",
        }),
        cell: (item) =>
          item.is_public ? (
            <Badge
              variant="outline"
              className="gap-1 border-blue-500/30 text-[10px] text-blue-600 dark:text-blue-400"
            >
              <Globe className="size-2.5" />
              عمومی
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="text-muted-foreground gap-1 text-[10px]"
            >
              <Lock className="size-2.5" />
              خصوصی
            </Badge>
          ),
      },
      {
        id: "expire_at",
        header: t("features.files.columns.expiry", {
          defaultValue: "وضعیت انقضا",
        }),
        cell: (item) =>
          item.expire_at ? (
            <span
              className="text-muted-foreground flex items-center gap-1 text-[11px]"
              dir="ltr"
            >
              <Clock className="size-3" />
              {new Date(item.expire_at).toLocaleDateString("fa-IR")}
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">دائمی</span>
          ),
      },
      {
        id: "user_uuid",
        header: t("features.files.columns.user", {
          defaultValue: "کاربر",
        }),
        cell: (item) => (
          <Link
            to={`/users/${item.user_uuid}`}
            className="text-muted-foreground hover:text-foreground font-mono text-xs"
          >
            {item.user_uuid.slice(0, 8)}...
          </Link>
        ),
      },
      {
        id: "created_at",
        header: t("features.files.columns.createdAt", {
          defaultValue: "تاریخ آپلود",
        }),
        cell: (item) => (
          <span className="text-muted-foreground text-xs" dir="ltr">
            {new Date(item.created_at).toLocaleString("fa-IR")}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: (item) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => handlePreviewClick(item)}
            >
              <Eye className="size-3.5 text-blue-500" />
              پیش‌نمایش
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => handleEditClick(item)}
            >
              <Edit className="size-3.5" />
              ویرایش
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 h-8 gap-1 text-xs"
              onClick={() => handleDeleteClick(item)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [
      isAllCurrentPageSelected,
      selectedFileUuids,
      toggleSelectAll,
      toggleSelectOne,
      handlePreviewClick,
      handleEditClick,
      handleDeleteClick,
      t,
    ],
  );

  const hasActiveFilters = Boolean(
    search || filters.user_uuid || filters.is_public || sort !== "-created_at",
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      {/* Header */}
      <div>
        <div className="text-muted-foreground mb-1.5 flex items-center gap-2 text-xs">
          <File className="size-4" />
          <span>{t("overview.admin", { defaultValue: "پنل مدیریت" })}</span>
          <span>/</span>
          <span>
            {t("features.files.menuTitle", { defaultValue: "فایل‌ها" })}
          </span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              {t("features.files.pageTitle", {
                defaultValue: "مدیریت فایل‌ها (File Manager)",
              })}
            </h1>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
              {t("features.files.pageDesc", {
                defaultValue:
                  "مشاهده، پیش‌نمایش، ویرایش مشخصات، و حذف تکی یا گروهی فایل‌های بارگذاری شده",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-border bg-card flex w-fit items-center gap-2 rounded-xl border p-1">
        <Button
          variant={activeTab === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("list")}
          className="cursor-pointer gap-2"
        >
          <ListFilter className="size-4" />
          {t("features.files.tabs.list", { defaultValue: "لیست فایل‌ها" })}
        </Button>
        <Button
          variant={activeTab === "reports" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("reports")}
          className="cursor-pointer gap-2"
        >
          <BarChart3 className="size-4" />
          {t("features.files.tabs.reports", {
            defaultValue: "گزارش‌های فایل",
          })}
        </Button>
      </div>

      {activeTab === "list" && (
        <div className="space-y-4">
          {/* Bulk Action Bar */}
          {selectedFileUuids.length > 0 && (
            <div className="border-destructive/30 bg-destructive/10 flex items-center justify-between rounded-xl border p-3">
              <span className="text-destructive text-xs font-semibold">
                {selectedFileUuids.length} فایل انتخاب شده است.
              </span>
              <Button
                variant="destructive"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => setIsBulkDeleteOpen(true)}
              >
                <Trash2 className="size-3.5" />
                حذف گروهی ({selectedFileUuids.length})
              </Button>
            </div>
          )}

          {/* Filters Bar */}
          <div className="bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center">
            <div className="w-full sm:w-72">
              <SearchInput
                value={search || ""}
                onChange={setSearch}
                placeholder={t("features.files.searchPlaceholder", {
                  defaultValue: "جستجو بر اساس نام فایل...",
                })}
              />
            </div>

            <div className="w-full sm:w-44">
              <Select
                value={
                  filters.is_public === undefined
                    ? "ALL"
                    : String(filters.is_public)
                }
                onChange={(e) =>
                  setFilter(
                    "is_public",
                    e.target.value === "ALL"
                      ? undefined
                      : e.target.value === "true",
                  )
                }
              >
                <option value="ALL">
                  {t("features.files.access.all", {
                    defaultValue: "همه دسترسی‌ها",
                  })}
                </option>
                <option value="true">عمومی (Public)</option>
                <option value="false">خصوصی (Private)</option>
              </Select>
            </div>

            <div className="w-full sm:w-48">
              <Select
                value={sort || "-created_at"}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="-created_at">
                  {t("common.sortNewest", { defaultValue: "جدیدترین" })}
                </option>
                <option value="created_at">
                  {t("common.sortOldest", { defaultValue: "قدیمی‌ترین" })}
                </option>
                <option value="-file_size">بزرگترین حجم</option>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="gap-1.5 self-start sm:self-auto"
              >
                <RotateCcw className="size-3.5" />
                {t("common.resetFilters", { defaultValue: "حذف فیلترها" })}
              </Button>
            )}
          </div>

          {/* Table */}
          <DataTable<FilesRowItem>
            keyExtractor={(item) => item.uuid}
            data={files ? Array.from(files) : []}
            columns={columns}
            isLoading={isLoading}
            isError={Boolean(error)}
            errorMessage={error instanceof Error ? error.message : undefined}
            onRetry={() => void refetch()}
            pagination={{
              page,
              limit,
              totalCount,
              onPageChange: setPage,
              onLimitChange: setLimit,
            }}
            emptyMessage={t("features.files.empty", {
              defaultValue: "فایلی یافت نشد.",
            })}
          />
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Content Types Report */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">
                  {t("features.files.reports.typesTitle", {
                    defaultValue: "توزیع فایل‌ها بر اساس نوع محتوا (MIME Type)",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isReportsLoading ? (
                  <p className="text-muted-foreground text-xs">
                    در حال دریافت گزارش...
                  </p>
                ) : contentTypesReport.length === 0 ? (
                  <p className="text-muted-foreground text-xs">
                    داده‌ای یافت نشد.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {contentTypesReport.map(
                      (b: { key?: string; count: number }, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-2">
                            {renderFileIcon(b.key || "")}
                            <span className="font-mono text-xs">
                              {b.key || "سایر"}
                            </span>
                          </div>
                          <span className="font-mono text-xs font-bold">
                            {b.count.toLocaleString("fa-IR")} فایل
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Daily Uploads Report */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">
                  {t("features.files.reports.dailyTitle", {
                    defaultValue: "روند روزانه آپلود فایل‌ها",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isReportsLoading ? (
                  <p className="text-muted-foreground text-xs">
                    در حال دریافت گزارش...
                  </p>
                ) : dailyReport.length === 0 ? (
                  <p className="text-muted-foreground text-xs">
                    داده‌ای یافت نشد.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {dailyReport
                      .slice(0, 10)
                      .map(
                        (b: { key?: string; count: number }, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-lg border p-2.5 text-xs"
                          >
                            <span
                              className="text-muted-foreground font-mono"
                              dir="ltr"
                            >
                              {b.key}
                            </span>
                            <span className="font-bold">
                              {b.count.toLocaleString("fa-IR")} فایل
                            </span>
                          </div>
                        ),
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      <FilePreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        fileUuid={previewFile?.uuid || ""}
        fileName={previewFile?.file_name}
        contentType={previewFile?.content_type}
      />

      {/* Edit Dialog */}
      <FileEditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        file={editingFile}
        onSuccess={() => void refetch()}
      />

      {/* Single Delete Confirmation */}
      <ConfirmDialog
        open={isSingleDeleteOpen}
        onOpenChange={setIsSingleDeleteOpen}
        title={t("features.files.deleteConfirmTitle", {
          defaultValue: "تأیید حذف فایل",
        })}
        description={
          deletingFile
            ? `آیا از حذف دائم فایل "${deletingFile.file_name}" اطمینان دارید؟ این عملیات قابل بازگشت نیست.`
            : ""
        }
        confirmText={t("common.delete", { defaultValue: "حذف فایل" })}
        cancelText={t("common.cancel", { defaultValue: "انصراف" })}
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={() => void handleConfirmSingleDelete()}
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        open={isBulkDeleteOpen}
        onOpenChange={setIsBulkDeleteOpen}
        title={t("features.files.bulkDeleteConfirmTitle", {
          defaultValue: "تأیید حذف گروهی فایل‌ها",
        })}
        description={`آیا از حذف دائم ${selectedFileUuids.length} فایل انتخاب‌شده اطمینان دارید؟ این عملیات قابل بازگشت نیست.`}
        confirmText={t("features.files.bulkDeleteConfirm", {
          defaultValue: "حذف گروهی فایل‌ها",
        })}
        cancelText={t("common.cancel", { defaultValue: "انصراف" })}
        variant="destructive"
        isLoading={isBulkDeleting}
        onConfirm={() => void handleConfirmBulkDelete()}
      />
    </div>
  );
}
