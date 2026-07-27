import { useReactQueryApi } from "@/hooks/app";

export const useStart = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/api/v1/user/start");
};

export const useLogin = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/api/v1/user/login");
};

export const useResetPassword = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/api/v1/user/reset-password");
};

export const useSetPassword = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/api/v1/user/set-password");
};

export const useResendOtp = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/api/v1/user/resend-otp");
};
