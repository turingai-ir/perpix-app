import { microDollarToToken } from "@/utils";

type PricingTier = Record<string, unknown>;

export type ModelTokenRange = {
  max: number;
  min: number;
};

export const normalizePricingTiers = (
  pricingTiers: unknown,
): readonly PricingTier[] => {
  return Array.isArray(pricingTiers) ? pricingTiers : [];
};

export const getTierPriceTokenRange = (
  pricingTiers: readonly PricingTier[],
): ModelTokenRange | null => {
  let min: number | undefined;
  let max: number | undefined;

  pricingTiers.forEach((tier) => {
    const price = tier.price_usdmicro;

    if (typeof price !== "number" || !Number.isFinite(price)) {
      return;
    }

    const token = microDollarToToken(price);

    min = min === undefined ? token : Math.min(min, token);
    max = max === undefined ? token : Math.max(max, token);
  });

  if (min === undefined || max === undefined) {
    return null;
  }

  return { min, max };
};
