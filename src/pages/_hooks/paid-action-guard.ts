import { useCallback } from "react";
import { useNavigate } from "react-router";

import { useWallet } from "./api";
import { APP_KEYS } from "@/utils";

const MIN_PAID_ACTION_BALANCE_USDMICRO = 10_000;

type VoidAction = (...args: never[]) => void;
type AsyncAction = (...args: never[]) => Promise<unknown>;

export class PaidActionRequirementError extends Error {
  constructor() {
    super("Paid action requirements are not met.");
    this.name = "PaidActionRequirementError";
  }
}

export const usePaidActionGuard = () => {
  const navigate = useNavigate();

  const walletState = useWallet();

  const canRunPaidAction = useCallback(() => {
    return (
      (walletState.data?.balance_usdmicro ?? 0) >=
      MIN_PAID_ACTION_BALANCE_USDMICRO
    );
  }, [walletState.data?.balance_usdmicro]);

  const navigateToPricing = useCallback(() => {
    navigate(APP_KEYS.URL_HASH.pricing);
  }, [navigate]);

  const guardAction = useCallback(
    <TAction extends VoidAction>(action: TAction): TAction =>
      ((...args: Parameters<TAction>) => {
        if (!canRunPaidAction()) {
          navigateToPricing();
          return;
        }

        return action(...args);
      }) as TAction,
    [canRunPaidAction, navigateToPricing],
  );

  const guardAsyncAction = useCallback(
    <TAction extends AsyncAction>(action: TAction): TAction =>
      (async (...args: Parameters<TAction>) => {
        if (!canRunPaidAction()) {
          navigateToPricing();
          throw new PaidActionRequirementError();
        }

        return action(...args);
      }) as TAction,
    [canRunPaidAction, navigateToPricing],
  );

  return {
    canRunPaidAction,
    guardAction,
    guardAsyncAction,
  };
};
