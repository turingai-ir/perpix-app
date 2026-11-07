import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { useDeleteUserFile } from "@/features/file-manager";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import { downloadFile } from "@/shared/utils";
import type { GalleryFile } from "../_utils/types";

const actionButton = "h-11 w-11 rounded-xl max-md:w-10";

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
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t("pages.gallery.delete.error"),
      );
    }
  }
  return (
    <div className="border-foreground/7 bg-background/36 flex flex-none gap-[0.1rem] rounded-[0.9rem] border p-0.5 transition-opacity duration-160 max-md:gap-0 max-md:border-0 max-md:bg-transparent">
      <Button
        variant="ghost"
        className={actionButton}
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
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              className={cn(
                actionButton,
                "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
              )}
              aria-label={t("pages.gallery.actions.delete")}
            />
          }
        >
          <Trash2 />
        </DialogTrigger>
        <DialogContent
          className="glass-blur border-glass-edge bg-glass-strong overflow-hidden rounded-3xl border bg-[linear-gradient(145deg,rgb(255_255_255/7%),transparent_45%)] p-5 shadow-[inset_0_1px_rgb(255_255_255/12%),0_32px_100px_rgb(0_0_0/42%)] [--glass-blur:28px] [--glass-saturate:150%]"
          showCloseButton={false}
        >
          <DialogTitle>{t("pages.gallery.delete.title")}</DialogTitle>
          <DialogDescription>
            {t("pages.gallery.delete.description", {
              fileName: file.file_name || t("common.emptyTitle"),
            })}
          </DialogDescription>
          <DialogFooter className="bg-background/42 -mx-5 -mb-5 rounded-none px-5 py-4">
            <DialogClose
              render={
                <Button
                  variant="outline"
                  className="h-11"
                  disabled={deleteFileState.isPending}
                />
              }
            >
              {t("common.cancel")}
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
