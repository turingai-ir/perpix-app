import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import type { SchemaChargeWalletResponse } from "@/services/api";
import { microDollarToToken, tokenToMicroDollar } from "@/utils";

import { CheckoutStepMotion } from "./checkout-step-motion";
import { PaymentReviewStep } from "./payment-review-step";
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
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [payment, setPayment] = useState<SchemaChargeWalletResponse | null>(
    null,
  );

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setPayment(null);
      chargeWalletState.reset();
    }
  };
  const createPayment = async (nextAmount: string) => {
    setAmount(nextAmount);
    chargeWalletState.reset();
    try {
      const response = await chargeWalletState.mutateAsync({
        body: { amount_usdmicro: tokenToMicroDollar(Number(nextAmount)) },
      });
      setPayment(response);
    } catch {
      // The mutation state renders the localized recovery action.
    }
  };

  let content = (
    <TokenAmountStep
      balance={microDollarToToken(balanceUsdmicro)}
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
  } else if (payment) {
    stepKey = "review";
    content = (
      <PaymentReviewStep
        payment={payment}
        onBack={() => setPayment(null)}
        onPay={() => window.location.assign(payment.payment_url)}
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
