import { type FC } from "react";

import AppLayoutSidebarWallet from "./wallet";
import AppLayoutSidebarHistory from "./history";
import AppLayoutSidebarNavigation from "./navigation";
import AppLayoutSidebarUserMenu from "./user-menu";

import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

type AppLayoutSidebarContentProps = {
  balanceUsdmicro: number;
  onOpenWalletCharge: () => void;
};

const AppLayoutSidebarContent: FC<AppLayoutSidebarContentProps> = ({
  balanceUsdmicro,
  onOpenWalletCharge,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div className="relative z-1 flex h-full w-full min-w-0 [scrollbar-width:none] flex-col gap-5 overflow-x-hidden overflow-y-auto overscroll-contain p-3 [font-feature-settings:'ss01','ss02'] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <nav
        aria-label={t("pages.app.layout.sidebar.toggle.menu")}
        className="flex min-w-0 flex-col gap-4"
      >
        <AppLayoutSidebarNavigation />
        <div
          className="via-primary/25 mx-2 -my-1 h-px bg-linear-to-r from-transparent to-transparent"
          aria-hidden="true"
        />
        <AppLayoutSidebarWallet
          balanceUsdmicro={balanceUsdmicro}
          onOpenWalletCharge={onOpenWalletCharge}
        />
        <AppLayoutSidebarHistory />
      </nav>
      <AppLayoutSidebarUserMenu />
    </div>
  );
};

export default AppLayoutSidebarContent;
