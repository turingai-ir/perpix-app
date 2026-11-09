import { type FC } from "react";
import { FaTelegramPlane } from "react-icons/fa";

import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import AppLayoutSidebarPlanCard from "./plan-card";
import { GLASS_PRESS_CLASS } from "./sidebar-styles";

const AppLayoutSidebarUserActions: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const telegramSupportUrl = import.meta.env.VITE_APP_TELEGRAM_SUPPORT;

  return (
    <div className="flex w-full flex-col gap-2">
      <AppLayoutSidebarPlanCard />
      <a
        href={telegramSupportUrl}
        rel="noreferrer"
        target="_blank"
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          GLASS_PRESS_CLASS,
          "border-foreground/10 bg-foreground/4 text-sidebar-foreground/85 w-full justify-start gap-3 rounded-2xl border text-xs font-semibold",
        )}
      >
        <FaTelegramPlane
          aria-hidden="true"
          className="text-accent-sky size-4"
        />
        {t("pages.app.layout.sidebar.user.telegramSupport")}
      </a>
    </div>
  );
};

export default AppLayoutSidebarUserActions;
