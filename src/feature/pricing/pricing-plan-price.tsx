import { type FC } from "react";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { formatLocalizedNumber } from "@/utils";

type PricingPlanPriceProps = {
  basePriceIrr: number;
  discountedPriceIrr: number;
};

const getDiscountPercent = (
  basePriceIrr: number,
  discountedPriceIrr: number,
): number => {
  if (basePriceIrr <= 0) {
    return 0;
  }

  return Math.max(
    0,
    Math.round(((basePriceIrr - discountedPriceIrr) / basePriceIrr) * 100),
  );
};

const PricingPlanPrice: FC<PricingPlanPriceProps> = ({
  basePriceIrr,
  discountedPriceIrr,
}) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const previousPrice = formatLocalizedNumber({
    value: basePriceIrr,
  });
  const discountedPrice = formatLocalizedNumber({
    value: discountedPriceIrr,
  });
  const discountPercent = getDiscountPercent(basePriceIrr, discountedPriceIrr);
  const hasDiscount = discountedPriceIrr < basePriceIrr;

  if (!hasDiscount) {
    return (
      <p className="mt-3 text-4xl font-bold tracking-tight">
        {discountedPrice} {t("common.rials")}
      </p>
    );
  }

  return (
    <dl className="border-border/70 bg-muted/40 mt-5 rounded-xl border p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 text-sm">
        <dt className="text-muted-foreground">
          {t("features.pricing.previousPrice")}
        </dt>
        <dd className="text-muted-foreground decoration-muted-foreground/70 whitespace-nowrap line-through">
          {previousPrice} {t("common.rials")}
        </dd>
      </div>
      <div className="border-border/70 my-3 border-t" />
      <div className="flex items-end justify-between gap-3">
        <dt className="font-medium">{t("features.pricing.discountedPrice")}</dt>
        <dd className="flex flex-wrap items-center justify-end gap-2 text-end">
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            {t("features.pricing.discountPercent", {
              percent: discountPercent,
            })}
          </span>
          <span className="text-2xl font-bold tracking-tight whitespace-nowrap">
            {discountedPrice} {t("common.rials")}
          </span>
        </dd>
      </div>
    </dl>
  );
};

export default PricingPlanPrice;
