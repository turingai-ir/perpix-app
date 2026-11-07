import { type FC } from "react";

import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { PaymentAmount } from "@/features/payment";
import {
  SupportedCurrencyMap,
  type SchemaSupportedCurrency,
} from "@/shared/api";

type PricingPlanPriceProps = {
  currency?: SchemaSupportedCurrency;
  basePriceIrr: number;
  discountedPriceIrr: number;
  durationDays?: number;
};

const getDiscountPercent = (
  basePriceIrr: number,
  discountedPriceIrr: number,
): number | null => {
  if (
    !Number.isSafeInteger(basePriceIrr) ||
    !Number.isSafeInteger(discountedPriceIrr) ||
    basePriceIrr <= 0 ||
    discountedPriceIrr >= basePriceIrr
  ) {
    return null;
  }

  const discountHundredths =
    (BigInt(basePriceIrr) - BigInt(discountedPriceIrr)) * 100n;
  const base = BigInt(basePriceIrr);
  return discountHundredths % base === 0n
    ? Number(discountHundredths / base)
    : null;
};

const PricingPlanPrice: FC<PricingPlanPriceProps> = ({
  basePriceIrr,
  discountedPriceIrr,
  durationDays,
  currency = SupportedCurrencyMap.IRR,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const discountPercent = getDiscountPercent(basePriceIrr, discountedPriceIrr);
  const hasDiscount = discountedPriceIrr < basePriceIrr;

  return (
    <div className="flex flex-col gap-1.5 rounded-2xl bg-black/22 p-4 shadow-[inset_0_0_0_1px_rgb(255_255_255/7%)]">
      <div className="flex flex-wrap items-baseline gap-2">
        <strong className="text-3xl leading-tight font-extrabold tracking-tight whitespace-nowrap">
          <span className="sr-only">
            {t(
              hasDiscount
                ? "features.pricing.discountedPrice"
                : "features.pricing.currentPrice",
            )}
            :{" "}
          </span>
          <PaymentAmount amount={discountedPriceIrr} currency={currency} />
        </strong>
        {durationDays ? (
          <span className="text-muted-foreground text-xs">
            {t("features.pricing.perDuration", {
              days: durationDays.toLocaleString("fa-IR"),
            })}
          </span>
        ) : null}
      </div>
      {hasDiscount ? (
        <div className="text-muted-foreground flex flex-wrap items-center gap-2.5 text-sm">
          <s className="whitespace-nowrap decoration-1">
            <span className="sr-only">
              {t("features.pricing.previousPrice")}:{" "}
            </span>
            <PaymentAmount amount={basePriceIrr} currency={currency} />
          </s>
          {discountPercent !== null ? (
            <span className="bg-accent-emerald/16 text-accent-emerald rounded-full px-2 py-0.5 text-xs font-bold">
              {t("features.pricing.discountPercent", {
                percent: discountPercent,
              })}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default PricingPlanPrice;
