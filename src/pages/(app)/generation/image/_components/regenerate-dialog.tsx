import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppTranslate } from "@/hooks";

export function RegenerateImageDialog({
  disabled,
  onConfirm,
  onOpenChange,
  open,
}: {
  disabled?: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  const { t } = useAppTranslate();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogTitle>
          {t("pages.generation.image.chat.regenerateConfirmTitle")}
        </DialogTitle>
        <DialogDescription>
          {t("pages.generation.image.chat.regenerateConfirmDescription")}
        </DialogDescription>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button type="button" disabled={disabled} onClick={onConfirm}>
            {t("pages.generation.image.chat.regenerateConfirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
