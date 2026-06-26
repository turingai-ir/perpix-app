import { useCallback, useContext, useMemo } from "react";
import { toast } from "sonner";

import { appContext } from "./context";

import { useAppTranslate } from "@/hook/i18";

export class OfflineMutationGuardError extends Error {
  constructor() {
    super("Mutation cannot run while the app is offline.");
    this.name = "OfflineMutationGuardError";
    Object.setPrototypeOf(this, OfflineMutationGuardError.prototype);
  }
}

const isAppOffline = () =>
  typeof navigator !== "undefined" && !navigator.onLine;

const showOfflineMutationMessage = (message: string) => {
  toast.error(message);
};

export const useApp = () => {
  const context = useContext(appContext);
  if (!context) {
    throw new Error("App Provider is required");
  }
  return context;
};

export const useReactQueryApi = () => {
  const context = useContext(appContext);
  const { t } = useAppTranslate();

  if (!context) {
    throw new Error("App Provider is required");
  }

  const useGuardedMutation: typeof context.apiHook.useMutation = useCallback(
    (method, path, options, queryClient) => {
      type OnMutate = NonNullable<NonNullable<typeof options>["onMutate"]>;

      const previousOnMutate = options?.onMutate;

      const guardedOptions = {
        ...options,
        onMutate: async (...args: Parameters<OnMutate>) => {
          if (isAppOffline()) {
            showOfflineMutationMessage(t("common.fetchErrors.offlineMutation"));
            throw new OfflineMutationGuardError();
          }

          return previousOnMutate?.(...args);
        },
      } as typeof options;

      return context.apiHook.useMutation(
        method,
        path,
        guardedOptions,
        queryClient,
      );
    },
    [context.apiHook, t],
  );

  return useMemo(
    () => ({
      ...context.apiHook,
      useMutation: useGuardedMutation,
    }),
    [context.apiHook, useGuardedMutation],
  );
};
