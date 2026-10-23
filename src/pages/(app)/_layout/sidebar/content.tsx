import { type FC } from "react";

import AppLayoutSidebarWallet from "./wallet";
import AppLayoutSidebarHistory from "./history";
import AppLayoutSidebarNavigation from "./navigation";
import AppLayoutSidebarUserMenu from "./user-menu";
import styles from "./sidebar.module.css";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

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
    <div
      className={`${styles.content} flex h-full w-full min-w-0 [scrollbar-width:none] flex-col gap-5 overflow-x-hidden overflow-y-auto overscroll-contain p-3 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`}
    >
      <nav
        aria-label={t("pages.app.layout.sidebar.toggle.menu")}
        className="flex min-w-0 flex-col gap-4"
      >
        <AppLayoutSidebarNavigation />
        <div className={styles.sectionDivider} aria-hidden="true" />
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
