import { getPaymentViewStatus } from "./status";

import { useReactQueryApi } from "@/hooks/app";

export const usePaymentStatus = (executionUuid?: string) => {
  const { useQuery } = useReactQueryApi();

  return useQuery(
    "get",
    "/api/v1/payment-executions/{execution_uuid}",
    {
      params: { path: { execution_uuid: executionUuid ?? "" } },
    },
    {
      enabled: !!executionUuid,
      refetchInterval: (query) => {
        const payment = query.state.data;
        if (!payment || query.state.status === "error") return false;
        const status = getPaymentViewStatus(payment);
        return status === "pending" || status === "processing" ? 3000 : false;
      },
    },
  );
};

type UsePaymentsParams = {
  enabled?: boolean;
  offset?: number;
  limit?: number;
};

export const usePayments = ({
  enabled = true,
  offset = 0,
  limit = 100,
}: UsePaymentsParams = {}) => {
  const { useQuery } = useReactQueryApi();

  return useQuery(
    "get",
    "/api/v1/payment-intents",
    { params: { query: { offset, limit } } },
    { enabled },
  );
};

export const useRetryPayment = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation(
    "post",
    "/api/v1/payment-intents/{intent_uuid}/executions",
  );
};
