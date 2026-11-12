import { useMemo } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EllipsisVerticalIcon,
  ExternalLinkIcon,
  SquarePlusIcon,
  ShareIcon,
} from "lucide-react";

import { PwaInstallGuideStep } from "./pwa-install-guide-step";
import {
  getGuideHintPlacement,
  type InstallGuideKind,
} from "../lib/install-guide";

import { Button } from "@/shared/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/drawer";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

const ICON_CLASS = "size-5";

const GUIDES = {
  ios: {
    prefix: "ios",
    steps: [
      { id: "share", icon: <ShareIcon className={ICON_CLASS} /> },
      { id: "addToHome", icon: <SquarePlusIcon className={ICON_CLASS} /> },
    ],
  },
  "in-app": {
    prefix: "inApp",
    steps: [
      { id: "menu", icon: <EllipsisVerticalIcon className={ICON_CLASS} /> },
      { id: "open", icon: <ExternalLinkIcon className={ICON_CLASS} /> },
    ],
  },
  android: {
    prefix: "android",
    steps: [
      { id: "menu", icon: <EllipsisVerticalIcon className={ICON_CLASS} /> },
      { id: "install", icon: <SquarePlusIcon className={ICON_CLASS} /> },
    ],
  },
} satisfies Record<
  InstallGuideKind,
  { prefix: string; steps: { id: string; icon: React.ReactNode }[] }
>;

interface PwaInstallGuideSheetProps {
  kind: InstallGuideKind;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PwaInstallGuideSheet({
  kind,
  open,
  onOpenChange,
}: PwaInstallGuideSheetProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const guide = GUIDES[kind];
  const base = `features.pwaInstall.${guide.prefix}`;
  const placement = useMemo(
    () => getGuideHintPlacement(kind, window.navigator),
    [kind],
  );
  const HintArrow = placement === "top" ? ArrowUpIcon : ArrowDownIcon;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        dir="rtl"
        className="z-70 mx-auto pb-[max(1rem,env(safe-area-inset-bottom))] sm:max-w-md"
      >
        <DrawerHeader className="gap-1 text-center">
          <DrawerTitle className="text-base font-bold">
            {t(`${base}.title`)}
          </DrawerTitle>
          <DrawerDescription className="leading-6">
            {t(`${base}.description`)}
          </DrawerDescription>
        </DrawerHeader>

        <ol className="grid gap-2.5 px-4">
          {guide.steps.map((step, index) => (
            <PwaInstallGuideStep
              key={step.id}
              index={index + 1}
              icon={step.icon}
              title={t(`${base}.steps.${step.id}.title`)}
              description={t(`${base}.steps.${step.id}.description`)}
            />
          ))}
        </ol>

        {placement ? (
          <p
            aria-hidden="true"
            className="text-primary mt-3 flex items-center justify-center gap-1.5 text-xs font-medium"
          >
            <HintArrow className="size-4 animate-bounce motion-reduce:animate-none" />
            {t(`${base}.toolbarHint.${placement}`)}
          </p>
        ) : null}

        <DrawerFooter>
          <DrawerClose asChild>
            <Button size="lg" className="h-12 w-full text-base">
              {t("features.pwaInstall.gotIt")}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
