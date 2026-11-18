import * as React from "react";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { useAppTranslate } from "@/hooks";
import { AlertTriangle, Loader2 } from "lucide-react";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  isLoading?: boolean;
  requiresReason?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  confirmRequirement?: {
    requiredText: string;
    promptLabel: string;
    placeholder?: string;
  };
  onConfirm: (params: { reason?: string; confirmationInput?: string }) => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText,
  variant = "default",
  isLoading = false,
  requiresReason = false,
  reasonLabel,
  reasonPlaceholder,
  confirmRequirement,
  onConfirm,
}: ConfirmDialogProps) {
  const { t } = useAppTranslate();
  const [reason, setReason] = React.useState("");
  const [confirmationInput, setConfirmationInput] = React.useState("");

  const [prevOpen, setPrevOpen] = React.useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (!open) {
      setReason("");
      setConfirmationInput("");
    }
  }

  const isRequirementSatisfied = confirmRequirement
    ? confirmationInput.trim() === confirmRequirement.requiredText.trim()
    : true;

  const handleConfirm = () => {
    if (!isRequirementSatisfied || isLoading) return;
    onConfirm({
      reason: requiresReason ? reason.trim() || undefined : undefined,
      confirmationInput: confirmationInput.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup>
        <DialogHeader>
          <div className="flex items-center gap-3">
            {variant === "destructive" && (
              <span className="bg-destructive/15 text-destructive flex size-9 shrink-0 items-center justify-center rounded-xl">
                <AlertTriangle className="size-5" />
              </span>
            )}
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="mt-2 text-sm leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {requiresReason && (
            <div className="space-y-1.5">
              <label
                htmlFor="confirm-reason"
                className="text-foreground text-xs font-medium"
              >
                {reasonLabel ||
                  t("common.confirmDialog.reasonLabel", {
                    defaultValue: "علت عملیات (اختیاری):",
                  })}
              </label>
              <Input
                id="confirm-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  reasonPlaceholder ||
                  t("common.confirmDialog.reasonPlaceholder", {
                    defaultValue: "توضیح مختصر در صورت نیاز...",
                  })
                }
                disabled={isLoading}
              />
            </div>
          )}

          {confirmRequirement && (
            <div className="border-destructive/20 bg-destructive/5 space-y-1.5 rounded-xl border p-3">
              <label
                htmlFor="confirm-requirement"
                className="text-destructive text-xs font-medium"
              >
                {confirmRequirement.promptLabel}
              </label>
              <Input
                id="confirm-requirement"
                dir="ltr"
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder={
                  confirmRequirement.placeholder ||
                  confirmRequirement.requiredText
                }
                className="border-destructive/30 text-center font-mono"
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant={variant}
            disabled={!isRequirementSatisfied || isLoading}
            onClick={handleConfirm}
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            {confirmText ||
              (variant === "destructive"
                ? t("common.confirmDialog.delete", { defaultValue: "حذف" })
                : t("common.confirmDialog.confirm", { defaultValue: "تأیید" }))}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            {cancelText || t("common.cancel", { defaultValue: "انصراف" })}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
