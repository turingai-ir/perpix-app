import { useReactQueryApi } from "@/hooks";

export function usePaymentDetail(paymentUuid: string) {
  const api = useReactQueryApi();

  const query = api.useQuery(
    "get",
    "/api/admin/v1/payments/{resource_uuid}",
    {
      params: {
        path: {
          resource_uuid: paymentUuid,
        },
      },
    },
    {
      enabled: Boolean(paymentUuid),
      staleTime: 30_000,
    },
  );

  return query;
}
