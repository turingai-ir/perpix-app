import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useAppTranslate, useSecondsCountDown } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { formatLocalizedNumber } from "@/utils";
import {
  PaymentBreakdown,
  type PaymentBreakdownData,
} from "@/features/payment";

export * from "./api";
export * from "./checkout-session";
export * from "./status";
export { PaymentEventsProvider } from "./payment-events";

const PAYMENT_REDIRECT_COUNTDOWN_SECONDS = 10;

type PaymentRedirectParams = PaymentBreakdownData & {
  payment_url: string | null;
};

type PendingPaymentRedirect = PaymentBreakdownData & {
  payment_url: string;
};

type PaymentRedirectContextValue = {
  openPaymentUrl: (params: PaymentRedirectParams) => void;
};

type PaymentRedirectListener = (params: PendingPaymentRedirect) => void;

const paymentRedirectListeners = new Set<PaymentRedirectListener>();

function emitPaymentRedirect(payment: PaymentRedirectParams) {
  if (!payment.payment_url) return;
  const pending = { ...payment, payment_url: payment.payment_url };
  paymentRedirectListeners.forEach((listener) => listener(pending));
}

export function PaymentRedirectPortal() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [pendingPayment, setPendingPayment] =
    useState<PendingPaymentRedirect | null>(null);
  const { seconds, setSeconds } = useSecondsCountDown(
    PAYMENT_REDIRECT_COUNTDOWN_SECONDS,
  );
  const hasRedirectedRef = useRef(false);

  const redirectToPayment = useCallback(() => {
    if (!pendingPayment || hasRedirectedRef.current) {
      return;
    }

    hasRedirectedRef.current = true;
    window.location.assign(pendingPayment.payment_url);
  }, [pendingPayment]);

  useEffect(() => {
    const listener: PaymentRedirectListener = (payment) => {
      hasRedirectedRef.current = false;
      setSeconds(PAYMENT_REDIRECT_COUNTDOWN_SECONDS);
      setPendingPayment(payment);
    };

    paymentRedirectListeners.add(listener);

    return () => {
      paymentRedirectListeners.delete(listener);
    };
  }, [setSeconds]);

  useEffect(() => {
    if (!pendingPayment || seconds > 0) {
      return;
    }

    redirectToPayment();
  }, [pendingPayment, redirectToPayment, seconds]);

  const progressValue =
    ((PAYMENT_REDIRECT_COUNTDOWN_SECONDS - seconds) /
      PAYMENT_REDIRECT_COUNTDOWN_SECONDS) *
    100;

  return (
    <Dialog open={!!pendingPayment}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader className="text-right!">
          <DialogTitle>{t("pages.payment.redirect.title")}</DialogTitle>
          <DialogDescription>
            {t("pages.payment.redirect.description")}
          </DialogDescription>
        </DialogHeader>

        {pendingPayment && <PaymentBreakdown payment={pendingPayment} />}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t("pages.payment.redirect.autoRedirect", {
                seconds: formatLocalizedNumber({ value: seconds }),
              })}
            </span>
          </div>
          <Progress value={progressValue} />
        </div>

        <DialogFooter>
          <Button className="w-full sm:w-auto" onClick={redirectToPayment}>
            {t("pages.payment.redirect.continue")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function usePaymentRedirect(): PaymentRedirectContextValue {
  return {
    openPaymentUrl: emitPaymentRedirect,
  };
}
