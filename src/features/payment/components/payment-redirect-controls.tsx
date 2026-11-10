import { usePaymentRedirect } from "../hooks/use-payment-redirect";

import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatLocalizedNumber } from "@/shared/utils";

const REDIRECT_SECONDS = 10;

export function PaymentRedirectControls({
  paymentUrl,
}: {
  paymentUrl: string;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { redirect, seconds } = usePaymentRedirect(
    paymentUrl,
    REDIRECT_SECONDS,
  );
  return (
    <>
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">
          {t("pages.payment.redirect.autoRedirect", {
            seconds: formatLocalizedNumber({ value: seconds }),
          })}
        </p>
        <Progress
          value={((REDIRECT_SECONDS - seconds) / REDIRECT_SECONDS) * 100}
        />
      </div>
      <Button onClick={redirect}>{t("pages.payment.redirect.continue")}</Button>
    </>
  );
}
