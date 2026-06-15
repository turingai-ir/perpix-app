import { useCallback } from "react";
import { useNavigate } from "react-router";

import { useReactQueryApi } from "@/hook/app";
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
  const { useQuery } = useReactQueryApi();
  const navigate = useNavigate();

  const userState = useQuery("get", "/user/get-info");

  const canRunPaidAction = useCallback(() => {
    const user = userState.data;

    return (
      user?.active_subscription?.is_active === true &&
      (user.default_wallet?.balance_usdmicro ?? 0) >=
        MIN_PAID_ACTION_BALANCE_USDMICRO
    );
  }, [userState.data]);

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
