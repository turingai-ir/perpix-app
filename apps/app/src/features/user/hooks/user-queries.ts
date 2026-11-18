import { useReactQueryApi } from "@/shared/hooks/app";
import { useQueryClient } from "@tanstack/react-query";

export const useUser = () => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/api/v1/user/me", undefined, {
    meta: { bootBlocking: true },
  });
};

export const useEditUserInfo = () => {
  const queryClient = useQueryClient();
  const { useMutation, queryOptions } = useReactQueryApi();
  return useMutation("patch", "/api/v1/user/me", {
    onSuccess: (user) => {
      queryClient.setQueryData(
        queryOptions("get", "/api/v1/user/me", undefined).queryKey,
        user,
      );
    },
  });
};
