type PricingTier = Record<string, unknown>;

export type ModelUsdmicroRange = {
  max: number;
  min: number;
};

export const normalizePricingTiers = (
  pricingTiers: unknown,
): readonly PricingTier[] => {
  return Array.isArray(pricingTiers) ? pricingTiers : [];
};

export const getTierPriceUsdmicroRange = (
  pricingTiers: readonly PricingTier[],
): ModelUsdmicroRange | null => {
  let min: number | undefined;
  let max: number | undefined;

  pricingTiers.forEach((tier) => {
    const price = tier.price_usdmicro;

    if (
      typeof price !== "number" ||
      !Number.isSafeInteger(price) ||
      price < 0
    ) {
      return;
    }

    min = min === undefined ? price : Math.min(min, price);
    max = max === undefined ? price : Math.max(max, price);
  });

  if (min === undefined || max === undefined) {
    return null;
  }

  return { min, max };
};
