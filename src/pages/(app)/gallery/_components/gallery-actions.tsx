import { useState } from "react";
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
import { useDeleteUserFile } from "@/feature/file-manager";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { downloadFile } from "@/utils";
import type { GalleryFile } from "../_utils/types";

export function GalleryActions({
  file,
  downloadUrl,
}: {
  file: GalleryFile;
  downloadUrl?: string;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [open, setOpen] = useState(false);
  const { deleteFileState } = useDeleteUserFile();
  async function remove() {
    try {
      await deleteFileState.mutateAsync(file.uuid);
      setOpen(false);
      toast.success(t("pages.gallery.delete.success"));
    } catch {
      toast.error(t("pages.gallery.delete.error"));
    }
  }
  return (
    <div className="flex shrink-0">
      <Button
        variant="ghost"
        className="size-11"
        aria-label={t("common.download")}
        disabled={!downloadUrl}
        onClick={() => downloadUrl && downloadFile(downloadUrl)}
      >
        <Download />
      </Button>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!deleteFileState.isPending) setOpen(value);
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-destructive size-11"
            aria-label={t("pages.gallery.actions.delete")}
          >
            <Trash2 />
          </Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle>{t("pages.gallery.delete.title")}</DialogTitle>
          <DialogDescription>
            {t("pages.gallery.delete.description", {
              fileName: file.file_name || t("common.emptyTitle"),
            })}
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="h-11"
                disabled={deleteFileState.isPending}
              >
                {t("common.cancel")}
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              className="h-11"
              disabled={deleteFileState.isPending}
              onClick={remove}
            >
              {t("pages.gallery.actions.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
