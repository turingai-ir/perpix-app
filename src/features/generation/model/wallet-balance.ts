/** True when the wallet cannot pay even the cheapest generation of a model. */
export function isBalanceBelowCost(
  balanceUsdmicro: number | undefined,
  minCostUsdmicro: number | null | undefined,
) {
  if (typeof balanceUsdmicro !== "number") return false;
  if (typeof minCostUsdmicro !== "number" || minCostUsdmicro <= 0) return false;
  return balanceUsdmicro < minCostUsdmicro;
}
