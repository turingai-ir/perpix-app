import { ShareIcon, SquarePlusIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppTranslate } from "@/hook";
import { APP_I18_KEYS } from "@/services/i18";

interface PwaInstallIosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PwaInstallIosDialog({
  open,
  onOpenChange,
}: PwaInstallIosDialogProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("features.pwaInstall.ios.title")}</DialogTitle>
          <DialogDescription>
            {t("features.pwaInstall.ios.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="flex items-start gap-3 rounded-lg bg-muted/60 p-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
              <ShareIcon className="size-4" />
            </span>
            <div className="grid gap-1">
              <p className="font-medium">
                {t("features.pwaInstall.ios.steps.share.title")}
              </p>
              <p className="text-muted-foreground text-sm">
                {t("features.pwaInstall.ios.steps.share.description")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-muted/60 p-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
              <SquarePlusIcon className="size-4" />
            </span>
            <div className="grid gap-1">
              <p className="font-medium">
                {t("features.pwaInstall.ios.steps.addToHome.title")}
              </p>
              <p className="text-muted-foreground text-sm">
                {t("features.pwaInstall.ios.steps.addToHome.description")}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
