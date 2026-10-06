import { useState } from "react";

import { Button } from "@/components/ui/button";
import { usePaymentRedirect } from "@/feature/payment";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { formatTokenAmount, parseTokenAmount } from "@/utils";

import { CheckoutStepMotion } from "./checkout-step-motion";
import { SubscriptionRequiredStep } from "./subscription-required-step";
import { TokenAmountStep } from "./token-amount-step";
import { useChargeWallet } from "./api";
import { WalletChargeSurface } from "./wallet-charge-surface";

type WalletChargeFlowProps = {
  balanceUsdmicro: number;
  requiresSubscription: boolean;
  onOpenPricing: () => void;
};

export function WalletChargeFlow({
  balanceUsdmicro,
  requiresSubscription,
  onOpenPricing,
}: WalletChargeFlowProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const chargeWalletState = useChargeWallet();
  const { openPaymentUrl } = usePaymentRedirect();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
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

  let content = (
    <TokenAmountStep
      balance={formatTokenAmount(balanceUsdmicro)}
      initialAmount={amount}
      isError={chargeWalletState.isError}
      isPending={chargeWalletState.isPending}
      onRetry={chargeWalletState.reset}
      onSubmit={createPayment}
    />
  );
  let stepKey = "amount";
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
      trigger={
        <Button
          className="h-auto p-0 transition-transform duration-150 active:scale-[0.97]"
          variant="link"
        >
          {t("pages.app.layout.sidebar.balanceCard.chargeWallet.title")}
        </Button>
      }
    >
      <CheckoutStepMotion stepKey={stepKey}>{content}</CheckoutStepMotion>
    </WalletChargeSurface>
  );
}
