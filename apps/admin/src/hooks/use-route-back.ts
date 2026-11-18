import { useCallback } from "react";
import { useNavigate } from "react-router";

import { APP_ROUTES_KEY } from "@/router/routes";

type RouterHistoryState = {
  idx?: unknown;
};

const hasPreviousRoute = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const historyState = window.history.state as RouterHistoryState | null;
  return typeof historyState?.idx === "number" && historyState.idx > 0;
};

export const useRouteBack = (
  fallbackPath: string = APP_ROUTES_KEY.app.path,
): (() => void) => {
  const navigate = useNavigate();

  return useCallback(() => {
    if (hasPreviousRoute()) {
      navigate(-1);
      return;
    }

    navigate(fallbackPath, { replace: true });
  }, [fallbackPath, navigate]);
};
