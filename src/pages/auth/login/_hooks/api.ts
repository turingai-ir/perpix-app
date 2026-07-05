import { useReactQueryApi } from "@/hooks/app";

export const useStart = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/user/start");
};

export const useLogin = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/user/login");
};

export const useResetPassword = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/user/reset-password");
};

export const useSetPassword = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/user/set-password");
};

export const useResendOtp = () => {
  const { useMutation } = useReactQueryApi();
  return useMutation("post", "/user/resend-otp");
};
