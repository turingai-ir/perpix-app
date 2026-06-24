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
import { useAppTranslate, useSecondsCountDown } from "@/hook";
import { APP_I18_KEYS } from "@/services/i18";
import { formatLocalizedNumber } from "@/utils";

const PAYMENT_REDIRECT_COUNTDOWN_SECONDS = 10;

type PaymentRedirectParams = {
  paymentUrl?: string | null;
  amountIrr?: number | null;
};

type PendingPaymentRedirect = {
  paymentUrl: string;
  amountIrr: number;
};

type PaymentRedirectContextValue = {
  openPaymentUrl: (params: PaymentRedirectParams) => void;
};

type PaymentRedirectListener = (params: PendingPaymentRedirect) => void;

const taxPercent = Number(import.meta.env.VITE_PERPIX_TAX_PERCENT ?? 0);
const normalizedTaxPercent = Number.isFinite(taxPercent) ? taxPercent : 0;
const paymentRedirectListeners = new Set<PaymentRedirectListener>();

function emitPaymentRedirect({
  paymentUrl,
  amountIrr = 0,
}: PaymentRedirectParams) {
  if (!paymentUrl) {
    return;
  }

  paymentRedirectListeners.forEach((listener) => {
    listener({
      paymentUrl,
      amountIrr: amountIrr ?? 0,
    });
  });
}

function getTaxedAmount(amountIrr: number) {
  return Math.round(amountIrr * (1 + normalizedTaxPercent / 100));
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
    window.location.assign(pendingPayment.paymentUrl);
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

  const taxedAmount = pendingPayment
    ? getTaxedAmount(pendingPayment.amountIrr)
    : 0;
  const taxAmount = taxedAmount - (pendingPayment?.amountIrr ?? 0);
  const progressValue =
    ((PAYMENT_REDIRECT_COUNTDOWN_SECONDS - seconds) /
      PAYMENT_REDIRECT_COUNTDOWN_SECONDS) *
    100;
  const formatCurrency = useCallback(
    (amountIrr: number) =>
      t("pages.payment.redirect.amountRials", {
        amount: formatLocalizedNumber({ value: amountIrr }),
      }),
    [t],
  );

  return (
    <Dialog open={!!pendingPayment}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader className="text-right!">
          <DialogTitle>{t("pages.payment.redirect.title")}</DialogTitle>
          <DialogDescription>
            {t("pages.payment.redirect.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">
              {t("pages.payment.redirect.initialAmount")}
            </span>
            <span className="font-medium">
              {formatCurrency(pendingPayment?.amountIrr ?? 0)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">
              {t("pages.payment.redirect.tax", {
                percent: formatLocalizedNumber({
                  value: normalizedTaxPercent,
                }),
              })}
            </span>
            <span className="font-medium">{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 border-t pt-4">
            <span className="font-medium">
              {t("pages.payment.redirect.finalAmount")}
            </span>
            <span className="text-lg font-semibold">
              {formatCurrency(taxedAmount)}
            </span>
          </div>
        </div>

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
