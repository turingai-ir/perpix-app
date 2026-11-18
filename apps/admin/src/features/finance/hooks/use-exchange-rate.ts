import { useReactQueryApi } from "@/hooks";

export function useExchangeRate() {
  const api = useReactQueryApi();

  const query = api.useQuery(
    "get",
    "/api/admin/v1/currency-exchange-rate",
    {},
    {
      staleTime: 60_000,
    },
  );

  return query;
}
