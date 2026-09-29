import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { usePaymentEvents } from "../hooks/use-payment-events";
import type { PaymentEvent } from "../model/payment-event";

import { useReactQueryApi } from "@/hooks/app";
import { APP_KEYS } from "@/utils";
import { cookies } from "@/utils/cookies";

export function PaymentEventsProvider() {
  const queryClient = useQueryClient();
  const { queryOptions } = useReactQueryApi();
  const accessToken = cookies().get(APP_KEYS.COOKIES.ACCESS_TOKEN) as
    | string
    | undefined;
  const listKey = queryOptions(
    "get",
    "/api/v1/payment-intents",
    undefined,
  ).queryKey;
  const walletKey = queryOptions(
    "get",
    "/api/v1/wallet/wallet",
    undefined,
  ).queryKey;
  const userKey = queryOptions(
    "get",
    "/api/v1/user/get-info",
    undefined,
  ).queryKey;

  const refreshAccount = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: listKey });
    void queryClient.invalidateQueries({ queryKey: walletKey });
    void queryClient.invalidateQueries({ queryKey: userKey });
  }, [queryClient, listKey, walletKey, userKey]);

  const handleChange = useCallback(
    (event: PaymentEvent) => {
      refreshAccount();
      const executionKey = queryOptions(
        "get",
        "/api/v1/payment-executions/{execution_uuid}",
        { params: { path: { execution_uuid: event.execution_uuid } } },
      ).queryKey;
      const intentKey = queryOptions(
        "get",
        "/api/v1/payment-intents/{intent_uuid}",
        { params: { path: { intent_uuid: event.intent_uuid } } },
      ).queryKey;
      void queryClient.invalidateQueries({ queryKey: executionKey });
      void queryClient.invalidateQueries({ queryKey: intentKey });
    },
    [queryClient, queryOptions, refreshAccount],
  );

  usePaymentEvents({
    accessToken,
    onChange: handleChange,
    onReconnect: refreshAccount,
  });
  return null;
}
