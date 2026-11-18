import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth-http";
import { bootstrapSession, startSession } from "../services/session-manager";
import type { paths } from "@/services/api/api";

type LoginBody =
  paths["/api/v1/auth/login"]["post"]["requestBody"]["content"]["application/json"];

export function useLogin() {
  return useMutation({
    networkMode: "always",
    retry: false,
    mutationFn: async (body: LoginBody) => {
      await bootstrapSession();
      startSession(await login(body));
    },
  });
}
