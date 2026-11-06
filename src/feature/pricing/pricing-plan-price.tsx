import { type FC } from "react";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import styles from "./pricing-plan-card.module.css";
import { PaymentAmount } from "@/features/payment";
import {
  SupportedCurrencyMap,
  type SchemaSupportedCurrency,
} from "@/services/api";

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
    <div className={styles.price}>
      <div className={styles.priceMain}>
        <strong>
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
          <span>
            {t("features.pricing.perDuration", {
              days: durationDays.toLocaleString("fa-IR"),
            })}
          </span>
        ) : null}
      </div>
      {hasDiscount ? (
        <div className={styles.priceMeta}>
          <s>
            <span className="sr-only">
              {t("features.pricing.previousPrice")}:{" "}
            </span>
            <PaymentAmount amount={basePriceIrr} currency={currency} />
          </s>
          {discountPercent !== null ? (
            <span className={styles.discount}>
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
