import type {
  SchemaSubscriptionPlanResponse,
  SchemaUserSubscriptionResponse,
} from "@/services/api";

export type PlanTierStatus = "free" | "upgradable" | "top";

export const EXPIRING_SOON_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface PlanTiers {
  status: PlanTierStatus;
  currentPlan: SchemaSubscriptionPlanResponse | null;
  /** Every plan on the price ladder, cheapest first, current plan included. */
  ladder: SchemaSubscriptionPlanResponse[];
  /** Plans that do not go down a tier, cheapest first. */
  upgrades: SchemaSubscriptionPlanResponse[];
  nextPlan: SchemaSubscriptionPlanResponse | null;
  daysLeft: number | null;
  expiresAt: string | null;
  /** 0..1 share of the paid period that is still left. */
  remainingRatio: number | null;
  isExpiring: boolean;
  /** The current paid plan may be bought again (last days only). */
  canRenew: boolean;
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

/** Backend has no tier field yet, so the discounted price is the tier rank. */
export const getPlanRank = (plan: SchemaSubscriptionPlanResponse): number => {
  if (isFiniteNumber(plan.discounted_price_usdmicro)) {
    return plan.discounted_price_usdmicro;
  }
  return isFiniteNumber(plan.discounted_price_irr)
    ? plan.discounted_price_irr
    : 0;
};

const getSellablePlans = (plans: readonly SchemaSubscriptionPlanResponse[]) =>
  plans
    .filter((plan) => plan.is_active !== false && plan.is_default !== true)
    .sort((a, b) => getPlanRank(a) - getPlanRank(b));

const getDaysLeft = (expiresAt: string, now: number): number | null => {
  const expiresMs = Date.parse(expiresAt);
  if (Number.isNaN(expiresMs)) return null;
  return Math.max(0, Math.ceil((expiresMs - now) / DAY_MS));
};

const getRemainingRatio = (
  daysLeft: number | null,
  durationDays: number,
): number | null => {
  if (daysLeft === null || !isFiniteNumber(durationDays) || durationDays <= 0) {
    return null;
  }
  return Math.min(1, Math.max(0, daysLeft / durationDays));
};

export function resolvePlanTiers(
  plans: readonly SchemaSubscriptionPlanResponse[],
  subscription: SchemaUserSubscriptionResponse | null | undefined,
  now: number = Date.now(),
): PlanTiers {
  const sellable = getSellablePlans(plans);
  const plan = subscription?.plan ?? null;

  if (!subscription || !plan || plan.is_default === true) {
    return {
      status: "free",
      currentPlan: plan,
      ladder: sellable,
      upgrades: sellable,
      nextPlan: sellable[0] ?? null,
      daysLeft: null,
      expiresAt: null,
      remainingRatio: null,
      isExpiring: false,
      canRenew: false,
    };
  }

  const currentRank = getPlanRank(plan);
  const upgrades = sellable.filter(
    (candidate) =>
      candidate.uuid !== plan.uuid && getPlanRank(candidate) >= currentRank,
  );
  const higher = upgrades.filter(
    (candidate) => getPlanRank(candidate) > currentRank,
  );
  const daysLeft = getDaysLeft(subscription.expires_at, now);
  const isExpiring = daysLeft !== null && daysLeft <= EXPIRING_SOON_DAYS;
  const status: PlanTierStatus = higher.length > 0 ? "upgradable" : "top";

  const ladder = sellable.some((item) => item.uuid === plan.uuid)
    ? sellable
    : [...sellable, plan].sort((a, b) => getPlanRank(a) - getPlanRank(b));

  return {
    status,
    currentPlan: plan,
    ladder,
    upgrades,
    nextPlan: higher[0] ?? null,
    daysLeft,
    expiresAt: subscription.expires_at,
    remainingRatio: getRemainingRatio(daysLeft, plan.duration_days),
    isExpiring,
    canRenew: isExpiring,
  };
}

export type PlanAccess = "buy" | "upgrade" | "renew" | "current" | "lower";

/** What the user may do with a plan given the plan they already own. */
export function getPlanAccess(
  plan: SchemaSubscriptionPlanResponse,
  tiers: PlanTiers,
): PlanAccess {
  const current = tiers.currentPlan;
  if (tiers.status === "free" || !current) return "buy";
  if (plan.uuid === current.uuid) return tiers.canRenew ? "renew" : "current";
  const diff = getPlanRank(plan) - getPlanRank(current);
  if (diff < 0) return "lower";
  return diff > 0 ? "upgrade" : "buy";
}
