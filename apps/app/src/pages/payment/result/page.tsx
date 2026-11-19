import { PaymentResultPage } from "@/features/payment/components/payment-result-page";
import { useActiveSubscription } from "@/features/pricing";
import { WalletNextStep } from "@/features/wallet";

/** Mounted only after fulfillment, so it reads the freshly bought plan. */
function SubscriptionWalletNextStep() {
  const activeSubscriptionState = useActiveSubscription();
  return (
    <WalletNextStep
      hasPaidSubscription={
        activeSubscriptionState.data?.plan.is_default === false
      }
    />
  );
}

export default function PaymentResultRoute() {
  return <PaymentResultPage successNextStep={<SubscriptionWalletNextStep />} />;
}
