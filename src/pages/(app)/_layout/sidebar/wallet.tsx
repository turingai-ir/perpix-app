import { ArrowUpLeft } from "lucide-react";

import { CreditIcon } from "./menu-icons";
import styles from "./sidebar.module.css";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { formatTokenAmount } from "@/utils";

type AppLayoutSidebarWalletProps = {
  balanceUsdmicro: number;
  onOpenWalletCharge: () => void;
};

function AppLayoutSidebarWallet({
  balanceUsdmicro,
  onOpenWalletCharge,
}: AppLayoutSidebarWalletProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <section
      className={styles.walletCard}
      aria-label={t("pages.app.layout.sidebar.balanceCard.title")}
    >
      <div className={styles.walletTop}>
        <span className={styles.walletTitle}>
          {t("pages.app.layout.sidebar.balanceCard.title")}
        </span>
        <span className={styles.walletIcon}>
          <CreditIcon />
        </span>
      </div>
      <div className={styles.walletBalance}>
        <span dir="ltr">{formatTokenAmount(balanceUsdmicro)}</span>
        <small>{t("common.token")}</small>
      </div>
      <button
        className={styles.walletAction}
        type="button"
        onClick={onOpenWalletCharge}
      >
        <span>
          {t("pages.app.layout.sidebar.balanceCard.chargeWallet.title")}
        </span>
        <ArrowUpLeft aria-hidden="true" size={16} />
      </button>
    </section>
  );
}

export default AppLayoutSidebarWallet;
