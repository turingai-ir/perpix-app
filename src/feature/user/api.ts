import { useReactQueryApi } from "@/hooks/app";

export const useUser = () => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/api/v1/user/get-info", undefined);
};

export const useEditUserInfo = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("patch", "/api/v1/user/edit-info");
};
