import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import type { SchemaChargeWalletResponse } from "@/services/api";
import { formatLocalizedNumber, microDollarToToken } from "@/utils";

export function PaymentReviewStep({
  payment,
  onBack,
  onPay,
}: {
  payment: SchemaChargeWalletResponse;
  onBack: () => void;
  onPay: () => void;
}) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const tokenAmount = formatLocalizedNumber({
    value: microDollarToToken(payment.amount_usdmicro),
  });
  const formatRials = (value: number) =>
    t("pages.payment.redirect.amountRials", {
      amount: formatLocalizedNumber({ value }),
    });

  return (
    <div className="space-y-6">
      <header className="pe-12">
        <div className="bg-primary/12 text-primary mb-4 flex size-11 items-center justify-center rounded-2xl">
          <ShieldCheck aria-hidden="true" className="size-5" />
        </div>
        <DialogTitle className="text-xl font-semibold">
          {t("pages.app.layout.sidebar.balanceCard.chargeWallet.reviewTitle")}
        </DialogTitle>
        <DialogDescription className="mt-2 leading-6">
          {t(
            "pages.app.layout.sidebar.balanceCard.chargeWallet.reviewDescription",
            { amount: tokenAmount },
          )}
        </DialogDescription>
      </header>
      <div className="bg-muted/25 space-y-4 rounded-2xl border p-4">
        <PriceRow
          label={t("pages.payment.redirect.initialAmount")}
          value={formatRials(payment.amount_irr_without_tax)}
        />
        <PriceRow
          label={t("pages.payment.redirect.tax", {
            percent: formatLocalizedNumber({ value: payment.tax_percent }),
          })}
          value={formatRials(payment.tax_amount_irr)}
        />
        <div className="bg-border h-px" />
        <PriceRow
          emphasized
          label={t("pages.payment.redirect.finalAmount")}
          value={formatRials(payment.total_amount_irr)}
        />
      </div>
      <div className="border-primary/20 bg-primary/8 text-muted-foreground rounded-xl border p-3 text-xs leading-5">
        {t(
          "pages.app.layout.sidebar.balanceCard.chargeWallet.securePaymentHint",
        )}
      </div>
      <div className="space-y-2">
        <Button
          className="h-12 w-full font-semibold transition-transform duration-150 active:scale-[0.98]"
          onClick={onPay}
        >
          {t("pages.app.layout.sidebar.balanceCard.chargeWallet.payAction", {
            amount: formatLocalizedNumber({ value: payment.total_amount_irr }),
          })}
          <ExternalLink aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          className="h-11 w-full transition-transform duration-150 active:scale-[0.98]"
          onClick={onBack}
        >
          <ArrowRight aria-hidden="true" />
          {t("pages.app.layout.sidebar.balanceCard.chargeWallet.editAmount")}
        </Button>
      </div>
    </div>
  );
}

function PriceRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={emphasized ? "font-medium" : "text-muted-foreground"}>
        {label}
      </span>
      <span
        dir="rtl"
        className={
          emphasized
            ? "text-lg font-bold tabular-nums"
            : "font-medium tabular-nums"
        }
      >
        {value}
      </span>
    </div>
  );
}
