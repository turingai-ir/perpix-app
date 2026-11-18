import { useReactQueryApi } from "@/hooks";

export function useWalletDetail(walletUuid: string) {
  const api = useReactQueryApi();

  const query = api.useQuery(
    "get",
    "/api/admin/v1/wallets/{resource_uuid}",
    {
      params: {
        path: {
          resource_uuid: walletUuid,
        },
      },
    },
    {
      enabled: Boolean(walletUuid),
      staleTime: 30_000,
    },
  );

  return query;
}
