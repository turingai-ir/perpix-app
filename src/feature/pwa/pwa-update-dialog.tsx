import { ClockIcon, RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

import type { PwaUpdateState } from "./types";

type PwaUpdateDialogProps = PwaUpdateState;

export function PwaUpdateDialog({
  needRefresh,
  status,
  update,
  close,
}: PwaUpdateDialogProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const isUpdating = status === "updating";

  return (
    <Dialog open={needRefresh} onOpenChange={(open) => !open && close()}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("features.pwaUpdate.title")}</DialogTitle>
          <DialogDescription>
            {t("features.pwaUpdate.description")}
          </DialogDescription>
          <p className="text-muted-foreground text-sm">
            {t("common.appVersion", { version: __APP_VERSION__ })}
          </p>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={close} disabled={isUpdating}>
            <ClockIcon data-icon="inline-start" />
            {t("features.pwaUpdate.actions.later")}
          </Button>
          <Button onClick={() => void update()} disabled={isUpdating}>
            <RefreshCwIcon
              data-icon="inline-start"
              className={isUpdating ? "animate-spin" : undefined}
            />
            {isUpdating
              ? t("features.pwaUpdate.actions.updating")
              : t("features.pwaUpdate.actions.update")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
