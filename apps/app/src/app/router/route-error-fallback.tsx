import { useEffect } from "react";
import { useRouteError } from "react-router";
import { ErrorFallbackPage } from "@/shared/components/error-boundary";
import { captureError } from "@/shared/lib/observability";

export function RouteErrorFallback() {
  const error = useRouteError();

  useEffect(() => {
    captureError(error);
  }, [error]);

  return <ErrorFallbackPage />;
}
