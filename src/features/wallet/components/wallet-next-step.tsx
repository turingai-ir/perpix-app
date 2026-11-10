import { WalletCards } from "lucide-react";
import { useNavigate } from "react-router";

import { APP_ROUTES_KEY } from "@/app/router/routes";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { useWallet } from "../hooks/wallet-queries";
import { useWalletChargeDialog } from "../hooks/use-wallet-charge-dialog";

const KEY = "pages.payment.result.nextStep.chargeWallet";

/**
 * After a subscription purchase the wallet is still empty, and users expect
 * to start generating. Explains that generations are paid from the wallet and
 * opens the charge flow in the app.
 */
export function WalletNextStep({
  hasPaidSubscription,
}: {
  hasPaidSubscription: boolean;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const navigate = useNavigate();
  const walletState = useWallet(hasPaidSubscription);
  const { openWalletCharge } = useWalletChargeDialog();
  const balance = walletState.data?.balance_usdmicro;

  if (!hasPaidSubscription || typeof balance !== "number" || balance > 0) {
    return null;
  }

  return (
    <Alert className="mb-2 text-start" data-wallet-next-step>
      <WalletCards aria-hidden="true" />
      <AlertTitle>{t(`${KEY}.title`)}</AlertTitle>
      <AlertDescription>
        <p>{t(`${KEY}.description`)}</p>
        <Button
          className="mt-3 h-11 w-full"
          onClick={() => {
            openWalletCharge();
            navigate(APP_ROUTES_KEY.app.path);
          }}
        >
          {t(`${KEY}.action`)}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
