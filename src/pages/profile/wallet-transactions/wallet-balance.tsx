import { Wallet } from "lucide-react";
import { useAppTranslate } from "@/hooks";
import { useWallet, WalletChargeFlow } from "@/feature/wallet";
import { useActiveSubscription, usePricingFeature } from "@/feature/pricing";
import { financeNumber } from "../_components/finance-format";

export function WalletBalance() {
  const { t, i18n } = useAppTranslate();
  const wallet = useWallet();
  const subscription = useActiveSubscription();
  const { openPricingFeature } = usePricingFeature();
  if (!wallet.data && wallet.fetchStatus === "paused")
    return (
      <p className="finance-balance" role="status">
        {t("pages.profile.finance.offline")}
      </p>
    );
  if (!wallet.data)
    return (
      <div className="finance-balance" role="status">
        {t(
          wallet.isError
            ? "pages.profile.finance.balanceError"
            : "pages.profile.finance.loading",
        )}
        {wallet.isError && (
          <button
            type="button"
            className="finance-text-button"
            onClick={() => wallet.refetch()}
          >
            {t("pages.profile.finance.retry")}
          </button>
        )}
      </div>
    );
  return (
    <div className="finance-balance">
      <div className="finance-balance-heading">
        <Wallet size={17} aria-hidden="true" />
        <span>{t("pages.profile.finance.balance")}</span>
        <span className="finance-wallet-state">
          {t(
            wallet.data.is_active
              ? "pages.profile.finance.walletActive"
              : "pages.profile.finance.walletInactive",
          )}
        </span>
      </div>
      <div className="finance-balance-value" data-testid="wallet-balance">
        <bdi>
          {financeNumber(wallet.data.balance_usdmicro, i18n.language, true)}
        </bdi>
        <span>{t("pages.profile.finance.token")}</span>
      </div>
      {wallet.isError && (
        <p role="status">
          {t("pages.profile.finance.stale")}{" "}
          <button
            type="button"
            className="finance-text-button"
            onClick={() => wallet.refetch()}
          >
            {t("pages.profile.finance.retry")}
          </button>
        </p>
      )}
      {wallet.fetchStatus === "paused" && (
        <p role="status">{t("pages.profile.finance.offline")}</p>
      )}
      {wallet.data.is_active && subscription.isPending && (
        <p role="status">
          {t(
            subscription.fetchStatus === "paused"
              ? "pages.profile.finance.offline"
              : "pages.profile.finance.loading",
          )}
        </p>
      )}
      {wallet.data.is_active &&
        wallet.isSuccess &&
        wallet.fetchStatus !== "paused" &&
        subscription.isSuccess &&
        subscription.fetchStatus !== "paused" && (
          <div className="finance-charge">
            <WalletChargeFlow
              balanceUsdmicro={wallet.data.balance_usdmicro}
              requiresSubscription={subscription.data.plan.is_default === true}
              onOpenPricing={() => openPricingFeature()}
            />
          </div>
        )}
      {wallet.data.is_active && subscription.isError && (
        <p className="finance-subscription-error">
          {t("pages.profile.finance.subscriptionError")}{" "}
          <button
            className="finance-text-button"
            type="button"
            onClick={() => subscription.refetch()}
          >
            {t("pages.profile.finance.retry")}
          </button>
        </p>
      )}
    </div>
  );
}
