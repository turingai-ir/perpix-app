import { useState } from "react";

import { usePaymentRedirect } from "@/features/payment";
import ErrorSection from "@/shared/components/error-section";
import LoadingSection from "@/shared/components/loading-section";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatTokenAmount, parseTokenAmount } from "@/shared/utils";

import { CheckoutStepMotion } from "./checkout-step-motion";
import { SubscriptionRequiredStep } from "./subscription-required-step";
import { TokenAmountStep } from "./token-amount-step";
import { useChargeWallet, useTopupPolicy } from "../hooks/wallet-queries";
import { WalletChargeSurface } from "./wallet-charge-surface";
import type { WalletChargeReason } from "../hooks/use-wallet-charge-dialog";

type WalletChargeFlowProps = {
  balanceUsdmicro: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiresSubscription: boolean;
  onOpenPricing: () => void;
  reason?: WalletChargeReason;
};

export function WalletChargeFlow({
  balanceUsdmicro,
  open,
  onOpenChange,
  requiresSubscription,
  onOpenPricing,
  reason,
}: WalletChargeFlowProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const chargeWalletState = useChargeWallet();
  const { openPaymentUrl } = usePaymentRedirect();
  const [amount, setAmount] = useState("");
  const policy = useTopupPolicy(open && !requiresSubscription);

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      chargeWalletState.reset();
    }
  };
  const createPayment = async (nextAmount: string) => {
    const amountUsdmicro = parseTokenAmount(nextAmount);
    if (amountUsdmicro === null) return;
    setAmount(nextAmount);
    chargeWalletState.reset();
    try {
      const response = await chargeWalletState.mutateAsync({
        body: { amount_usdmicro: amountUsdmicro },
      });
      handleOpenChange(false);
      if (response.payment_url) {
        openPaymentUrl(response);
      } else {
        window.location.assign(`/payment/verify/${response.execution_uuid}`);
      }
    } catch {
      // The mutation state renders the localized recovery action.
    }
  };

  let content = policy.isError ? (
    <ErrorSection onRetry={() => void policy.refetch()} />
  ) : (
    <LoadingSection />
  );
  let stepKey = "amount";
  if (policy.data) {
    content = (
      <TokenAmountStep
        balance={formatTokenAmount(balanceUsdmicro)}
        limits={{
          minUsdmicro: policy.data.min_amount_usdmicro,
          maxUsdmicro: policy.data.max_amount_usdmicro,
        }}
        initialAmount={amount}
        isError={chargeWalletState.isError}
        isPending={chargeWalletState.isPending}
        notice={
          reason
            ? t(
                `pages.app.layout.sidebar.balanceCard.chargeWallet.reasons.${reason}`,
              )
            : undefined
        }
        onRetry={chargeWalletState.reset}
        onSubmit={createPayment}
      />
    );
  }
  if (requiresSubscription) {
    stepKey = "subscription";
    content = (
      <SubscriptionRequiredStep
        onOpenPricing={() => {
          handleOpenChange(false);
          onOpenPricing();
        }}
      />
    );
  }

  return (
    <WalletChargeSurface
      open={open}
      onOpenChange={handleOpenChange}
      closeLabel={t("pages.app.layout.sidebar.balanceCard.chargeWallet.close")}
    >
      <CheckoutStepMotion stepKey={stepKey}>{content}</CheckoutStepMotion>
    </WalletChargeSurface>
  );
}
