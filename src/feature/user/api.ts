import { useReactQueryApi } from "@/hooks/app";
import { useQueryClient } from "@tanstack/react-query";

export const useUser = () => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/api/v1/user/get-info", undefined);
};

export const useEditUserInfo = () => {
  const queryClient = useQueryClient();
  const { useMutation, queryOptions } = useReactQueryApi();
  return useMutation("patch", "/api/v1/user/edit-info", {
    onSuccess: (user) => {
      queryClient.setQueryData(
        queryOptions("get", "/api/v1/user/get-info", undefined).queryKey,
        user,
      );
    },
  });
};
