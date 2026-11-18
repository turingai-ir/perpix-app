import type { components } from "@/services/api/api";
import { parseUsdmicro } from "@/utils/usdmicro";

export type TopupPolicy = components["schemas"]["AdminTopupPolicyResponse"];
type PolicyBody = components["schemas"]["UpdateTopupPolicyRequest"];

export const MAX_TIERS = 20;
export const MAX_PROFIT_PERCENT = 1000;

/** Amounts are typed in micro-dollars, exactly as the server stores them. */
export type TierForm = { fromUsdmicro: string; discountPercent: string };

export type TopupPolicyForm = {
  profitPercent: string;
  minUsdmicro: string;
  maxUsdmicro: string;
  tiers: TierForm[];
};

export type TopupPolicyError =
  | "profit"
  | "limits"
  | "firstTier"
  | "tierOrder"
  | "tierDiscount"
  | "tierCount";

const whole = (value: string): number | null =>
  /^\d+$/.test(value.trim()) ? Number(value) : null;

export const policyToForm = (policy: TopupPolicy): TopupPolicyForm => ({
  profitPercent: String(policy.profit_percent),
  minUsdmicro: String(policy.min_amount_usdmicro),
  maxUsdmicro: String(policy.max_amount_usdmicro),
  tiers: policy.tiers.map((tier) => ({
    fromUsdmicro: String(tier.from_amount_usdmicro),
    discountPercent: String(tier.discount_percent),
  })),
});

/** The same rules the server enforces, so mistakes show up before saving. */
export const validateTopupPolicyForm = (
  form: TopupPolicyForm,
): TopupPolicyError[] => {
  const errors: TopupPolicyError[] = [];
  const profit = whole(form.profitPercent);
  const min = parseUsdmicro(form.minUsdmicro);
  const max = parseUsdmicro(form.maxUsdmicro);
  if (profit === null || profit > MAX_PROFIT_PERCENT) errors.push("profit");
  if (min === null || max === null || min < 1 || min > max) {
    errors.push("limits");
  }
  const froms = form.tiers.map((tier) => parseUsdmicro(tier.fromUsdmicro));
  const discounts = form.tiers.map((tier) => whole(tier.discountPercent));
  if (form.tiers.length === 0 || form.tiers.length > MAX_TIERS) {
    errors.push("tierCount");
  }
  if (froms[0] !== 0) errors.push("firstTier");
  const ascending = froms.every(
    (from, index) =>
      from !== null && (index === 0 || from > (froms[index - 1] ?? 0)),
  );
  if (!ascending) errors.push("tierOrder");
  const valid = discounts.every(
    (discount, index) =>
      discount !== null &&
      discount <= 100 &&
      (index === 0 || discount >= (discounts[index - 1] ?? 0)),
  );
  if (!valid) errors.push("tierDiscount");
  return errors;
};

export const formToBody = (form: TopupPolicyForm): PolicyBody => ({
  profit_percent: Number(form.profitPercent),
  min_amount_usdmicro: parseUsdmicro(form.minUsdmicro) ?? 0,
  max_amount_usdmicro: parseUsdmicro(form.maxUsdmicro) ?? 0,
  tiers: form.tiers.map((tier) => ({
    from_amount_usdmicro: parseUsdmicro(tier.fromUsdmicro) ?? 0,
    discount_percent: Number(tier.discountPercent),
  })),
});

/** Our profit after a tier gives back a share of it, e.g. 20% with a 25% tier is 15%. */
export const effectiveProfit = (profit: string, discount: string): string => {
  const p = whole(profit);
  const d = whole(discount);
  if (p === null || d === null || d > 100) return "—";
  return String(Math.round(p * (100 - d)) / 100);
};
