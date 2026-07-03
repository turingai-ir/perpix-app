import { useReactQueryApi } from "@/hook/app";

export const usePaymentStatus = (paymentUuid?: string) => {
  const { useQuery } = useReactQueryApi();

  return useQuery(
    "get",
    "/payment/{payment_uuid}",
    {
      params: { path: { payment_uuid: paymentUuid ?? "" } },
    },
    { enabled: !!paymentUuid },
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
    "/payment/list",
    { params: { query: { offset, limit } } },
    { enabled },
  );
};
