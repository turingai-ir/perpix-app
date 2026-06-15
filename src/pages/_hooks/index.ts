import { useReactQueryApi } from "@/hook/app";

export * from "./paid-action-guard";

export const useUser = () => {
  const { useQuery } = useReactQueryApi();

  const userState = useQuery("get", "/user/get-info");

  return {
    userState,
  };
};
