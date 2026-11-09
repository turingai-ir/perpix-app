import { useState } from "react";
import { Plus, Wallet } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useActiveSubscription, usePricingFeature } from "@/features/pricing";
import { useWallet, WalletChargeFlow } from "@/features/wallet";
import { useAppTranslate } from "@/shared/hooks";
import { FinanceHero } from "@/shared/components/finance/finance-hero";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatTokenAmount } from "@/shared/utils";
import { FINANCE_CHIP_CLASS } from "@/shared/components/finance/finance-styles";

export function WalletHero() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const walletState = useWallet();
  const subscriptionState = useActiveSubscription();
  const { openPricingFeature } = usePricingFeature();
  const [chargeOpen, setChargeOpen] = useState(false);
  const balance = walletState.data?.balance_usdmicro ?? 0;
  let balanceLabel = t("pages.profile.finance.loading");
  if (walletState.isError)
    balanceLabel = t("pages.profile.finance.unavailable");
  if (walletState.isSuccess) {
    balanceLabel = `${formatTokenAmount(balance)} ${t("common.token")}`;
  }

  return (
    <>
      <FinanceHero
        kind="wallet"
        title={t("pages.profile.finance.walletTitle")}
        description={t("pages.profile.finance.walletDescription")}
        artLabel={t("pages.profile.finance.walletArt")}
      >
        <span className={FINANCE_CHIP_CLASS}>
          <Wallet aria-hidden="true" />
          <strong>{balanceLabel}</strong>
        </span>
        <Button
          type="button"
          className="h-11 rounded-xl bg-white px-4 text-slate-900 shadow-lg shadow-black/10 hover:bg-white/90"
          disabled={!walletState.isSuccess}
          onClick={() => setChargeOpen(true)}
        >
          <Plus aria-hidden="true" />
          {t("pages.app.layout.sidebar.balanceCard.actions.addFunds")}
        </Button>
      </FinanceHero>
      <WalletChargeFlow
        balanceUsdmicro={balance}
        open={chargeOpen}
        onOpenChange={setChargeOpen}
        requiresSubscription={subscriptionState.data?.plan.is_default === true}
        onOpenPricing={openPricingFeature}
      />
    </>
  );
}
