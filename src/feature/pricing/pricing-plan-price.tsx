import { type FC } from "react";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { formatTomanAmount } from "@/utils";

type PricingPlanPriceProps = {
  basePriceIrr: number;
  discountedPriceIrr: number;
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
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const previousPrice = formatTomanAmount(basePriceIrr);
  const discountedPrice = formatTomanAmount(discountedPriceIrr);
  const discountPercent = getDiscountPercent(basePriceIrr, discountedPriceIrr);
  const hasDiscount = discountedPriceIrr < basePriceIrr;

  return (
    <dl className="border-border/70 bg-muted/40 mt-5 rounded-xl border p-4 shadow-sm">
      <div className="flex min-h-5 items-center justify-between gap-3 text-sm">
        {hasDiscount ? (
          <>
            <dt className="text-muted-foreground">
              {t("features.pricing.previousPrice")}
            </dt>
            <dd className="text-muted-foreground decoration-muted-foreground/70 whitespace-nowrap line-through">
              {previousPrice} {t("common.tomans")}
            </dd>
          </>
        ) : null}
      </div>
      <div className="border-border/70 my-3 border-t" />
      <div className="flex items-end justify-between gap-3">
        <dt className="font-medium">
          {t(
            hasDiscount
              ? "features.pricing.discountedPrice"
              : "features.pricing.currentPrice",
          )}
        </dt>
        <dd className="flex flex-wrap items-center justify-end gap-2 text-end">
          {discountPercent !== null ? (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
              {t("features.pricing.discountPercent", {
                percent: discountPercent,
              })}
            </span>
          ) : (
            <span className="w-20" aria-hidden="true" />
          )}
          <span className="text-2xl font-bold tracking-tight whitespace-nowrap">
            {discountedPrice} {t("common.tomans")}
          </span>
        </dd>
      </div>
    </dl>
  );
};

export default PricingPlanPrice;
