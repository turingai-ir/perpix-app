import { useReactQueryApi } from "@/hooks/app";

export function usePaymentDetails(intentUuid: string) {
  const { useQuery } = useReactQueryApi();
  return useQuery(
    "get",
    "/api/v1/payment-intents/{intent_uuid}/details",
    {
      params: { path: { intent_uuid: intentUuid } },
    },
    { staleTime: Infinity },
  );
}
