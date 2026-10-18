import type { FC } from "react";

import { ChangePasswordForm } from "./change-password-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangePasswordDialog: FC<ChangePasswordDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("features.auth.changePassword.title")}</DialogTitle>
          <DialogDescription>
            {t("features.auth.changePassword.description")}
          </DialogDescription>
        </DialogHeader>
        {open ? <ChangePasswordForm /> : null}
      </DialogContent>
    </Dialog>
  );
};
