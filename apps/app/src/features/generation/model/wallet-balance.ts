/**
 * Backend application code for "existing wallet debt blocks a new
 * generation" (ai_gateway AI_GATEWAY_INSUFFICIENT_BALANCE).
 */
export const INSUFFICIENT_BALANCE_ERROR_CODE = 1802;

/**
 * The backend allows generating at a zero balance and charges afterwards;
 * it only rejects new generations while the wallet is in debt.
 */
export function isWalletInDebt(balanceUsdmicro: number | undefined) {
  return typeof balanceUsdmicro === "number" && balanceUsdmicro < 0;
}
