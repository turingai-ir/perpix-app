import { useEffect, useSyncExternalStore, type PropsWithChildren } from "react";
import { Navigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { bootstrapSession, retryBootstrap } from "../services/session-manager";
import { sessionStore } from "../services/session-store";
import { useReactQueryApi, useAppTranslate } from "@/hooks";
import { Button } from "@/components/ui/button";

export function SessionGate({ children }: PropsWithChildren) {
  const { t } = useAppTranslate();
  const { status } = useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.getSnapshot,
  );
  useEffect(() => {
    void bootstrapSession();
  }, []);
  const retry = useMutation({
    mutationFn: retryBootstrap,
    networkMode: "always",
  });
  const api = useReactQueryApi();
  const identity = api.useQuery(
    "get",
    "/api/admin/v1/auth/me",
    {},
    {
      enabled: status === "authenticated",
      retry: false,
      staleTime: 0,
      gcTime: 0,
    },
  );
  if (status === "anonymous") return <Navigate to="/login" replace />;
  if (status === "unavailable" || identity.isError)
    return (
      <main
        dir="rtl"
        className="flex min-h-svh flex-col items-center justify-center gap-5 p-6"
      >
        <p role="alert">
          {t(
            identity.isError ? "overview.accessError" : "overview.sessionError",
          )}
        </p>
        <Button
          onClick={() => {
            if (status === "unavailable") retry.mutate();
            else void identity.refetch();
          }}
          disabled={retry.isPending || identity.isFetching}
        >
          {t("overview.retry")}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            sessionStore.clear();
          }}
        >
          {t("overview.backLogin")}
        </Button>
      </main>
    );
  if (status === "initializing" || !identity.isSuccess)
    return (
      <p role="status" dir="rtl" className="p-10 text-center">
        {t("overview.loading")}
      </p>
    );
  return children;
}
