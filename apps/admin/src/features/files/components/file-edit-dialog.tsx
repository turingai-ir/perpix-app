import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFileActions } from "../hooks/use-file-actions";
import { useAppTranslate } from "@/hooks";
import { Edit } from "lucide-react";

export interface FileEditItem {
  uuid: string;
  file_name: string;
  meta?: Record<string, unknown> | null;
}

interface FileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileEditItem | null;
  onSuccess?: () => void;
}

function FileEditForm({
  file,
  onClose,
  onSuccess,
}: {
  file: FileEditItem;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { t } = useAppTranslate();
  const { updateFile, isUpdating } = useFileActions();

  const [fileName, setFileName] = useState(file.file_name);
  const [metaJson, setMetaJson] = useState(
    file.meta && Object.keys(file.meta).length > 0
      ? JSON.stringify(file.meta, null, 2)
      : "{}",
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    let parsedMeta: Record<string, unknown> | undefined;
    if (metaJson.trim()) {
      try {
        parsedMeta = JSON.parse(metaJson);
      } catch {
        setJsonError("فرمت متادیتا باید یک شیء JSON معتبر باشد.");
        return;
      }
    }

    try {
      await updateFile(file.uuid, {
        file_name: fileName.trim(),
        meta: parsedMeta,
      });
      onClose();
      onSuccess?.();
    } catch {
      // toast handled in hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2 text-sm">
      <div>
        <label className="text-foreground mb-1 block text-xs font-semibold">
          {t("features.files.fileName", { defaultValue: "نام فایل" })} *
        </label>
        <Input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="image.png"
          required
          dir="ltr"
        />
      </div>

      <div>
        <label className="text-foreground mb-1 block text-xs font-semibold">
          {t("features.files.metaJson", {
            defaultValue: "متادیتای JSON (اختیاری)",
          })}
        </label>
        <textarea
          rows={4}
          value={metaJson}
          onChange={(e) => {
            setMetaJson(e.target.value);
            setJsonError(null);
          }}
          className="bg-background focus:ring-ring w-full rounded-md border p-2.5 font-mono text-xs focus:ring-2 focus:outline-none"
          dir="ltr"
          placeholder="{}"
        />
        {jsonError && (
          <span className="text-destructive mt-1 block text-xs">
            {jsonError}
          </span>
        )}
      </div>

      <DialogFooter className="gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("common.cancel", { defaultValue: "انصراف" })}
        </Button>
        <Button type="submit" disabled={isUpdating || !fileName.trim()}>
          {isUpdating
            ? t("common.submitting", { defaultValue: "در حال ثبت..." })
            : t("common.save", { defaultValue: "ذخیره تغییرات" })}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function FileEditDialog({
  open,
  onOpenChange,
  file,
  onSuccess,
}: FileEditDialogProps) {
  const { t } = useAppTranslate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="text-primary size-5" />
            {t("features.files.editTitle", {
              defaultValue: "ویرایش اطلاعات فایل",
            })}
          </DialogTitle>
          <DialogDescription>
            نام و متادیتای اختصاصی فایل را ویرایش کنید.
          </DialogDescription>
        </DialogHeader>

        {open && file && (
          <FileEditForm
            key={file.uuid}
            file={file}
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
