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

export const usePayments = (enabled = true) => {
  const { useQuery } = useReactQueryApi();

  return useQuery(
    "get",
    "/payment",
    { params: { query: { limit: 100 } } },
    { enabled },
  );
};
