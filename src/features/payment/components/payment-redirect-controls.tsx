import { useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppTranslate, useSecondsCountDown } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { formatLocalizedNumber } from "@/utils";

const REDIRECT_SECONDS = 10;

export function PaymentRedirectControls({
  paymentUrl,
}: {
  paymentUrl: string;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { seconds } = useSecondsCountDown(REDIRECT_SECONDS);
  const redirected = useRef(false);
  const redirect = useCallback(() => {
    if (redirected.current) return;
    redirected.current = true;
    window.location.assign(paymentUrl);
  }, [paymentUrl]);
  useEffect(() => {
    if (seconds === 0) redirect();
  }, [seconds, redirect]);
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
