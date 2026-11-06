import { useMemo } from "react";

import { usePlanTiers } from "@/feature/pricing";
import { useWallet, useWalletTransactions } from "@/feature/wallet";
import type { SchemaGetWalletTransactionsResponse } from "@/services/api";
import { formatTokenAmount } from "@/utils";

import { getRunwayDays, LOW_RUNWAY_DAYS, summarizeActivity } from "./activity";
import type { RingTone } from "./days-ring";

const getTone = (isFree: boolean, isExpiring: boolean): RingTone => {
  if (isFree) return "free";
  return isExpiring ? "expiring" : "active";
};

export function useAccountWidget() {
  const walletState = useWallet();
  const { tiers, isLoading: isTiersLoading } = usePlanTiers();
  const transactionsState = useWalletTransactions({
    type: "WITHDRAW",
    limit: 100,
  });

  const balanceUsdmicro = walletState.data?.balance_usdmicro;
  const hasBalance = typeof balanceUsdmicro === "number";
  const isFree = !tiers || tiers.status === "free";

  const transactions = (
    transactionsState.data as unknown as
      SchemaGetWalletTransactionsResponse | undefined
  )?.transactions;
  const activity = useMemo(
    () => (transactions ? summarizeActivity(transactions) : null),
    [transactions],
  );

  const runwayDays =
    hasBalance && activity
      ? getRunwayDays(balanceUsdmicro, activity.series)
      : null;
  const isLowRunway = runwayDays !== null && runwayDays <= LOW_RUNWAY_DAYS;

  return {
    isLoading: walletState.isLoading || isTiersLoading,
    runwayDays,
    isLowRunway,
    tiers,
    isFree,
    tone: getTone(isFree, tiers?.isExpiring ?? false),
    isZeroBalance: hasBalance && balanceUsdmicro <= 0,
    balanceText: hasBalance ? formatTokenAmount(balanceUsdmicro) : null,
    activity,
  };
}
