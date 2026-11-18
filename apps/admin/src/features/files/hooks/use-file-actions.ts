import { useState } from "react";
import {
  updateFile as apiUpdateFile,
  deleteFile as apiDeleteFile,
  deleteBulkFiles as apiDeleteBulkFiles,
  FileActionError,
} from "../services/file-service";
import type { FileManagerAdminUpdateFileRequest } from "../model/types";
import { toast } from "sonner";
import { useAppTranslate } from "@/hooks";

export function useFileActions() {
  const { t } = useAppTranslate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const handleUpdate = async (
    fileUuid: string,
    body: FileManagerAdminUpdateFileRequest,
  ) => {
    setIsUpdating(true);
    try {
      const res = await apiUpdateFile(fileUuid, body);
      toast.success(
        t("features.files.updateSuccess", {
          defaultValue: "اطلاعات فایل با موفقیت ویرایش شد.",
        }),
      );
      return res;
    } catch (err) {
      const msg =
        err instanceof FileActionError
          ? err.message
          : t("features.files.updateError", {
              defaultValue: "ویرایش اطلاعات فایل ناموفق بود.",
            });
      toast.error(msg);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (fileUuid: string) => {
    setIsDeleting(true);
    try {
      const res = await apiDeleteFile(fileUuid);
      toast.success(
        t("features.files.deleteSuccess", {
          defaultValue: "فایل با موفقیت حذف شد.",
        }),
      );
      return res;
    } catch (err) {
      const msg =
        err instanceof FileActionError
          ? err.message
          : t("features.files.deleteError", {
              defaultValue: "حذف فایل ناموفق بود.",
            });
      toast.error(msg);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async (fileUuids: string[]) => {
    if (fileUuids.length === 0) return;
    setIsBulkDeleting(true);
    try {
      const res = await apiDeleteBulkFiles(fileUuids);
      toast.success(
        t("features.files.bulkDeleteSuccess", {
          defaultValue: `${res.files.length} فایل با موفقیت حذف شدند.`,
        }),
      );
      return res;
    } catch (err) {
      const msg =
        err instanceof FileActionError
          ? err.message
          : t("features.files.bulkDeleteError", {
              defaultValue: "حذف گروهی فایل‌ها ناموفق بود.",
            });
      toast.error(msg);
      throw err;
    } finally {
      setIsBulkDeleting(false);
    }
  };

  return {
    updateFile: handleUpdate,
    deleteFile: handleDelete,
    deleteBulkFiles: handleBulkDelete,
    isUpdating,
    isDeleting,
    isBulkDeleting,
  };
}
