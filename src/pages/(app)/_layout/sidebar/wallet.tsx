import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Muted } from "@/components/ui/typography";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { formatLocalizedNumber, microDollarToToken } from "@/utils";
import { usePricingFeature, useActiveSubscription } from "@/feature/pricing";
import { useWallet, WalletChargeFlow } from "@/feature/wallet";

function AppLayoutSidebarWallet() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  const walletState = useWallet();
  const activeSubscriptionState = useActiveSubscription();
  const { openPricingFeature } = usePricingFeature();
  const shouldBlockWalletCharge = activeSubscriptionState.data?.plan.is_default;
  const balanceUsdmicro = walletState.data?.balance_usdmicro ?? 0;

  return (
    <Card className="text-sidebar-foreground overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045] shadow-[inset_0_1px_rgb(255_255_255/0.09),0_12px_32px_rgb(0_0_0/0.1)] backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-2">
          <CardTitle className="text-sm font-medium">
            <Muted>{t("pages.app.layout.sidebar.balanceCard.title")}</Muted>
          </CardTitle>
          <div className="flex items-center gap-1">
            <div className="text-sidebar-foreground text-2xl font-bold tracking-[-0.03em]">
              {formatLocalizedNumber({
                value: microDollarToToken(
                  walletState.data?.balance_usdmicro || 0,
                ),
              })}
            </div>
            <small>{t("common.token")}</small>
          </div>
          <WalletChargeFlow
            balanceUsdmicro={balanceUsdmicro}
            requiresSubscription={shouldBlockWalletCharge === true}
            onOpenPricing={() => openPricingFeature()}
          />
        </div>
      </CardHeader>
    </Card>
  );
}

export default AppLayoutSidebarWallet;
