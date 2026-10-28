import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import {
  WalletChargeDescription,
  WalletChargeTitle,
} from "./wallet-charge-surface";

export function SubscriptionRequiredStep({
  onOpenPricing,
}: {
  onOpenPricing: () => void;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const key =
    "pages.app.layout.sidebar.balanceCard.chargeWallet.subscriptionRequiredAlert";

  return (
    <div className="space-y-6">
      <header className="pe-12">
        <div className="bg-destructive/10 text-destructive mb-4 flex size-11 items-center justify-center rounded-2xl">
          <AlertCircle aria-hidden="true" className="size-5" />
        </div>
        <WalletChargeTitle className="text-xl font-semibold">
          {t(`${key}.title`)}
        </WalletChargeTitle>
        <WalletChargeDescription className="mt-2 leading-6">
          {t(`${key}.description`)}
        </WalletChargeDescription>
      </header>
      <Button
        className="h-12 w-full font-semibold transition-transform duration-150 active:scale-[0.98]"
        onClick={onOpenPricing}
      >
        {t(`${key}.cta`)}
      </Button>
    </div>
  );
}
