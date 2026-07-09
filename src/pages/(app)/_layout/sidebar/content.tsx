import { type FC } from "react";

import AppLayoutSidebarWallet from "./wallet";
import AppLayoutSidebarHistory from "./history";
import AppLayoutSidebarNavigation from "./navigation";
import AppLayoutSidebarUserMenu from "./user-menu";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { Separator } from "@/components/ui/separator";

const AppLayoutSidebarContent: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-auto p-2">
      <AppLayoutSidebarWallet />

      <nav
        aria-label={t("pages.app.layout.sidebar.balanceCard.actions.label")}
        className="flex flex-col gap-4"
      >
        <AppLayoutSidebarNavigation />
        <Separator />
        <AppLayoutSidebarHistory />
      </nav>
      <AppLayoutSidebarUserMenu />
    </div>
  );
};

export default AppLayoutSidebarContent;
