import { useReactQueryApi } from "@/hook/app";

export const useUser = () => {
  const { useQuery } = useReactQueryApi();
  return useQuery("get", "/user/get-info");
};

export const useEditUserInfo = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("patch", "/user/edit-info");
};
